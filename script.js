/* TICKER – UI controller */
const $ = s => document.querySelector(s);
const fmt = (n, d = 2) => n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const big = n => n == null ? '—' : n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : fmt(n, 0);
const sgn = n => (n >= 0 ? '+' : '') + fmt(n);
const clock = () => new Date().toLocaleTimeString('en-GB');
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const MOVERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'JPM', 'DIS', 'BA'];
const TFS = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];
const S = { sym: null, tf: '1M', type: 'line', watch: ld('ticker.watch', ['AAPL', 'NVDA', 'BTC-USD']), chart: null, pie: null, data: null, prevPx: null };

/* ---------- selected ticker ---------- */
async function load(sym, quiet) {
  sym = sym.trim().toUpperCase();
  if (!sym) return;
  S.sym = sym; $('#hero').hidden = true; $('#view').hidden = false;
  if (!quiet) $('#skel').hidden = false;
  try {
    const d = await API.get(sym, S.tf);
    if (S.sym !== sym) return;
    S.data = d; render(d);
    history.replaceState(null, '', '?symbol=' + encodeURIComponent(sym));
    if (!quiet) API.news(sym).then(renderNews).catch(() => $('#news').textContent = 'News unavailable.');
  } catch (e) { toast(e.message); }
  $('#skel').hidden = true;
  document.querySelectorAll('.wrow').forEach(r => r.classList.toggle('sel', r.dataset.s === sym));
}

function render(d) {
  const ch = d.price - d.prev, pct = ch / d.prev * 100, up = ch >= 0, m = d.meta;
  $('#sym').textContent = d.sym; $('#name').textContent = d.name; $('#exch').textContent = `${d.exch} · ${d.cur}`;
  const p = $('#price'); p.textContent = fmt(d.price); p.className = 'price num ' + (up ? 'up' : 'down');
  if (S.prevPx != null && S.prevPx !== d.price) { p.classList.add(d.price > S.prevPx ? 'fu' : 'fd'); }
  S.prevPx = d.price;
  const c = $('#chg'); c.textContent = `${sgn(ch)} (${sgn(pct)}%)`; c.className = 'pill num ' + (up ? 'up' : 'down');
  $('#asof').textContent = 'as of ' + new Date(d.time).toLocaleTimeString('en-GB');
  const avgV = d.rows.length ? d.rows.reduce((s, r) => s + r.v, 0) / d.rows.length : null;
  // Quirk: chart endpoint has no market cap / P/E / beta / yield – shown as — (needs a crumb-auth endpoint).
  const st = [['Open', d.open], ['Prev Close', d.prev], ['Day High', m.regularMarketDayHigh], ['Day Low', m.regularMarketDayLow],
    ['Volume', big(m.regularMarketVolume)], ['Market Cap', '—'], ['52W High', m.fiftyTwoWeekHigh], ['52W Low', m.fiftyTwoWeekLow],
    ['P/E Ratio', '—'], ['Div Yield', '—'], ['Beta', '—'], ['Avg Volume', big(avgV)]];
  $('#stats').innerHTML = st.map(([k, v]) => `<div><small>${k}</small><span>${typeof v === 'number' ? fmt(v) : v}</span></div>`).join('');
  const open = API.isOpen(d), mk = $('#mkt'); mk.className = 'pill ' + (open ? 'open' : 'closed'); mk.innerHTML = `<s class="dot"></s>${open ? 'MARKET OPEN' : 'MARKET CLOSED'}`;
  $('#addW').textContent = S.watch.includes(d.sym) ? '★ Watching' : '★ Watch';
  draw(d, up); $('#last').textContent = clock();
}

function draw(d, up) {
  const ctx = $('#chart').getContext('2d'), col = up ? '#00d97e' : '#ff3b3b';
  S.chart && S.chart.destroy();
  const g = ctx.createLinearGradient(0, 0, 0, 380); g.addColorStop(0, up ? 'rgba(0,217,126,.35)' : 'rgba(255,59,59,.35)'); g.addColorStop(1, 'transparent');
  const candle = S.type === 'candlestick';
  const ds = candle
    ? { label: d.sym, data: d.rows.map(r => ({ x: r.t, o: r.o, h: r.h, l: r.l, c: r.c })), color: { up: '#00d97e', down: '#ff3b3b', unchanged: '#8b95a3' }, borderColor: { up: '#00d97e', down: '#ff3b3b', unchanged: '#8b95a3' } }
    : { label: d.sym, data: d.rows.map(r => ({ x: r.t, y: r.c })), borderColor: col, borderWidth: 2, pointRadius: 0, tension: .15, fill: S.type === 'area', backgroundColor: g };
  S.chart = new Chart(ctx, {
    type: candle ? 'candlestick' : 'line', data: { datasets: [ds] },
    options: {
      maintainAspectRatio: false, animation: { duration: 300 }, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f1419', borderColor: 'rgba(255,255,255,.15)', borderWidth: 1, titleFont: { family: 'JetBrains Mono' }, bodyFont: { family: 'JetBrains Mono' } } },
      scales: { x: { type: 'time', grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8b95a3', maxTicksLimit: 8 } }, y: { position: 'right', grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8b95a3', font: { family: 'JetBrains Mono' } } } },
    },
  });
}

