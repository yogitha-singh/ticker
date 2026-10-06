/* TICKER – data layer. Yahoo Finance via CORS proxies (Yahoo blocks direct browser calls). */
const API = (() => {
  const PROXIES = [
    u => 'https://corsproxy.io/?url=' + encodeURIComponent(u),
    u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
  ];
  const RANGES = {
    '1D': ['5m', '1d'], '5D': ['15m', '5d'], '1M': ['1d', '1mo'], '6M': ['1d', '6mo'],
    'YTD': ['1d', 'ytd'], '1Y': ['1d', '1y'], '5Y': ['1wk', '5y'], 'MAX': ['1mo', 'max'],
  };
  const cache = new Map();
  const H = 'https://query1.finance.yahoo.com';

  // Race both proxies, take the first good JSON response.
  async function yf(url, ttl) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.t < ttl) return hit.d;
    try {
      const d = await Promise.any(PROXIES.map(async p => {
        const r = await fetch(p(url));
        if (r.status === 429) throw new Error('Rate limited');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }));
      cache.set(url, { t: Date.now(), d });
      return d;
    } catch (e) { throw new Error('Network or proxy failure. Try again shortly.'); }
  }

  // Quirk: null entries appear in OHLC arrays for halted/empty bars – filter them.
  async function get(sym, tf = '1D') {
    const [i, r] = RANGES[tf];
    const j = await yf(`${H}/v8/finance/chart/${encodeURIComponent(sym)}?interval=${i}&range=${r}`, 30000);
    const res = j.chart && j.chart.result && j.chart.result[0];
    if (!res) throw new Error('No data for ' + sym);
    const q = res.indicators.quote[0], rows = [];
    (res.timestamp || []).forEach((t, k) => {
      if (q.close[k] == null || q.open[k] == null) return;
      rows.push({ t: t * 1000, o: q.open[k], h: q.high[k], l: q.low[k], c: q.close[k], v: q.volume[k] || 0 });
    });
    const m = res.meta;
    return {
      sym: m.symbol, name: m.longName || m.shortName || m.symbol, cur: m.currency, exch: m.fullExchangeName || m.exchangeName,
      price: m.regularMarketPrice, prev: m.chartPreviousClose ?? m.previousClose, time: m.regularMarketTime * 1000,
      type: m.instrumentType, meta: m, rows,
      open: rows.length ? rows[0].o : null,
    };
  }

  async function search(q) {
    const j = await yf(`${H}/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`, 300000);
    return (j.quotes || []).filter(x => x.symbol);
  }

  async function news(sym) {
    const j = await yf(`${H}/v1/finance/search?q=${encodeURIComponent(sym)}&quotesCount=0&newsCount=5`, 300000);
    return (j.news || []).slice(0, 5);
  }

  // Market is "open" if now is inside the regular session (crypto trades 24/7).
  function isOpen(d) {
    if (!d) return false;
    if (d.type === 'CRYPTOCURRENCY') return true;
    const r = d.meta.currentTradingPeriod && d.meta.currentTradingPeriod.regular, n = Date.now() / 1000;
    return !!r && n >= r.start && n <= r.end;
  }
  return { get, search, news, isOpen };
})();
