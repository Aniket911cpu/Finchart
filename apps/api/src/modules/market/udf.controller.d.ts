import { FastifyRequest, FastifyReply } from 'fastify';
export declare class UdfController {
    static config(req: FastifyRequest, reply: FastifyReply): Promise<{
        supports_search: boolean;
        supports_group_request: boolean;
        supports_marks: boolean;
        supports_timescale_marks: boolean;
        supports_time: boolean;
        exchanges: {
            value: string;
            name: string;
            desc: string;
        }[];
        symbols_types: {
            name: string;
            value: string;
        }[];
        supported_resolutions: string[];
    }>;
    static time(req: FastifyRequest, reply: FastifyReply): Promise<number>;
    static symbols(req: FastifyRequest<{
        Querystring: {
            symbol: string;
        };
    }>, reply: FastifyReply): Promise<{
        name: string;
        ticker: string;
        description: string;
        type: "crypto" | "stock" | "forex";
        session: string;
        timezone: string;
        exchange: string;
        minmov: number;
        pricescale: number;
        has_intraday: boolean;
        has_no_volume: boolean;
        has_weekly_and_monthly: boolean;
        supported_resolutions: string[];
        volume_precision: number;
        data_status: string;
    }>;
    static search(req: FastifyRequest<{
        Querystring: {
            query: string;
            type?: string;
            exchange?: string;
            limit?: string;
        };
    }>, reply: FastifyReply): Promise<{
        symbol: string;
        full_name: string;
        description: string;
        exchange: string;
        type: "crypto" | "stock" | "forex";
    }[]>;
    static history(req: FastifyRequest<{
        Querystring: {
            symbol: string;
            resolution: string;
            from: string;
            to: string;
            countback?: string;
        };
    }>, reply: FastifyReply): Promise<{
        s: string;
        t?: undefined;
        o?: undefined;
        h?: undefined;
        l?: undefined;
        c?: undefined;
        v?: undefined;
    } | {
        s: string;
        t: number[];
        o: number[];
        h: number[];
        l: number[];
        c: number[];
        v: number[];
    }>;
}
//# sourceMappingURL=udf.controller.d.ts.map