function renderNews(items) {
  $('#news').innerHTML = items.length ? items.map(n => `<a href="${n.link}" target="_blank" rel="noopener">${n.title}<br><small>${n.publisher} · ${ago(n.providerPublishTime)}</small></a>`).join('') : 'No recent headlines.';
}
const ago = t => { const m = Math.max(1, (Date.now() / 1000 - t) / 60 | 0); return m < 60 ? m + 'm ago' : m < 1440 ? (m / 60 | 0) + 'h ago' : (m / 1440 | 0) + 'd ago'; };

/* ---------- watchlist ---------- */
const spark = (rows, up) => {
  if (rows.length < 2) return '<svg width="40" height="20"></svg>';
  const c = rows.map(r => r.c), lo = Math.min(...c), hi = Math.max(...c) || 1, w = 40, h = 20;
  const pts = c.map((v, i) => `${(i / (c.length - 1) * w).toFixed(1)},${(h - (v - lo) / ((hi - lo) || 1) * h).toFixed(1)}`).join(' ');
  return `<svg width="${w}" height="${h}"><polyline points="${pts}" fill="none" stroke="${up ? '#00d97e' : '#ff3b3b'}" stroke-width="1.5"/></svg>`;
};
async function refreshWatch() {
  $('#wCount').textContent = S.watch.length;
  const res = await Promise.all(S.watch.map(s => API.get(s, '1D').catch(() => null))); // all at once
  $('#wList').innerHTML = S.watch.map((s, i) => {
    const d = res[i]; if (!d) return `<div class="wrow" data-s="${s}"><b>${s}</b><span class="muted r">n/a</span></div>`;
    const pct = (d.price / d.prev - 1) * 100, up = pct >= 0;
    return `<div class="wrow ${s === S.sym ? 'sel' : ''}" data-s="${s}"><div><b>${s}</b><small>${d.name}</small></div><div class="r num">${fmt(d.price)}<br><span class="pill ${up ? 'up' : 'down'}">${sgn(pct)}%</span></div>${spark(d.rows, up)}<button class="x" data-x="${s}" aria-label="Remove">✕</button></div>`;
  }).join('');
}

/* ---------- portfolio ---------- */
async function refreshPortfolio() {
  const syms = [...new Set(Portfolio.load().map(h => h.sym))], prices = {};
  const res = await Promise.all(syms.map(s => API.get(s, '1D').catch(() => null)));
  syms.forEach((s, i) => prices[s] = res[i] ? res[i].price : null);
  const P = Portfolio.compute(prices), up = P.pnl >= 0;
  $('#pTotal').textContent = '$' + fmt(P.value); $('#hdrTotal').textContent = '$' + fmt(P.value);
  const pp = $('#pPnl'); pp.className = 'num ' + (up ? 'up' : 'down'); pp.textContent = P.rows.length ? `${sgn(P.pnl)} (${sgn(P.pct)}%)` : 'Add a holding to begin';
  $('#hList').innerHTML = P.rows.map(r => `<div class="hrow num"><span><b>${r.sym}</b> ${fmt(r.qty, 4).replace(/\.?0+$/, '')} @ ${fmt(r.avg)}</span><span class="${r.pnl >= 0 ? 'up' : 'down'}">${fmt(r.value)} · ${sgn(r.pct)}% <a href="#" data-rm="${r.sym}" class="muted">✕</a></span></div>`).join('');
  S.pie && S.pie.destroy();
  if (P.rows.length) S.pie = new Chart($('#pie'), { type: 'doughnut', data: { labels: P.rows.map(r => r.sym), datasets: [{ data: P.rows.map(r => r.value || 0), borderColor: '#0f1419', backgroundColor: ['#00d4ff', '#a855f7', '#00d97e', '#f5a524', '#ff6b9d', '#6ee7f9', '#8b95a3'] }] }, options: { maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { color: '#8b95a3', boxWidth: 10 } } } } });
}

/* ---------- movers ---------- */
async function refreshMovers() {
  const res = (await Promise.all(MOVERS.map(s => API.get(s, '1D').catch(() => null)))).filter(Boolean)
    .map(d => ({ s: d.sym, p: d.price, pct: (d.price / d.prev - 1) * 100, v: d.meta.regularMarketVolume || 0 }));
  const list = (a, f) => a.slice(0, 5).map(r => `<div class="mrow" data-s="${r.s}"><span>${r.s}</span><span>${f(r)}</span></div>`).join('');
  const pc = r => `${fmt(r.p)} <span class="${r.pct >= 0 ? 'up' : 'down'}">${sgn(r.pct)}%</span>`;
  $('#mg').innerHTML = list([...res].sort((a, b) => b.pct - a.pct), pc);
  $('#ml').innerHTML = list([...res].sort((a, b) => a.pct - b.pct), pc);
  $('#ma').innerHTML = list([...res].sort((a, b) => b.v - a.v), r => big(r.v) + ' sh');
}

