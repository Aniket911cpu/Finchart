import { useQuery } from '@tanstack/react-query';
import { fetchUDFHistory } from '../lib/api-client';
import { idbCache } from '../lib/idb-cache';
export function useMarketData(symbol, timeframe) {
    return useQuery({
        queryKey: ['ohlcv', symbol, timeframe],
        queryFn: async () => {
            // Calculate from/to (e.g. last 1000 candles)
            let intervalSec = 3600;
            if (timeframe === '1')
                intervalSec = 60;
            else if (timeframe === '5')
                intervalSec = 300;
            else if (timeframe === '15')
                intervalSec = 900;
            else if (timeframe === '60')
                intervalSec = 3600;
            else if (timeframe === 'D' || timeframe === '1D')
                intervalSec = 86400;
            const to = Math.floor(Date.now() / 1000);
            const from = to - (intervalSec * 1000); // approx 1000 candles back
            const cacheKey = `${symbol}:${timeframe}:${from}:${to}`;
            try {
                const cachedResult = await idbCache.get(cacheKey);
                if (cachedResult && !cachedResult.stale) {
                    // Revalidate in background if it's close to getting stale, but for now just return cache
                    return cachedResult.data;
                }
                const freshData = await fetchUDFHistory(symbol, timeframe, from, to);
                await idbCache.set(cacheKey, freshData);
                return freshData;
            }
            catch (e) {
                // Fallback if IDB fails
                return fetchUDFHistory(symbol, timeframe, from, to);
            }
        },
        staleTime: 60_000, // Keep fresh for 1 min
        refetchOnWindowFocus: false,
    });
}
//# sourceMappingURL=useMarketData.js.map