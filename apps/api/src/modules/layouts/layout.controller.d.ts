import { FastifyRequest, FastifyReply } from 'fastify';
export declare class LayoutController {
    static getLayouts(req: FastifyRequest, reply: FastifyReply): Promise<{
        config: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        userId: string;
        name: string;
        isDefault: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    static createLayout(req: FastifyRequest<{
        Body: {
            name: string;
            config: any;
        };
    }>, reply: FastifyReply): Promise<{
        config: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        userId: string;
        name: string;
        isDefault: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateLayout(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            name?: string;
            config?: any;
        };
    }>, reply: FastifyReply): Promise<{
        config: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        userId: string;
        name: string;
        isDefault: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteLayout(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=layout.controller.d.ts.map