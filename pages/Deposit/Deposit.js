"use client";
import styles from '@/styles/deposit.module.css'
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRef } from 'react';
import { motion } from 'framer-motion'; 
import { useSession } from 'next-auth/react';
export default function Deposit(){
    const [currency, setCurrency]= useState("GBP");
    const [availableCurrency, setAvailableCurrency]= useState(["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "SAR"]);
    const [shownCurrencies, setShowCurrencies]= useState(["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "SAR"]);
    const [allowedCoins, setAllowedCoins]= useState(null);
    const [shownCoins, setCoins]=useState(null);
    const [onCool, setOnCool]= useState(false);
    const [Coin, setCoin] = useState(null);
    const [price, setPrice]= useState(0);
    const [option, setOption]= useState("buy");
    const [balance, setBalance]= useState(null);
    const [onConfirm, setOnConfirm]= useState(false);
    const [step, setStep]=useState(1);
    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);
    const [onCurrencyForm, setOnCurrencyForm]= useState(false);
    const [amount, setAmount]= useState(0);
    const [amountCoin, setAmountCoin]= useState(0.050234);
    const [duration, setDuration]= useState(15);
    const {data: session} = useSession();
    const priceRef = useRef(price);
    const confirmRef = useRef(onConfirm);
// Update the ref whenever the price state changes
    useEffect(() => {
        priceRef.current = price;
    }, [price]);
    
    useEffect(() => {
        confirmRef.current = onConfirm;
    }, [onConfirm]);
    const animations={
        initial:{
            opacity:0,
        },
        animate:{
            opacity:1,
        }
    }

    const animations2={
        initial:{
            x:50,
        },
        animate:{
            x:0
        }
    }
    useEffect(()=>{
       fetchAllowed();
        
    }, [])


    async function handlePayment(){
        const username= session.user.email;
        try{
            await fetch('../api/Deposit/deposit', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({username, currency, amount})
            });

            setOption("buy");
            setOnCurrencyForm(false);

        }

        catch(error){
            console.error(error);
        }

    }

    async function fetchPrice(){
        try{
           
            const coin = Coin.symbol;
            const res = await fetch('../api/ExperiencedTrading/getCryptoPrice', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({coin, currency})
            });

            const price =await res.json();
            setPrice(price.data[Coin.symbol].quote[currency].price);
        }

        catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{
        if(Coin && currency){
            fetchPrice();
        }
    }, [Coin, currency]);

    useEffect(()=>{
        
        if(session){
           fetchBalance();
        }
    },[session]);

     async function fetchBalance(){

        try{
        const username= session.user.email;
        const res = await fetch('../api/Deposit/getBalance', {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username})
        })


        setBalance(await res.json());
        }
        catch(error){
            console.error(error);
        }
     }
    const handleCurrencyChange =(e)=>{
        const str = e.target.value;
        const new_arr=[];
        for(let i=0; i<availableCurrency.length; i++) {
            if(availableCurrency[i].includes(str)) {
                new_arr.push(availableCurrency[i]);
            }
        }

        setShowCurrencies(new_arr);
    }

    const handleCoinChange =(e)=>{
        const str = e.target.value;
        const new_arr=[];
        for(let i=0; i<allowedCoins.length; i++) {
            if(allowedCoins[i].coin.includes(str)) {
                new_arr.push(allowedCoins[i]);
            }
        }
    
        setCoins(new_arr);
    }
    async function fetchAllowed(){
        try{
            const coins= await fetch('../api/ExperiencedTrading/allowedCryptos', {
                method: 'GET',
            })
            const res = await coins.json();
            setAllowedCoins(res);
            setCoin(res[0]);
            setCoins(res);
        }
        catch(error){
            console.error(error);
        }


    }

    const toggleDropdown = () => {
        const dropdown = document.getElementById("dropdown");
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
          dropdown.style.display = "flex";
        } else {
          dropdown.style.display = "none";
        }
      };

      const toggleDropdown2 = () => {
        const dropdown = document.getElementById("dropdown2");
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
          dropdown.style.display = "flex";
        } else {
          dropdown.style.display = "none";
        }
      };


      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // Hide the dropdown if a click outside is detected
            document.getElementById("dropdown").style.display = "none";
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
            document.getElementById("dropdown2").style.display = "none";
            
          }
        };
      
        // Add when the component mounts
        document.addEventListener("mousedown", handleClickOutside);
        
        // Return a function to remove the event listener when the component unmounts
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []); 

    function handleOptionClick(index){
        const options = document.querySelectorAll("#option");

        for(let i=0; i<options.length; i++){
            if(i==index){
                options[i].style.color="#21262F";
            }

            else{
                options[i].style.color="lightgray";
            }
        }
    }

    useEffect(()=>{
        handleOptionClick(0);
    },[]);

    function handleSpendChange(){
        const amount = Number(document.getElementById("amountSpend").value);
        setAmount(amount);
        if(amount>getAmount(currency)){
            document.getElementById("payCurrency").style.backgroundColor="lightgray";
        }
        else{
            document.getElementById("payCurrency").style.backgroundColor="transparent";
        }
        if(amount==0){
            document.getElementById("amountRecieved").value = 0;
            setAmountCoin(0);
        }
        else{
        const amountCoin = (amount/price).toFixed(8);
        document.getElementById("amountRecieved").value = amountCoin;
        setAmountCoin(amountCoin);
        }
    }


    useEffect(()=>{
        if(onConfirm){
            handleCountdown();
        }
    }, [onConfirm])

    async function handleConfirmClick(){
        const username=session.user.email;
        const sold=currency;
        const bought=Coin.symbol;
        const amountBought=amountCoin;
        const amountSold= amount;
        const type="Buy";

        try{
            await fetch('../api/Trade/trade',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({username, price, sold, bought, amountBought, amountSold, type})
            })

        }

        catch(error){
            console.log(error);
        }
        setOnConfirm(false);
        setOption("buy");
        handleOptionClick(0);
        document.getElementById("amountSpend").value ="";
        document.getElementById("amountRecieved").value ="";
    }

    async function handleCountdown(){
        let time=15;
        if(onConfirm){
            const interval = setInterval(async() => {
    
                if (time <= 0) {
                    await fetchPrice();
                    setDuration(15);
                    time=15;
                    if(!confirmRef.current){
                        clearInterval(interval);
                    }
                    else{
                    setAmountCoin((amount/priceRef.current).toFixed(8))
                    
                    }
                } else {
                    setDuration((duration)=>{
                        return duration-1;
                    });
                    time--;
                }
            }, 1000); 

        }
    }
    function getAmount(curr){

        for(let i=0; i<balance.length; i++){
            if(balance[i].currency==curr){
                return balance[i].amount;
            }
        }

        return 0.00
    }
    return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <section className={styles.option} onClick={()=>{handleOptionClick(0); setOption("buy")}} id="option">Buy Crypto</section>
                    <section className={styles.option} onClick={()=>{handleOptionClick(1);  setOption("deposit"); setStep(1)}} id="option">Deposit</section>
                    <section className={styles.option} onClick={()=>{handleOptionClick(2); setOption("history")}} id="option">Transaction History</section>
                </div>
                {option=="buy" && (
                    <>
                <div className={styles.body}>
                    
                    <div className={styles.rightSide}>
                        
                            <section className={styles.title}>Buy Crypto</section>
                            <div className={styles.step}>
                                <div className={styles.stepText}>
                                    <section className={styles.stepHeader}>1.Enter Amount and Select Payment</section>
                                    <section>Enter the amount, the currency you wish to buy in, and the payment method</section>
                                </div>
                                <Image 
                                    src={`/images/Step1.png`}
                                    alt="step1"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepText}>
                                    <section className={styles.stepHeader}>2.Confirm Order</section>
                                    <section>Confirmation of transaction detail information, including trading pair quotes, fees, and other explanatory tips.</section>
                                </div>
                                <Image 
                                    src={`/images/Step2.png`}
                                    alt="step1"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepText}>
                                    <section className={styles.stepHeader}>3.Recieve Crypto</section>
                                    <section>After successful payment, the purchased crypto to will reach Spot Wallet.</section>
                                </div>
                                <Image 
                                    src={`/images/Step3.png`}
                                    alt="step1"
                                    width={100}
                                    height={100}
                                />
                            </div>
                    </div>
                    <div className={styles.form}>
                        <form className={styles.buySellForm}>
                            <div className={styles.buttons}>
                                <button className={styles.button} type="button" onClick={(e)=>{setOnCool(false); e.target.style.backgroundColor="white"; document.getElementById("sell").style.backgroundColor="#F5F5F5"; document.getElementById("sell").style.color="#B8BDC5";e.target.style.color="#21262F"}} id="buy">Buy</button>
                                {onCool ?(
                                    <Image 
                                        src={`/images/coolButton2.png`}
                                        width={50}
                                        height={55}
                                        alt="cool"
                                        className={styles.cool}
                                    />
                                ):(
                                    <Image 
                                    src={`/images/coolButton.png`}
                                    width={50}
                                    height={75}
                                    alt="cool"
                                    className={styles.cool}
                                />
                                )}
                                <button className={styles.button2} type="button" id="sell" onClick={(e)=>{setOnCool(true); e.target.style.backgroundColor="white"; document.getElementById("buy").style.backgroundColor="#F5F5F5";document.getElementById("buy").style.color="#B8BDC5"; e.target.style.color="#21262F"}}>Sell</button>
                            </div>
                    
                            <div className={styles.spend} id="spend">
                                <section className={styles.spendHeader}>Spend</section>
                                <div className={styles.inputs}>
                                    <input type="text" placeholder="5-5000" id="amountSpend"className={styles.input} onChange={()=>{handleSpendChange();}}/>
                                    <div className={styles.currencyButton} onClick={()=>{toggleDropdown();}}>
                                                        <Image
                                                            src={`/images/currencies/${currency}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        />
                                                    <section className={styles.text}>{currency}</section>
                                                        <Image
                                                            src={`/images/currencies/downArrow.png`}
                                                            alt="currency"
                                                            width={14}
                                                            height={14}
                                                        />
                                    </div>
                            </div>

                            <div className={styles.test2} ref={dropdownRef}>
                                    <div className={styles.test} id="dropdown">
                                        <form className={styles.currencyForm}>
                                            <input type="text" placeholder="Search" className={styles.search} onChange={handleCurrencyChange}/>
                                            {shownCurrencies.map((currency, index) =>{
                                                return(
                                                    <div key={index} className={styles.currencyTicker} onClick={()=>{setCurrency(currency)}}>
                                                        <Image
                                                            src={`/images/currencies/${currency}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        /> 
                                                        <section className={styles.payCurrencyText}>{currency}</section>
                                                    </div>
                                                )
                                            })

                                            }
                                        </form>
                                    </div>
                            </div>
        
    
                            </div>
                            <div className={styles.recieve}>
                                 <section className={styles.spendHeader}>Recieve</section>
                                <div className={styles.inputs}>
                                    <input type="text" placeholder="0.00" id="amountRecieved"className={styles.input} disabled/>
                                    <div className={styles.currencyButton} onClick={()=>{toggleDropdown2();}}>
                                                    {allowedCoins && (
                                                        <Image
                                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${Coin.id}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        />
                                                    )}
                                                    {allowedCoins && (
        
                                                        <section className={styles.text}>{Coin.symbol}</section>
                                                    )} 
                                                        <Image
                                                                src={`/images/currencies/downArrow.png`}
                                                                alt="currency"
                                                                width={14}
                                                                height={14}
                                                            />
                                                                 
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dropDown} ref={dropdownRef2} id="dropdownMenu">
                                    <div className={styles.dropDownMenu} id="dropdown2">
                                        <form className={styles.currencyForm}>
                                            <input type="text" placeholder="Search" className={styles.search} onChange={handleCoinChange}/>
                                            {shownCoins?.map((coin, index) =>{
                                                return(
                                                    <div key={index} className={styles.currencyTicker} onClick={()=>{setCoin(coin)}}>
                                                      <Image
                                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        />
                                                        <section className={styles.payCurrencyText}>{coin.coin}</section>
                                                    </div>
                                                )
                                            })

                                            }
                                        </form>
                                    </div>
                            </div>

                          

                            <div className={styles.pay}>
                                    <section className={styles.payText}>Pay With</section>
                                    <div className={styles.payWidget} id="payCurrency" onClick={()=>{setOnConfirm(true)}}>
                                        <div className={styles.payCurrency} >
                                            <Image
                                                src={`/images/currencies/${currency}.png`}
                                                alt="currency"
                                                width={30}
                                                height={30}
                                            /> 
                                            <section className={styles.payCurrencyText}>{currency}</section>
                                        </div> 
                                        {balance &&(
                                            <section className={styles.amount}>{getAmount(currency)}</section>
                                        )}
                                    </div>
                            </div>
                        </form>
                    </div> 
                    
                </div>

                    {(onConfirm && Coin) &&(
                        <div className={styles.confirmWrapper}>
                            <form className={styles.confirmForm} onSubmit={(e)=>{e.preventDefault()}}>
                                <section className={styles.confirmationTitle}>Confirmation</section>
                                <section className={styles.buying}>
                                    <section className={styles.buyingCoin}>
                                            <Image
                                                src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${Coin.id}.png`}
                                                alt="currency"
                                                width={30}
                                                height={30}
                                                />
                                            <section className={styles.payCurrencyText}>{Coin.symbol}</section>
                                    </section>

                                    <section className={styles.amountGetting}> + {amountCoin}</section>
                                </section>
                                <section className={styles.selling}>
                                    <section className={styles.buyingCoin}>
                                                        <Image
                                                            src={`/images/currencies/${currency}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        />
                                                <section className={styles.payCurrencyText}>{currency}</section>
                                        </section>

                                    <section className={styles.amountPaying}> - {amount}</section>
                                </section>

                                <button className={styles.confirmButton} onClick={()=>{handleConfirmClick()}}>Confirm {duration}</button>
                            </form>
                        </div>

                    )}
                    </>
                )}

                {option=="deposit" && (
                    <div className={styles.deposit}>
                        <div className={styles.depositHeader}>
                            Deposit Fiat
                        </div>

                        <div className={styles.depositForm}>
                            <form className={styles.DepositForm}>

                                {step==1 && (
                                    <>
                                    <section className={styles.depositText}>1.Select Currency</section>

                                    <section className={styles.grayText}>Currency</section>
                                    <div className={styles.depositButton} onClick={()=>{setOnCurrencyForm(true)}}>
                                                    <div className={styles.depositLeft}>
                                                        <Image
                                                            src={`/images/currencies/${currency}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        />

                                                    <section className={styles.text}>{currency}</section>
                                                    </div>

                                                        <Image
                                                            src={`/images/currencies/downArrow.png`}
                                                            alt="currency"
                                                            width={14}
                                                            height={14}
                                                        />
                                                        
                                    </div>
                                    </>
                                    )}

                                {step==2 && (
                                        <>
                                            <section className={styles.depositText}>2.Select Amount</section>

                                            <section className={styles.grayText}>Amount</section>
                                            <motion.div variants={animations2} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                                 <input type="text" className={styles.amountInput} placeholder='5000' id="amount"/>
                                            </motion.div>
                                        </>
                                    )}
                                    
                                    <section className={styles.payOption}>
                                     <input type="radio" name="radio"  className={styles.radio} checked/>
                         
                                                    <Image
                                                            src={`/images/card.png`}
                                                            alt="currency"
                                                            width={50}
                                                            height={50}
                                                        />
                                                    <section className={styles.paytext}>Bank Card</section>
                         
                                    </section>
                                    
                                    {step==1 && (<button className={styles.continue} onClick={()=>{setStep(2)}}>Continue</button>)}
                                    {step==2 && (<button className={styles.continue} onClick={()=>{setStep(3); setAmount(document.getElementById("amount").value)}}>Proceed and Pay</button>)}
                                    
                            </form>
                        
                        {step==3 && (

                            <div className={styles.detailsWrapper}>
                            
                                 <motion.form variants={animations}  onSubmit={(e)=>{e.preventDefault();}}initial="initial" animate="animate" transition={{duration:0.2, ease:"easeIn"}} className={styles.detailsForm}>
                                    <section className={styles.detailsHeader}>
                                        <section className={styles.headerText}>
                                            Enter your details
                                        </section>
                                        <Image
                                            src={`/images/cancel.png`}
                                            alt="cancel"
                                            width={24}
                                            height={24}
                                            onClick={()=>{setStep(2)}}
                                        /> 
                                    </section>
                                    <input type="text" className={styles.fullName} placeholder='John Doe'required/>


                                    <input type="text" placeholder='1234 1234 1234 1234' className={styles.cardNumber} pattern="[0-9]{13,19}" title="Card number should be 13 to 19 digits long." required/>

                                    <section className={styles.expCVV}>
                                         
                                            <section className={styles.expFlex}>
                                            <div className={styles.exp}>
                                  
                                                <select className={styles.select}>
                                                    <option value="1">Jan</option>
                                                    <option value="2">Feb</option>
                                                    <option value="3">Mar</option>
                                                    <option value="4">Apr</option>
                                                    <option value="5">May</option>
                                                    <option value="6">Jun</option>
                                                    <option value="7">Jul</option>
                                                    <option value="8">Aug</option>
                                                    <option value="9">Sep</option>
                                                    <option value="10">Oct</option>
                                                    <option value="11">Nov</option>
                                                    <option value="12">Dec</option>
                                                </select>
                                            </div>
                                            <section style={{fontWeight:"bold", fontSize:"1.5em"}}>/</section>
                                            <div className={styles.exp}>
                                                <select className={styles.select}>
                                                <option value="2024">2024</option>
                                                <option value="2025">2025</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                                <option value="2031">2031</option>
                                                </select>
                                            </div>
                                            
                                        </section>
                                        <input type="text" className={styles.cVV} placeholder='123' required/>
                                    </section>
                                    <button type="submit" className={styles.payButton} onClick={()=>{handlePayment();}}>Pay</button>
                                </motion.form>
                            </div>
                           
                        )

                        }
                        {onCurrencyForm==true && (
                            <motion.div className={styles.currencyWrapper} id="big" variants={animations} initial="initial" animate="animate" transition={{duration:0.2, ease:"easeInOut"}}>
                                    
                                        <form className={styles.currencyDropdown}>
                                            <div className={styles.dropDownSearch}>
                                            <div className={styles.cancel}>
                                                <section className={styles.dropdownText}>Select Currency</section>
                                                    <Image
                                                            src={`/images/cancel.png`}
                                                            alt="cancel"
                                                            width={24}
                                                            height={24}
                                                            onClick={()=>{setOnCurrencyForm(false)}}
                                                        /> 
                                            </div>
                                            <input type="text" placeholder="Search" className={styles.search} onChange={handleCurrencyChange}/>
                                            </div>
                                            <div className={styles.currencies}>
                                            {shownCurrencies.map((currency, index) =>{
                                                return(
                                                    <div key={index} className={styles.currencyTicker} onClick={()=>{setCurrency(currency); setOnCurrencyForm(false)}}>
                                                        <Image
                                                            src={`/images/currencies/${currency}.png`}
                                                            alt="currency"
                                                            width={30}
                                                            height={30}
                                                        /> 
                                                        <section className={styles.payCurrencyText}>{currency}</section>
                                                    </div>
                                                )
                                            })

                                            }

                                        </div>
                                        </form>
                                
                            </motion.div>
                        )}

                     

                        </div>
                    </div>  
                )}
            </div>
    )
}