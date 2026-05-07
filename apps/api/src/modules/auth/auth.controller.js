import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';
// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, reply) => {
    const { email, password, username, displayName } = req.body;
    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });
    if (existing)
        return reply.status(409).send({ error: 'Email or username already taken' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, username, passwordHash, name: displayName || username },
        select: { id: true, email: true, username: true, name: true, plan: true }
    });
    // @ts-ignore — fastify-jwt is decorated on the instance
    const token = await reply.jwtSign({ sub: user.id, email: user.email, plan: user.plan });
    return reply.status(201).send({ user, accessToken: token });
};
// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, reply) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
        return reply.status(401).send({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
        return reply.status(401).send({ error: 'Invalid credentials' });
    // @ts-ignore
    const token = await reply.jwtSign({ sub: user.id, email: user.email, plan: user.plan });
    return reply.send({
        user: { id: user.id, email: user.email, username: user.username, name: user.name, plan: user.plan, image: user.image },
        accessToken: token
    });
};
// ─── ME ──────────────────────────────────────────────────────────────────────
export const getMe = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, username: true, name: true, plan: true, image: true, bio: true, timezone: true, createdAt: true }
    });
    return reply.send(user);
};
// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export const forgotPassword = async (req, reply) => {
    // In production: generate OTP, store in Redis TTL=600, send via SendGrid
    // For MVP: just confirm the email exists
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    // Always respond 200 to prevent email enumeration
    return reply.send({ message: 'If that email exists, a reset link has been sent.' });
};
// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export const logout = async (req, reply) => {
    // In production: add access token to Redis denylist
    return reply.send({ message: 'Logged out successfully' });
};
//# sourceMappingURL=auth.controller.js.map