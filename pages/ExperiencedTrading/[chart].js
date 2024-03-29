import styles from '@/styles/chart.module.css'
// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef();

  useEffect(
    () => {
      const searchParams = new URLSearchParams(window.location.search);
      const symbol =searchParams.get('coin');
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_top_toolbar": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "watchlist": [
            "BINANCE:BTCUSDT"
          ],
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
      
    },
    []
  );

  return (
    <div ref={container} className={styles.chart}>
    </div>
  );
}

export default memo(TradingViewWidget);
