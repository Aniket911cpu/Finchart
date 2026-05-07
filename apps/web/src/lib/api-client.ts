const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchUDFHistory(symbol: string, resolution: string, from: number, to: number) {
  const url = new URL(`${API_URL}/udf/history`);
  url.searchParams.append('symbol', symbol);
  url.searchParams.append('resolution', resolution);
  url.searchParams.append('from', from.toString());
  url.searchParams.append('to', to.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch history');
  const data = await res.json();

  if (data.s === 'ok') {
    const bars = [];
    for (let i = 0; i < data.t.length; i++) {
      bars.push({
        time: data.t[i],
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i]
      });
    }
    return bars;
  }
  
  return [];
}

export async function searchUDFSymbols(query: string) {
  const url = new URL(`${API_URL}/udf/search`);
  url.searchParams.append('query', query);
  
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
}
