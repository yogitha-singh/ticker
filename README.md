<div align="center">

<img src="demo.png" alt="TICKER - Live stock, crypto and ETF tracker" width="100%" />

<br/>

# TICKER

### Markets, live. In your browser.

A single-page stock, crypto and ETF tracker with a watchlist, portfolio P&L, and live candlestick charts, styled like a professional trading terminal.

<br/>

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-ticker--jet.vercel.app-00d4ff?style=for-the-badge&labelColor=0a0e14)](https://ticker-jet.vercel.app/)
[![Made with Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Yahoo Finance](https://img.shields.io/badge/Yahoo_Finance-API-6001d2?style=for-the-badge)](https://finance.yahoo.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

</div>

---

## What is TICKER?

TICKER is a self-contained market dashboard that runs entirely in your browser. No backend, no API keys, no build step. Search any stock, crypto, ETF, or index across global markets. Track live prices, save a watchlist, and manage a portfolio with real-time P&L.

Built with vanilla JavaScript because a project like this does not need a framework. It needs discipline.

<br/>

<div align="center">

| Global Search | Live Charts | Watchlist | Portfolio | News |
|:---:|:---:|:---:|:---:|:---:|
| Stocks, Crypto, ETFs | Line, Candles, Area | Sparklines + Live | P&L + Allocation | Per Ticker |

</div>

---

## Feature Highlights

<table>
<tr>
<td width="50%" valign="top">

### Market Data
- Global search for stocks, crypto, ETFs, indices
- Live price, day change, day high/low, 52W range, volume
- Line, Candlestick, and Area chart types
- 8 timeframes: 1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX
- Market open/closed detection (crypto trades 24/7)

</td>
<td width="50%" valign="top">

### Personal Layer
- Watchlist with inline sparklines (persisted)
- Portfolio with weighted-average cost basis
- Live P&L and percentage return
- Allocation doughnut chart
- Latest news headlines per ticker

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Interactions
- Keyboard-first: / search, left/right navigate, Esc close
- Shareable URLs: ?symbol=AAPL
- Toast notifications
- Skeleton loaders
- Reduced-motion support

</td>
<td width="50%" valign="top">

### Market Pulse
- Top Gainers
- Top Losers
- Most Active
- Auto-refresh every 30 seconds
- Click any mover to load instantly

</td>
</tr>
</table>

---

## Supported Markets

| Market | Suffix | Example |
|:---|:---:|:---|
| US Stocks | none | AAPL, TSLA, NVDA |
| NSE India | .NS | RELIANCE.NS, TCS.NS |
| BSE India | .BO | RELIANCE.BO |
| Crypto | -USD | BTC-USD, ETH-USD |
| ETFs | none | SPY, QQQ, VOO |
| Indices | ^ prefix | ^GSPC, ^NSEI |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| Markup | HTML5 |
| Styling | CSS3 - custom properties, glassmorphism, HUD accents |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | Chart.js 4 + chartjs-chart-financial + Luxon adapter |
| Data | Yahoo Finance (no key required) |
| Fonts | Inter, JetBrains Mono, Instrument Serif |
| Storage | localStorage |
| Deploy | Vercel (static) |

</div>

---

## Architecture
