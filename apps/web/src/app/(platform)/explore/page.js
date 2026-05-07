'use client';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, Newspaper, ArrowRight } from 'lucide-react';
import { useChartStore } from '../../../store/chartStore';
import { useRouter } from 'next/navigation';
export default function ExplorePage() {
    const router = useRouter();
    const setSymbol = useChartStore(s => s.setSymbol);
    const [stats, setStats] = useState(null);
    const [trending, setTrending] = useState([]);
    const [movers, setMovers] = useState([]);
    const [news, setNews] = useState([]);
    useEffect(() => {
        // Fetch mock data from our new API endpoints
        const fetchData = async () => {
            try {
                const [statsRes, trendRes, moverRes, newsRes] = await Promise.all([
                    fetch('http://localhost:3001/market/stats').then(r => r.json()),
                    fetch('http://localhost:3001/market/trending?limit=4').then(r => r.json()),
                    fetch('http://localhost:3001/market/movers?type=gainers').then(r => r.json()),
                    fetch('http://localhost:3001/market/news?limit=4').then(r => r.json()),
                ]);
                setStats(statsRes);
                setTrending(trendRes);
                setMovers(moverRes);
                setNews(newsRes);
            }
            catch (error) {
                console.error("Failed to fetch market overview", error);
            }
        };
        fetchData();
    }, []);
    const openChart = (symbol) => {
        setSymbol(symbol);
        router.push('/terminal');
    };
    return (<div className="flex-1 overflow-y-auto bg-bg-primary p-6 md:p-10 text-text-primary">
      <h1 className="text-3xl font-bold mb-8">Market Overview</h1>

      {/* Global Stats */}
      {stats && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="text-text-secondary text-sm mb-1">Global Market Cap</div>
            <div className="text-2xl font-semibold">${(stats.globalMarketCap / 1e12).toFixed(2)}T</div>
          </div>
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="text-text-secondary text-sm mb-1">24h Volume</div>
            <div className="text-2xl font-semibold">${(stats.volume24h / 1e9).toFixed(2)}B</div>
          </div>
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="text-text-secondary text-sm mb-1">BTC Dominance</div>
            <div className="text-2xl font-semibold">{stats.btcDominance}%</div>
          </div>
          <div className="bg-bg-secondary border border-border p-5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-text-secondary text-sm mb-1">Fear & Greed Index</div>
              <div className="text-2xl font-semibold text-positive">{stats.fearAndGreed.value}</div>
            </div>
            <div className="text-right text-sm font-medium text-positive">
              {stats.fearAndGreed.classification}
            </div>
          </div>
        </div>)}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Trending & Movers) */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Activity size={20} className="text-accent-blue"/>
                <span>Trending Now</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trending.map((item, i) => (<div key={i} onClick={() => openChart(item.symbol)} className="bg-bg-secondary border border-border hover:border-accent-blue/50 p-4 rounded-xl cursor-pointer transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold">{item.symbol}</div>
                      <div className="text-xs text-text-secondary">{item.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className={`text-xs font-medium flex items-center ${item.change24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {item.change24h >= 0 ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                        {Math.abs(item.change24h)}%
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <TrendingUp size={20} className="text-positive"/>
                <span>Top Gainers</span>
              </h2>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-tertiary border-b border-border">
                  <tr>
                    <th className="p-4 font-medium text-text-secondary">Symbol</th>
                    <th className="p-4 font-medium text-text-secondary text-right">Price</th>
                    <th className="p-4 font-medium text-text-secondary text-right">24h Change</th>
                    <th className="p-4 font-medium text-text-secondary text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movers.map((item, i) => (<tr key={i} className="hover:bg-bg-tertiary/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{item.symbol}</div>
                        <div className="text-xs text-text-secondary">{item.name}</div>
                      </td>
                      <td className="p-4 text-right">${item.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                      <td className="p-4 text-right text-positive font-medium">+{item.change24h}%</td>
                      <td className="p-4 text-center">
                        <button onClick={() => openChart(item.symbol)} className="text-accent-blue hover:text-accent-blue-hover p-2 rounded-lg hover:bg-accent-blue/10 transition-colors">
                          <ArrowRight size={16}/>
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (News) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Newspaper size={20} className="text-text-secondary"/>
              <span>Latest News</span>
            </h2>
          </div>
          <div className="space-y-4">
            {news.map((item) => (<a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block bg-bg-secondary border border-border hover:border-accent-blue/30 p-5 rounded-xl transition-colors">
                <div className="text-xs font-medium text-accent-blue mb-2">{item.source}</div>
                <h3 className="font-medium mb-3 line-clamp-2 leading-snug">{item.title}</h3>
                <div className="flex items-center text-xs text-text-muted">
                  <Clock size={12} className="mr-1"/>
                  <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </a>))}
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map