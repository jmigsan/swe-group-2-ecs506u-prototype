"use client"
import styles from '@/styles/chart.module.css'
// TradingViewWidget.jsx
import DropDown from './CryptoDropDown';
import React, { useEffect, useRef, memo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter} from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

import io from 'socket.io-client';
let socket;

function TradingViewWidget() {
  const container = useRef();
  const container2 = useRef();
  const container3 = useRef();
  const [watchListNum, setWatchList]= useState(0);
  const [watchList, setWatchListString]= useState("");
  const [favorites, setFavorites] = useState([]);
  const [coin, setCoin] = useState(null);
  const [amount, setAmountCoin]= useState(null);
  const [Currency, setCurrency] = useState({curren: "GBP"});
  const [symbol, setSymbol] = useState("");
  const {data: session} = useSession();
  const router = useRouter();
  const [onLimit, setOnLimit]= useState(false);
  const [price, setPrice] = useState(0);
  const [priceString, setPriceString] = useState("");
  const [drop, setDrop] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [balance, setBalance] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalSell, setTotalSell] = useState(0);
  const [stop, setStop] = useState(0);
  const [tp, setTp] = useState(0);
  const [stop2, setStop2] = useState(0);
  const [tp2, setTp2] = useState(0);
  const [Amount, setAmount] = useState(0);
  const [AmountSell, setAmountSell] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [Trade, setTrade] = useState("");
  const [allowedCoins, setAllowedCoins] = useState([]);
  const [duration, setDuration]= useState(15);
  const confirmRef = useRef(confirmed);
  const [done, setDone] = useState(false);
  const [tradeType, setTradeType] = useState("limit");
  const [incorrectStop, setIncorrectStop] =useState(false);
  const [incorrectTp, setIncorrectTp] = useState(false);
  const [incorrectStop2, setIncorrectStop2] =useState(false);
  const [incorrectTp2, setIncorrectTp2] = useState(false);
  const [limitExecuted, setLimitExecuted] = useState("");
  // useEffect(() => {
  //   if(session){
  //     socketInitializer()
  //   }}, [session])

  // async function socketInitializer(){
  //   await fetch('../api/ExperiencedTrading/limitSocket')
  //   socket = io()

  //   socket.on('connect', () => {
  //     socket.emit('message', session.user.email)
  //   })

  //   socket.on('limitExecuted', (message)=>{
  //     setLimitExecuted(message);
  //     setTimeout(()=>{
  //       setLimitExecuted("");
  //     }, [2000])
  //   })
  // }

  // ...rest of your component

  useEffect(() => {
    confirmRef.current = confirmed;
}, [confirmed]);