/* ---------- search ---------- */
let sTimer, items = [], idx = -1;
const q = $('#q'), sg = $('#sugg');
q.addEventListener('input', () => {
  clearTimeout(sTimer);
  if (!q.value.trim()) { sg.hidden = true; return; }
  sTimer = setTimeout(async () => {
    try { items = await API.search(q.value.trim()); idx = -1; paint(); } catch (e) { toast(e.message); }
  }, 300);
});
function paint() {
  sg.hidden = !items.length;
  sg.innerHTML = items.map((x, i) => `<div class="${i === idx ? 'on' : ''}" data-s="${x.symbol}"><b class="num">${x.symbol}</b><span>${x.shortname || x.longname || ''}</span><small>${x.exchDisp || x.exchange} · ${x.quoteType}</small></div>`).join('');
}
function pick(s) { sg.hidden = true; q.value = ''; q.blur(); load(s); }
sg.addEventListener('mousedown', e => { const r = e.target.closest('[data-s]'); if (r) pick(r.dataset.s); });
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, items.length - 1); paint(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); paint(); e.preventDefault(); }
  else if (e.key === 'Enter') pick(items[Math.max(idx, 0)]?.symbol || q.value); // typed "aapl" works even before suggestions load
  else if (e.key === 'Escape') { sg.hidden = true; q.blur(); }
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); q.focus(); }
  if (document.activeElement.tagName === 'INPUT' || !S.watch.length) return;
  const i = S.watch.indexOf(S.sym);
  if (e.key === 'ArrowRight') load(S.watch[(i + 1) % S.watch.length]);
  if (e.key === 'ArrowLeft') load(S.watch[(i - 1 + S.watch.length) % S.watch.length]);
});

/* ---------- wiring ---------- */
$('#tfs').innerHTML = TFS.map(t => `<button data-tf="${t}" class="${t === S.tf ? 'on' : ''}">${t}</button>`).join('');
$('#tfs').onclick = e => { const t = e.target.dataset.tf; if (!t) return; S.tf = t; document.querySelectorAll('#tfs button').forEach(b => b.classList.toggle('on', b.dataset.tf === t)); load(S.sym); };
const syncTypes = () => document.querySelectorAll('#types button').forEach(b => b.classList.toggle('on', b.dataset.t === S.type));
$('#types').onclick = e => { const t = e.target.dataset.t; if (!t) return; S.type = t; syncTypes(); S.data && render(S.data); };
document.querySelector('.chips').onclick = e => e.target.tagName === 'BUTTON' && load(e.target.textContent);
$('#wList').onclick = e => {
  const x = e.target.dataset.x; if (x) { S.watch = S.watch.filter(s => s !== x); localStorage.setItem('ticker.watch', JSON.stringify(S.watch)); refreshWatch(); return e.stopPropagation(); }
  const r = e.target.closest('.wrow'); if (r) load(r.dataset.s);
};
$('#addW').onclick = () => {
  if (!S.sym || S.watch.includes(S.sym)) return;
  S.watch.push(S.sym); localStorage.setItem('ticker.watch', JSON.stringify(S.watch)); toast(S.sym + ' added to watchlist'); refreshWatch(); $('#addW').textContent = '★ Watching';
};
$('#addT').onclick = () => q.focus();
document.querySelector('.movers').onclick = e => { const r = e.target.closest('[data-s]'); if (r) load(r.dataset.s); };
$('#addH').onclick = () => { $('#hf').sym.value = S.sym || ''; $('#dlg').showModal(); };
$('#hf').addEventListener('submit', e => {
  if (e.submitter.value !== 'ok') return;
  const f = e.target, h = { sym: f.sym.value.trim().toUpperCase(), qty: +f.qty.value, price: +f.price.value, date: f.date.value };
  if (!h.sym || !(h.qty > 0) || !(h.price > 0)) return;
  Portfolio.add(h); toast(h.sym + ' added to portfolio'); refreshPortfolio();
});
$('#hList').onclick = e => { const s = e.target.dataset.rm; if (s) { e.preventDefault(); Portfolio.remove(s); toast(s + ' removed'); refreshPortfolio(); } };

/* ---------- boot + auto refresh ---------- */
syncTypes(); refreshWatch(); refreshPortfolio(); refreshMovers();
const initial = new URLSearchParams(location.search).get('symbol');
if (initial) load(initial);
setInterval(() => { if (S.sym && API.isOpen(S.data)) load(S.sym, true); }, 15000);
setInterval(() => { refreshMovers(); refreshWatch(); refreshPortfolio(); $('#last').textContent = clock(); }, 30000);
