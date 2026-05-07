import { FastifyRequest, FastifyReply } from 'fastify';
import { MarketService } from './market.service';

const marketService = new MarketService();

export class UdfController {
  
  static async config(req: FastifyRequest, reply: FastifyReply) {
    return {
      supports_search: true,
      supports_group_request: false,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: true,
      exchanges: [
        { value: "BINANCE", name: "Binance", desc: "Binance Exchange" },
        { value: "NASDAQ", name: "Nasdaq", desc: "Nasdaq Stock Market" }
      ],
      symbols_types: [
        { name: "Crypto", value: "crypto" },
        { name: "Stock", value: "stock" }
      ],
      supported_resolutions: ["1", "3", "5", "15", "30", "60", "120", "240", "D", "W", "M"]
    };
  }

  static async time(req: FastifyRequest, reply: FastifyReply) {
    return Math.floor(Date.now() / 1000);
  }

  static async symbols(req: FastifyRequest<{ Querystring: { symbol: string } }>, reply: FastifyReply) {
    const { symbol } = req.query;
    if (!symbol) return reply.code(400).send("Symbol required");

    const info = await marketService.resolveSymbol(symbol);
    if (!info) return reply.code(404).send("Not found");

    return {
      name: info.name,
      ticker: info.symbol,
      description: info.name,
      type: info.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: info.exchange,
      minmov: 1,
      pricescale: 100, // could be dynamic based on asset
      has_intraday: true,
      has_no_volume: false,
      has_weekly_and_monthly: true,
      supported_resolutions: ["1", "3", "5", "15", "30", "60", "120", "240", "D", "W", "M"],
      volume_precision: 8,
      data_status: "streaming"
    };
  }

  static async search(req: FastifyRequest<{ Querystring: { query: string; type?: string; exchange?: string; limit?: string } }>, reply: FastifyReply) {
    const { query } = req.query;
    if (!query) return [];

    const results = await marketService.searchSymbols(query);
    
    return results.map(r => ({
      symbol: r.symbol,
      full_name: r.name,
      description: r.name,
      exchange: r.exchange,
      type: r.type
    }));
  }

  static async history(req: FastifyRequest<{ Querystring: { symbol: string; resolution: string; from: string; to: string; countback?: string } }>, reply: FastifyReply) {
    const { symbol, resolution, from, to } = req.query;
    
    if (!symbol || !resolution || !from || !to) {
      return reply.code(400).send({ s: "error", errmsg: "Missing parameters" });
    }

    const data = await marketService.getHistory(
      symbol,
      resolution,
      parseInt(from, 10),
      parseInt(to, 10)
    );

    if (data.length === 0) {
      return { s: "no_data" };
    }

    return {
      s: "ok",
      t: data.map(d => d.time),
      o: data.map(d => d.open),
      h: data.map(d => d.high),
      l: data.map(d => d.low),
      c: data.map(d => d.close),
      v: data.map(d => d.volume),
    };
  }
}