function handleDone(){
  setTimeout(()=>{
    setDone(false);
  }, [2500])
}
  async function handleCountdown(){
    let time=15;
  
    if(confirmed){
        const interval = setInterval(async() => {
            if (time <= 0) {
                await fetchPrice();
                setDuration(15);
                time=15;
                if(!confirmRef.current){
                    clearInterval(interval);
                }
            } else {
                if(!confirmRef.current){
                    setDuration(15);
                    time=15;
                    clearInterval(interval);
                }
                setDuration((duration)=>{
                    return duration-1;
                });
                time--;
            }
        }, 1000); 

    }
}
      useEffect(()=>{
            
        if(session){
          fetchBalance();
          
        }
    },[session, Currency.curren, coin]);


    useEffect(()=>{
      fetchAllowed();
    },[])
    async function fetchAllowed(){
      try{
          const coins= await fetch('../api/ExperiencedTrading/allowedCryptos', {
              method: 'GET',
          })
          const res = await coins.json();
      
          setAllowedCoins(res);

      }
      catch(error){
          console.error(error);
      }


  }
    const animations={
      initial:{
        opacity:0,
      }
      ,
      animate:{
        opacity:1,
      }
    }

    function getId(symbol){
      for(let i=0; i<allowedCoins.length; i++){
        if(allowedCoins[i].symbol==symbol){
          return allowedCoins[i].id
        }
      }
    }

    async function fetchBalance(){

        try{
        const username= session.user.email;
        const res = await fetch('../api/Deposit/getBalance', {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username})
        })

        const b = await res.json();
     
 
        let found1=false;
        let found2=false;
        for(let i=0; i<b.length; i++){
          if(b[i].currency==Currency.curren){
            setBalance(b[i]);
            found1=true;
          }
          else if(b[i].currency==coin){
            setAmountCoin(b[i]);
            found2=true;
          }
        }
        
        if(!found1){setBalance({amount: 0.00})}
        if(!found2){setAmountCoin({amount: 0.00})}
        }
        catch(error){
            console.error(error);
        }
      
    }

    async function checkLimits(username, sold, bought, amountBought, amountSold, type){
      if(type=="Buy"){
              type="Sell"
              const temp = sold;
              sold=bought;
              bought=temp;
              const temp2 = amountSold;
              amountSold=amountBought;
              amountBought=temp2;
            if(tp!=0){
              let price=tp;
              try{
                await fetch('../api/ExperiencedTrading/LimitOrder',{
                    method: 'POST',
                    headers:{'Content-Type': 'application/json'},
                    body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
                })

            }
            catch(error){
                console.log(error);
                return
            }
          }
          
          if(stop!=0){
            let price=stop;
            try{
              await fetch('../api/ExperiencedTrading/LimitOrder',{
                  method: 'POST',
                  headers:{'Content-Type': 'application/json'},
                  body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
              })

          }
          catch(error){
              console.log(error);
              return
          }
          }
      }

      else{
              type="Buy"
              const temp = sold;
              sold=bought;
              bought=temp;
              const temp2 = amountSold;
              amountSold=amountBought;
              amountBought=temp2;
            if(tp2!=0){
              let price=tp2;
              try{
                await fetch('../api/ExperiencedTrading/LimitOrder',{
                    method: 'POST',
                    headers:{'Content-Type': 'application/json'},
                    body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
                })

            }
            catch(error){
                console.log(error);
                return
            }
          }
          
          if(stop2!=0){
            let price=stop2;
            try{
              await fetch('../api/ExperiencedTrading/LimitOrder',{
                  method: 'POST',
                  headers:{'Content-Type': 'application/json'},
                  body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
              })

          }
          catch(error){
              console.log(error);
              return
          }
          }
      }
    }
    async function handleConfirmClick(){


      const username=session.user.email;
      let sold;
      let bought; 
      let type;
      let amountBought;
      let amountSold;
      if(Trade=="buy"){
       sold=Currency.curren;
       bought=coin;
       amountBought=Amount;
       amountSold=total
       type="Buy";
       setAmount(0);
       setTotal(0);
        checkLimits(username, sold, bought, amountBought, amountSold, type);
      }
      else{
          sold=coin;
          bought=Currency.curren;
          amountBought=totalSell;
          amountSold=AmountSell;
          type="Sell";
          setAmountSell(0);
          setTotalSell(0);
          checkLimits(username, sold, bought, amountBought, amountSold, type);
      }
      
      
    
      if(tradeType=="spot"){
      try{
          await fetch('../api/Trade/trade',{
              method: 'POST',
              headers:{'Content-Type': 'application/json'},
              body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
          })

      }
      catch(error){
          console.log(error);
          return
      }
    }

    else{
          try{
            await fetch('../api/ExperiencedTrading/LimitOrder',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
            })

        }
        catch(error){
            console.log(error);
            return
    }
    }
      setDone(true);
     
      fetchBalance();
      handleDone();

}
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Hide the dropdown if a click outside is detected
        setDrop(false)
      }
    };
  
    // Add when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    
    // Return a function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        // Hide the dropdown if a click outside is detected
        setDrop2(false)
      }
    };
  
    // Add when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    
    // Return a function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 
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
  }, [coin, Currency])

  useEffect(()=>{
    if(price){
      setPriceString(price.toFixed(2) + Currency.curren)
    }
  }, [price])
  async function fetchPrice(){
    const currency = Currency.curren;
    try{
        
        const price = await fetch('../api/ExperiencedTrading/getCryptoPrice',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({coin, currency})
        })

        const coin_price =(await price.json()).data;

        setPrice(coin_price[coin].quote[Currency.curren].price);
        setPriceString(coin_price[coin].quote[Currency.curren].price.toFixed(2) + Currency.curren)
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

  function handleFocusError(index){
    const inputs = document.querySelectorAll("#inputs");
    for(let i=0; i<inputs.length; i++){
      if(i==index){
        inputs[i].style.border="1pt solid red";
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

  function checkInputs(trade){
    
    if(trade=="buy"){
   
      if(Amount<=0){
        handleFocusError(1)
        return false;
      }


      if(total>balance.amount){
        handleFocusError(2)
        return false;
      }

      if(tp!=0){
        if(tp<=price){
          setIncorrectTp(true);
          
          setTimeout(()=>{
            setIncorrectTp(false);
        }, [2000])
        return false;
      }
    }

      if(stop!=0){
        if(stop>=price){
          setIncorrectStop(true);
          setTimeout(()=>{
            setIncorrectStop(false);
        }, [2000])
          return false;
        }
      
      }
    
    }

    else{
      if(AmountSell<=0){
       handleFocusError(6);
        return false;
      }
 
      if(AmountSell>amount.amount){

        handleFocusError(6);
        return false;
      }

      if(tp2!=0){
        if(tp>=price){
          setIncorrectTp2(true);
          
          setTimeout(()=>{
            setIncorrectTp2(false);
        }, [2000])
        return false;
      }
    }

      if(stop2!=0){
        if(stop2<=price){
          setIncorrectStop2(true);
          setTimeout(()=>{
            setIncorrectStop2(false);
        }, [2000])
          return false;
        }
      
      }
  
    }

    return true;
  }

  useEffect(()=>{
    if(confirmed){
      handleCountdown();
    }
  },[confirmed])

  function setMaxBuy(){
    const max = (balance.amount/price).toFixed(4);
    setAmount(max);
  }
  function setMaxSell(){
    setAmountSell(amount.amount);
  }
  function getTotal(){
    setTotal((price * Number(Amount)).toFixed(4));
  }

  function getTotalSell(){
    setTotalSell((price * Number(AmountSell)).toFixed(4));
  }
  useEffect(()=>{
    if(price){
      getTotal();
      getTotalSell();
    }
  }, [price,Amount, AmountSell])

  useEffect(()=>{
    fetchPrice();
  }, [tradeType])
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
  const animations3={
    initial:{
        opacity:0,
        y:-100,
    },
    animate:{
        opacity:1,
        y:0,
    },

    exit:{
        opacity:0,
        y:-100,
    }
}
  return (
    <div className={styles.body}>
        {done && (
          <motion.div  variants={animations3} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}} className={styles.successfulMessage}>
            <Image 
                src={`/images/checkmark.png`}
                alt="tick"
                width={30}
                height={30}
              />
              {tradeType=="limit" ?(
                  <section>Limit order opened</section>
              ):(
                <section>Trade Executed</section>
              )}
              
          </motion.div>
        )}
         {limitExecuted!="" && (
          <motion.div  variants={animations3} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}} className={styles.successfulMessage}>
            <Image 
                src={`/images/checkmark.png`}
                alt="tick"
                width={30}
                height={30}
              />
  
              <section>Limit{limitExecuted} order executed</section>
              
              
          </motion.div>
        )}
      {confirmed && (
        <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.confirmWrapper}>
            <form onSubmit={(e)=>{e.preventDefault()}} className={styles.confirmForm}>
                <section className={styles.confirmHeader}>
                  <section className={styles.confirmTitle}>Confirm Order</section>
                  <Image
                      src={`/images/cancel.png`}
                      alt="cancel"
                      width={24}
                      height={24}
                      onClick={()=>{setConfirmed(false)}}
                      className={styles.cancel}
                    />
                </section>

                <section className={styles.flexBottom}>
                  {Trade=="buy" ? (
                    <section className={styles.confirmTicker}>
                      <div className={styles.confirmTickerLeft}>
                        <Image
                          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${getId(coin)}.png`}
                          alt="currency"
                          width={30}
                          height={30}
                        />
                        <section className={styles.symbol}>{coin}</section>
                      </div>
                      <section className={styles.plus}>+{Amount}</section>
                    </section>
                  ):(
                    <section className={styles.confirmTicker}>
                    <div className={styles.confirmTickerLeft}>
                    <Image
                        src={`/images/currencies/${Currency.curren}.png`}
                        alt="currency"
                        width={30}
                        height={30}
                      />
                      <section className={styles.symbol}>{Currency.curren}</section>
                    </div>
                    <section className={styles.plus}>+{totalSell}</section>
                  </section>
                  )}
                 {Trade=="buy" ? (
                     <section className={styles.confirmTicker}>
                      <div className={styles.confirmTickerLeft}>
                      <Image
                          src={`/images/currencies/${Currency.curren}.png`}
                          alt="currency"
                          width={30}
                          height={30}
                        />
                        <section className={styles.symbol}>{Currency.curren}</section>
                      </div>
                      <section className={styles.minus}>-{total}</section>
                   </section>
                  ):(
                    <section className={styles.confirmTicker}>
                      <div className={styles.confirmTickerLeft}>
                        <Image
                          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${getId(coin)}.png`}
                          alt="currency"
                          width={30}
                          height={30}
                        />
                        <section className={styles.symbol}>{coin}</section>
                      </div>
                      <section className={styles.minus}>-{AmountSell}</section>
                    </section>
                  )}
                </section>

                <button className={styles.confirmButton} onClick={()=>{handleConfirmClick(); setConfirmed(false)}}>Confirm {duration}</button>
            </form>
        </motion.div>
      )}
      <div className={styles.chartPage}>
        <div ref={container} className={styles.chart}> </div>
        <div className={styles.rightSide}>
            <div ref={container2} className={styles.watchList}> </div>
            <div ref={container3} className={styles.ticker}> </div>
            {Array.from({ length: watchListNum }).map((_, index) => (
            <Box key={index} top={9 + 8.5 * index} onClick={()=>{handleWatchListClick(index)}}/>
          ))}
        </div>
      </div>
      
      
      
      <div className={styles.buttons}>
          <button className={styles.button} onClick={()=>{handleLimitButton(); setTradeType("limit")}} id="limit">Limit</button>
          <button className={styles.button} onClick={()=>{handleLimitButton(); setTradeType("spot")}} id="spot">Spot</button>
      </div>
      <div className={styles.forms}>
              <form className={styles.form}>
                  <div className={styles.buy}>
                    <div className={styles.inputs} id="inputs" >
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(0)}} disabled/>
                      {tradeType=="spot" ?(
                         <input type="text" value={priceString} className={styles.input2} onClick={()=>{setDrop(true)}} readOnly/>
                      ):(
                        <>
                        <input type="text" className={styles.input4} onChange={(e) =>{setPrice(Number(e.target.value))}}/>
                        <input type="text" className={styles.input3} value={Currency.curren} onClick={()=>{setDrop(true)}} readOnly/>
                        </>
                      )}
                     
                    </div>
                    {drop && (
                      <div ref={dropdownRef} className={styles.drop}>
                           <DropDown setCurrency={setCurrency} type={"fiat"} position={"absolute"}/>
                      </div>
                     
                      )}
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Amount" id="AmountBuy" value={Amount} className={styles.input} onChange={(e)=>{setAmount(Number(e.target.value))}} onFocus={()=>{handleFocus(1)}}/>
                      <input type="text" value={coin} className={styles.input2} disabled/>
                    </div>
           
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Total"  id="totalBuy" value={total} className={styles.input} onFocus={()=>{handleFocus(2)}} readOnly/>
                      <input type="text" value={Currency.curren} className={styles.input2} disabled/>
                    </div>
                    {balance && (
                      <section className={styles.text}>Max Buy: <section className={styles.maxBuy} onClick={()=>{setMaxBuy(); getTotal();}}>{balance.amount}</section></section>
                    )} 
                    <section className={styles.text}>Est. fee: <section className={styles.maxBuy}>{10 * Amount}{Currency.curren}</section></section>
                    <button type="button" className={styles.buyButton} onClick={()=>{setTrade("buy"); if(checkInputs("buy")){setConfirmed(true);} }}>Buy {symbol.split(":")[1]}</button>
                  </div>
                 
                  <div className={styles.limits}>
                     <div className={styles.errorMessage}>
                      {incorrectStop && (
                      <motion.div className={styles.message} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                Stop Loss must be below current Price
                          </motion.div>
                      )}
                        <div className={styles.inputsSpecial} id="inputs">
                          <input type="text" placeholder="Price" className={styles.input} onChange={(e)=>{setStop(Number(e.target.value));}} onFocus={()=>{handleFocus(3)}}/>   
                          <input type="text" value="Stop Loss" className={styles.input2} disabled/>
                      </div>
  
                    </div>
                    <div className={styles.errorMessage}>
                      {incorrectTp && (
                        <motion.div className={styles.message} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                  Take profit must be above current price
                            </motion.div>
                        )}
                        <div className={styles.inputsSpecial} id="inputs">
                        <input type="text" placeholder="Price" className={styles.input} onChange={(e)=>{setTp(Number(e.target.value));}} onFocus={()=>{handleFocus(4)}}/>
                        <input type="text" value="Take Profit" className={styles.input2} disabled/>
                      </div>
                    </div>
                 
                  </div>
              
              </form>

              <form className={styles.form}>
                  <div className={styles.buy}>
                  <div className={styles.inputs} id="inputs" >
                      <input type="text" placeholder="Price" className={styles.input} onFocus={()=>{handleFocus(0)}} disabled/>
                      {tradeType=="spot" ?(
                         <input type="text" value={priceString} className={styles.input2} onClick={()=>{setDrop2(true)}} readOnly/>
                      ):(
                        <>
                        <input type="text" className={styles.input4} onChange={(e) =>{setPrice(Number(e.target.value))}}/>
                        <input type="text" className={styles.input3} value={Currency.curren} onClick={()=>{setDrop2(true)}} readOnly/>
                        </>
                      )}
                     
                    </div>
                    {drop2 && (
                      <div ref={dropdownRef2} className={styles.drop}>
                           <DropDown setCurrency={setCurrency} type={"fiat"} position={"absolute"}/>
                      </div>
                     
                      )}
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Amount" id="AmountSell" className={styles.input} value={AmountSell} onChange={(e)=>{setAmountSell(Number(e.target.value))}} onFocus={()=>{handleFocus(6)}}/>
                      <input type="text" value={coin} className={styles.input2} disabled/>
                    </div>
                    <div className={styles.inputs} id="inputs">
                      <input type="text" placeholder="Total" value={totalSell} className={styles.input} onFocus={()=>{handleFocus(7)}} readOnly/>
                      <input type="text" value={Currency.curren} className={styles.input2} disabled/>
                    </div>
                    {amount && (
                    <section className={styles.text}>Max Sell: <section className={styles.maxBuy} onClick={()=>{setMaxSell(); getTotalSell();}}>{amount.amount.toFixed(4)}</section></section>
                      )}
                    <section className={styles.text}>Est. fee: <section className={styles.maxBuy}>{10 * AmountSell}{Currency.curren}</section></section>
                    <button type="button" className={styles.sellButton} onClick={()=>{setTrade("sell"); if(checkInputs("sell")){setConfirmed(true);}}}>Sell {symbol.split(":")[1]}</button>
                  </div>

                  <div className={styles.limits}>
                     <div className={styles.errorMessage}>
                      {incorrectStop2 && (
                      <motion.div className={styles.message} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                Stop Loss must be above current Price
                          </motion.div>
                      )}
                        <div className={styles.inputsSpecial} id="inputs">
                          <input type="text" placeholder="Price" className={styles.input} onChange={(e)=>{setStop2(Number(e.target.value));}} onFocus={()=>{handleFocus(8)}}/>   
                          <input type="text" value="Stop Loss" className={styles.input2} disabled/>
                      </div>
  
                    </div>
                    <div className={styles.errorMessage}>
                      {incorrectTp2 && (
                        <motion.div className={styles.message} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                  Take profit must be below current price
                            </motion.div>
                        )}
                        <div className={styles.inputsSpecial} id="inputs">
                        <input type="text" placeholder="Price" className={styles.input} onChange={(e)=>{setTp2(Number(e.target.value));}} onFocus={()=>{handleFocus(9)}}/>
                        <input type="text" value="Take Profit" className={styles.input2} disabled/>
                      </div>
                    </div>
                 
                  </div>
              </form>

      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
