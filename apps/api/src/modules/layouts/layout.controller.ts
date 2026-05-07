import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../shared/prisma';

export class LayoutController {
  
  static async getLayouts(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any)?.sub;
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    const layouts = await prisma.layout.findMany({
      where: { userId }
    });
    return layouts;
  }

  static async createLayout(req: FastifyRequest<{ Body: { name: string, config: any } }>, reply: FastifyReply) {
    const userId = (req.user as any)?.sub;
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    const { name, config } = req.body;
    
    const layout = await prisma.layout.create({
      data: {
        userId,
        name,
        config
      }
    });
    return layout;
  }

  static async updateLayout(req: FastifyRequest<{ Params: { id: string }, Body: { name?: string, config?: any } }>, reply: FastifyReply) {
    const userId = (req.user as any)?.sub;
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    const { id } = req.params;
    const { name, config } = req.body;

    const existing = await prisma.layout.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return reply.code(404).send({ error: "Not found" });
    }

    const layout = await prisma.layout.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(config && { config })
      }
    });
    return layout;
  }

  static async deleteLayout(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (req.user as any)?.sub;
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    const { id } = req.params;

    const existing = await prisma.layout.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return reply.code(404).send({ error: "Not found" });
    }

    await prisma.layout.delete({ where: { id } });
    return { success: true };
  }
}
