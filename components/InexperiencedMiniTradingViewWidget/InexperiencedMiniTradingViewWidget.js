import React, { useEffect } from 'react';

const InexperiencedMiniTradingViewWidget = ({ symbol }) => {
  useEffect(() => {
    const scriptId = `tv-widget-script-${symbol}`;
    const containerId = `tv-widget-container-${symbol}`;

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      // Remove existing script to avoid duplicates
      existingScript.remove();
    }

    //TODO: not every coin is on kraken. make it so that if its not on kraken, use a different exchange

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "KRAKEN:${symbol.toUpperCase()}GBP",
        "width": 180,
        "height": 70,
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": "light",
        "isTransparent": false,
        "autosize": false,
        "largeChartUrl": "",
        "chartOnly": true,
        "noTimeScale": true
      }
    `;

    script.onerror = (error) => {
      console.error('Error loading TradingView widget script:', error);
    };

    const container = document.getElementById(containerId);
    container.appendChild(script);
  }, [crypto]);

  const containerId = `tv-widget-container-${symbol}`;

  return (
    <div id={containerId} className='tradingview-widget-container'>
      <div className='tradingview-widget-container__widget'></div>
    </div>
  );
};

export default InexperiencedMiniTradingViewWidget;
