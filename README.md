<div align="center">

<img src="https://img.shields.io/badge/%E2%96%B2-TICKER-00d97e?style=for-the-badge&labelColor=0a0e14" alt="TICKER" height="42">

# T I C K E R

*Markets, live. In your browser.*

A premium live stock & crypto tracker with a watchlist, portfolio P&L and candlestick charts, styled like a trading terminal.

<br>

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-ticker--jet.vercel.app-00d4ff?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0a0e14)](https://ticker-jet.vercel.app/)

![HTML5](https://img.shields.io/badge/HTML5-0a0e14?style=flat-square&logo=html5&logoColor=e34f26)
![CSS3](https://img.shields.io/badge/CSS3-0a0e14?style=flat-square&logo=css3&logoColor=1572b6)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-0a0e14?style=flat-square&logo=javascript&logoColor=f7df1e)
![Chart.js](https://img.shields.io/badge/Chart.js-0a0e14?style=flat-square&logo=chartdotjs&logoColor=ff6384)
![Vercel](https://img.shields.io/badge/Vercel-0a0e14?style=flat-square&logo=vercel&logoColor=white)
![No API key](https://img.shields.io/badge/API%20key-none-00d97e?style=flat-square&labelColor=0a0e14)

<br>

<a href="https://ticker-jet.vercel.app/">
  <img src="demo.png" alt="TICKER dashboard: watchlist with sparklines, portfolio panel and market movers" width="100%">
</a>

</div>

<br>

## Overview

TICKER pulls live quotes from Yahoo Finance and shows them in a dark, glassmorphic dashboard. Search any symbol worldwide, chart it across eight timeframes, track a watchlist, and see your portfolio's profit and loss at a glance. Green and red mean direction only; cyan marks what you can click.

**Try it now: [ticker-jet.vercel.app](https://ticker-jet.vercel.app/)**

## Features

| | |
|---|---|
| **Universal search** | Stocks, crypto, ETFs and indices. Press `/` to focus, arrows to navigate, `Enter` to load. |
| **Live quotes** | Price, day change, high/low, 52-week range and volume. Refreshes every 15s while the market is open. |
| **Three chart types** | Line, candlestick and area, across 1D · 5D · 1M · 6M · YTD · 1Y · 5Y · MAX. |
| **Watchlist** | Sparklines, one-click loading, saved in your browser. |
| **Portfolio** | Weighted-average cost, P&L in money and percent, allocation doughnut. |
| **News** | Top headlines for the selected ticker. |
| **Market movers** | Top gainers, losers and most active, refreshed every 30s. |
| **Shareable links** | `?symbol=AAPL` opens straight to a ticker. `←` `→` cycles your watchlist. |

## Supported markets

| Market | Format | Example |
|---|---|---|
| US stocks and ETFs | plain symbol | `AAPL`, `SPY` |
| Indian stocks | `.NS` suffix | `RELIANCE.NS` |
| Crypto | `-USD` suffix | `BTC-USD` |
| Indices | `^` prefix | `^GSPC` |

## Tech stack

- **Frontend:** HTML5, CSS3 (custom properties, glassmorphism), vanilla ES6+ JavaScript
- **Charts:** Chart.js 4, chartjs-chart-financial, Luxon
- **Data:** Yahoo Finance (free, no key) via CORS proxies
- **Type:** Inter for UI, JetBrains Mono for numbers, Instrument Serif for the tagline
- **Hosting:** Vercel (static)

## Project structure

```
ticker/
├── index.html      layout and markup
├── style.css       terminal theme
├── script.js       UI, charts, search, watchlist
├── api.js          Yahoo fetching, proxy fallback, caching
├── portfolio.js    holdings math and persistence
└── demo.png        screenshot
```

## Run locally

```bash
git clone <your-repo-url>
cd ticker
python3 -m http.server 8000
```

Open <http://localhost:8000>. To deploy, import the folder into Vercel as a static site.

## API notes

- Yahoo blocks direct browser requests, so calls race `corsproxy.io` and `allorigins.win`, and the first good response wins.
- Quotes are cached for 30s, search and news for 5 minutes.
- Yahoo's free chart endpoint has no market cap, P/E, beta or dividend yield, so those show "—".
- Public proxies can rate-limit. For heavy use, run your own proxy as a Vercel serverless function.
- Data is delayed up to 15 minutes. This is not financial advice.

## Roadmap

- [ ] Volume bars under the chart
- [ ] Price alerts
- [ ] Compare-with overlay
- [ ] Light theme
- [ ] Tabbed panels on mobile

## Credits

Data from [Yahoo Finance](https://finance.yahoo.com). Charts by [Chart.js](https://www.chartjs.org). 

<div align="center">

<sub>TICKER v1.0 · Markets, live.</sub>

</div>
