import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../shared/prisma';
import { z } from 'zod';

const createAlertSchema = z.object({
  symbol: z.string(),
  condition: z.enum(['ABOVE', 'BELOW', 'CROSS']),
  price: z.number(),
  message: z.string().optional(),
});

export async function createAlert(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };
  const data = createAlertSchema.parse(request.body);

  const alert = await prisma.alert.create({
    data: {
      userId,
      symbol: data.symbol,
      condition: data.condition,
      price: data.price,
      message: data.message || `Price of ${data.symbol} crossed ${data.price}`,
    },
  });

  return reply.code(201).send(alert);
}

export async function getAlerts(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const alerts = await prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return reply.send(alerts);
}

export async function deleteAlert(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };
  const { id } = request.params;

  // Verify ownership
  const alert = await prisma.alert.findUnique({ where: { id } });
  if (!alert) {
    return reply.code(404).send({ error: 'Alert not found' });
  }
  if (alert.userId !== userId) {
    return reply.code(403).send({ error: 'Forbidden' });
  }

  await prisma.alert.delete({ where: { id } });
  return reply.send({ success: true });
}
