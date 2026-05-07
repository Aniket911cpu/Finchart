import { prisma } from '../../shared/prisma';
// ─── LIST NOTIFICATIONS ───────────────────────────────────────────────────────
export const listNotifications = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const skip = (page - 1) * limit;
    const where = { userId };
    if (req.query.read !== undefined)
        where.read = req.query.read === 'true';
    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.notification.count({ where })
    ]);
    return reply.send({ notifications, total, page, totalPages: Math.ceil(total / limit) });
};
// ─── MARK READ ────────────────────────────────────────────────────────────────
export const markRead = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    await prisma.notification.updateMany({
        where: { id: req.params.id, userId },
        data: { read: true }
    });
    return reply.send({ success: true });
};
// ─── MARK ALL READ ────────────────────────────────────────────────────────────
export const markAllRead = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    await prisma.notification.updateMany({ where: { userId }, data: { read: true } });
    return reply.send({ success: true });
};
// ─── CLEAR READ ───────────────────────────────────────────────────────────────
export const clearRead = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    await prisma.notification.deleteMany({ where: { userId, read: true } });
    return reply.send({ success: true });
};
// ─── UNREAD COUNT ─────────────────────────────────────────────────────────────
export const unreadCount = async (req, reply) => {
    const userId = req.user?.sub;
    if (!userId)
        return reply.status(401).send({ error: 'Unauthorized' });
    const count = await prisma.notification.count({ where: { userId, read: false } });
    return reply.send({ count });
};
//# sourceMappingURL=notifications.controller.js.map