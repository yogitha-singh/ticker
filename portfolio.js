/* TICKER – portfolio math + localStorage persistence. */
const Portfolio = (() => {
  const KEY = 'ticker.holdings';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = h => localStorage.setItem(KEY, JSON.stringify(h));

  function add(h) { const a = load(); a.push(h); save(a); }
  function remove(sym) { save(load().filter(x => x.sym !== sym)); }

  // Merge lots per symbol (weighted average cost), then value at live prices.
  function compute(prices) {
    const by = {};
    load().forEach(l => {
      const o = by[l.sym] || (by[l.sym] = { sym: l.sym, qty: 0, cost: 0 });
      o.qty += l.qty; o.cost += l.qty * l.price;
    });
    const rows = Object.values(by).map(o => {
      const p = prices[o.sym], value = p == null ? null : p * o.qty;
      return { ...o, avg: o.cost / o.qty, price: p, value, pnl: value == null ? null : value - o.cost, pct: value == null ? null : (value / o.cost - 1) * 100 };
    });
    const value = rows.reduce((s, r) => s + (r.value || 0), 0);
    const cost = rows.reduce((s, r) => s + r.cost, 0);
    return { rows, value, cost, pnl: value - cost, pct: cost ? (value / cost - 1) * 100 : 0 };
  }
  return { load, add, remove, compute };
})();
