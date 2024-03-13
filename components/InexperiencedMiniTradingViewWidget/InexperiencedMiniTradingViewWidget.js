import React, { useEffect } from 'react';

const InexperiencedMiniTradingViewWidget = ({ ticker }) => {
  useEffect(() => {
    const scriptId = `tv-widget-script-${ticker}`;
    const containerId = `tv-widget-container-${ticker}`;

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      // Remove existing script to avoid duplicates
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "KRAKEN:${ticker}GBP",
        "width": 200,
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

    const container = document.getElementById(containerId);
    container.appendChild(script);
  }, [crypto]);

  const containerId = `tv-widget-container-${ticker}`;

  return (
    <div id={containerId} className='tradingview-widget-container'>
      <div className='tradingview-widget-container__widget'></div>
    </div>
  );
};

export default InexperiencedMiniTradingViewWidget;
