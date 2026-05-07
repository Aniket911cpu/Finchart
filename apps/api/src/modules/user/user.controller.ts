import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../shared/prisma';

export const getUserSettings = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user?.sub;
  if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

  const settings = await prisma.userSettings.findUnique({
    where: { userId }
  });

  return reply.send(settings || { defaultSymbol: 'BTC/USDT', defaultTimeframe: '60', emailAlerts: false, browserAlerts: true });
};

export const updateUserSettings = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  const userId = req.user?.sub;
  if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

  const data = req.body;

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { ...data, userId }
  });

  return reply.send(settings);
};

export const getApiKeys = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user?.sub;
  if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: { id: true, label: true, key: true, createdAt: true, lastUsed: true } // Exclude full key in real app, but ok for MVP
  });

  return reply.send(keys);
};

export const createApiKey = async (req: FastifyRequest<{ Body: { label: string } }>, reply: FastifyReply) => {
  const userId = req.user?.sub;
  if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

  // Generate random API key (in production, use a secure crypto method)
  const newKey = `fc_prod_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  const key = await prisma.apiKey.create({
    data: {
      userId,
      label: req.body.label,
      key: newKey,
    }
  });

  return reply.send(key);
};

export const revokeApiKey = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const userId = req.user?.sub;
  if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

  await prisma.apiKey.deleteMany({
    where: { id: req.params.id, userId }
  });

  return reply.send({ success: true });
};
