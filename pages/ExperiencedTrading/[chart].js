import styles from '@/styles/chart.module.css'
// TradingViewWidget.jsx

import React, { useEffect, useRef, memo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter} from 'next/navigation';
function TradingViewWidget() {
  const container = useRef();
  const container2 = useRef();
  const container3 = useRef();
  const [watchListNum, setWatchList]= useState(0);
  const [watchList, setWatchListString]= useState("");
  const [favorites, setFavorites] = useState([]);
  const [coin, setCoin] = useState("");
  const [symbol, setSymbol] = useState("");
  const {data: session} = useSession();
  const router = useRouter();
  const [onLimit, setOnLimit]= useState(false);
  const [price, setPrice] = useState(0);
  const [priceString, setPriceString] = useState("USDT")
  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    const num = searchParams.get('number');
    setWatchList(num);
  }, [])

  useEffect(()=>{
      const searchParams = new URLSearchParams(window.location.search);
        const symbol =searchParams.get('coin');
        const coin = symbol.split(":")[1].replace("USDT", "");
        setCoin(coin);
        const watchlist = searchParams.get('watchlist');
        setWatchListString(watchlist);
        setSymbol(symbol);
  },[])

  useEffect(()=>{
    if(coin){
    fetchPrice();
    }
  }, [coin])


  async function fetchPrice(){
    try{
        
        const price = await fetch('../api/ExperiencedTrading/getCryptoPrice',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({coin})
        })

        const coin_price =(await price.json()).data;

        setPrice(coin_price[coin].quote.USD.price.toFixed(2));
        setPriceString(coin_price[coin].quote.USD.price.toFixed(2) + "USDT")
    }
    catch(error){
      console.error(error);
    }
  }
  async function fetchFavorites(){
    const username = session.user.email;
    try{
      const favorites = await fetch('../api/ExperiencedTrading/getFavorites',{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({username})
      })
      const response =await favorites.json();
      const res = response.sort((a, b)=>{
        if(a.coin>b.coin){
          return -1
        }
        else if(a.coin<b.coin){
          return 1;
        }
        else{
          return 0;
        }
      })
      setFavorites(res);
    }
    catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    if(session){
      fetchFavorites();
    }
  },[session])

  const Box = ({ top, onClick }) => {
    const boxStyle = {
      position: 'absolute',
      top: `${top}%`,
      backgroundColor:'transparent',
      left: '60%',
      width:'10vw',
      height:`${12/watchListNum}em`,
      zIndex:'9999',
      // Add other styles as needed
    };
  
    return <div style={boxStyle} onClick={onClick}></div>;
  };

  function handleWatchListClick(index){
    const coin_symbol= favorites[index].symbol;
    setCoin(coin_symbol);
    const coin_string ="BINANCE:" + coin_symbol.toUpperCase() + "USDT";
    const url = '/ExperiencedTrading/chart?coin=' + coin_string + '&&watchlist=' + watchList;
    router.replace(url)
    setSymbol(coin_string);
  }
  

  useEffect(()=>{
    handleLimitButton();
  }, [])
  useEffect(
    () => {

      if(symbol){
        if (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
        
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
              "calendar": false,
              "support_host": "https://www.tradingview.com"
            }`;
          container.current.appendChild(script);
    }
    },
    [symbol]
  );


  function handleFocus(index){
    const inputs = document.querySelectorAll("#inputs");
    for(let i=0; i<inputs.length; i++){
      if(i==index){
        inputs[i].style.border="1pt solid #449682";
      }
      else{
        inputs[i].style.border="1pt solid transparent";
      }
    }
    
  }
  useEffect(()=>{

    if(watchList){
  
      if (container2.current.firstChild) {
          container2.current.removeChild(container2.current.firstChild);
        }
    const script = document.createElement("script");
    script.src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    {     
          "height": "292",
          "symbolsGroups": [
            {
              "name": "Indices",
              "originalName": "Indices",
              "symbols": ${watchList}
            }
          ],
          "showSymbolLogo": true,
          "isTransparent": false,
          "colorTheme": "light",
          "locale": "en",
          "backgroundColor": "#ffffff"
        }`;
    container2.current.appendChild(script);
      }
  }, [watchList])


  useEffect(
    () => {

      if(symbol){
        if (container3.current.firstChild) {
          container3.current.removeChild(container3.current.firstChild);
        }
        
          const script = document.createElement("script");
          script.src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
          script.type = "text/javascript";
          script.async = true;
          script.innerHTML = `
            {
              "symbol": "${symbol}",
              "height": 200,
              "locale": "en",
              "colorTheme": "light",
              "isTransparent": false
            }`;
          container3.current.appendChild(script);
    }
    },
    [symbol]
  );


  function handleLimitButton(){
    if(onLimit){
      const limit = document.getElementById("limit");
      const spot = document.getElementById("spot");
      limit.style.backgroundColor="transparent"
      spot.style.backgroundColor="#F0F1F2"
      limit.style.color="#B7B7B7";
      spot.style.color="black"
    }

    else{
      const limit = document.getElementById("limit");
      const spot = document.getElementById("spot");
      spot.style.backgroundColor="transparent"
      limit.style.backgroundColor="#F0F1F2"
      spot.style.color="#B7B7B7";
      limit.style.color="black"
    }

    setOnLimit((onLimit)=>{
      return !onLimit
    })
  }
  return (
    <div className={styles.body}>

      <div className={styles.chartPage}>
        <div ref={container} className={styles.chart}> </div>
        <div className={styles.rightSide}>
            <div ref={container2} className={styles.watchList}> </div>
            <div ref={container3} className={styles.ticker}> </div>
            {Array.from({ length: watchListNum }).map((_, index) => (
            <Box key={index} top={9 + 6.3 * index} onClick={()=>{handleWatchListClick(index)}}/>
          ))}
        </div>
      </div>
      
      
      
      <div className={styles.buttons}>
          <button className={styles.button} onClick={()=>{handleLimitButton();}} id="limit">Limit</button>
          <button className={styles.button} onClick={()=>{handleLimitButton();}} id="spot">Spot</button>
      </div>
      <div className={styles.forms}>
              <form className={styles.form}>
                  <div className={styles.buy}>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(0)}}/>
                      <input type="text" value={priceString} className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Amount" className={styles.input} onFocus={()=>{handleFocus(1)}}/>
                      <input type="text" value="BTC" className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Total" className={styles.input} onFocus={()=>{handleFocus(2)}}/>
                      <input type="text" value="USDT" className={styles.input2} disabled/>
                    </div>
                    <section className={styles.text}>Max Buy</section>
                    <section className={styles.text}>Est. fee</section>
                    <button type="button" className={styles.buyButton}>Buy {symbol.split(":")[1]}</button>
                  </div>
                 
                  <div className={styles.limits}>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(3)}}/>
                      <input type="text" value="Stop Loss" className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(4)}}/>
                      <input type="text" value="Take Profit" className={styles.input2} disabled/>
                    </div>
                  </div>
              
              </form>

              <form className={styles.sellform}>
                  <div className={styles.sell}>
                  <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(5)}}/>
                      <input type="text" value={priceString} className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Amount" className={styles.input} onFocus={()=>{handleFocus(6)}}/>
                      <input type="text" value="BTC" className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Total" className={styles.input} onFocus={()=>{handleFocus(7)}}/>
                      <input type="text" value="USDT" className={styles.input2} disabled/>
                    </div>
                    <section className={styles.text}>Max Sell</section>
                    <section className={styles.text}>Est. fee</section>
                    <button type="button" className={styles.sellButton}>Sell {symbol.split(":")[1]}</button>
                  </div>
              </form>

      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
