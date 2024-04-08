import { useState, useEffect } from "react";
import { useRef } from "react";
import styles from '@/styles/dropdown.module.css';
import Image from "next/image";
export default function DropDown({setCurrency, type, position}){
    const [shownCurrency, setShown]=useState(null);
    const [allowedCoins, setAllowedCoins]=useState(null);
    const [availableCurrency, setAvailableCurrency]= useState([{curren:"USD"}, {curren:"EUR"}, {curren:"GBP"}, {curren:"JPY"}, {curren:"AUD"}, {curren:"CHF"}, {curren:"CAD"}, {curren:"SAR"}]);
   

      useEffect(()=>{
        if(type=="crypto"){
        fetchAllowed();
        }
        else{
            setShown(availableCurrency);
        }
         
     }, [])

      async function fetchAllowed(){
        try{
            const coins= await fetch('../api/ExperiencedTrading/allowedCryptos', {
                method: 'GET',
            })
            const res = await coins.json();
            setAllowedCoins(res);
            setShown(res);
        }
        catch(error){
            console.error(error);
        }


    }


    const handleCoinChange =(e)=>{
        const new_arr=[];
        const str = e.target.value;
        if(type=="crypto"){
            
            
            for(let i=0; i<allowedCoins.length; i++) {
                if(allowedCoins[i].coin.includes(str)) {
                    new_arr.push(allowedCoins[i]);
                }
            }
        }
        else{
            for(let i=0; i<availableCurrency.length; i++) {
                if(availableCurrency[i].curren.includes(str)) {
                    new_arr.push(availableCurrency[i]);
                }
            }
        }
    
        setShown(new_arr);
    }
    return (
        <div className={styles.test2}>
            <div className={styles.test} style={{position:position}}>
                <div className={styles.currencyForm}>
                    <input type="text" placeholder="Search" className={styles.search} onChange={handleCoinChange}/>
                    <div className={styles.overflow}>
                            {shownCurrency?.map((curr, index) =>{
                                    return(
                                        <>
                                            {type=="crypto" ? (
                                                <div key={index} className={styles.currencyTicker} onClick={()=>{setCurrency(curr)}}>
                                                    <Image
                                                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${curr.id}.png`}
                                                    alt="currency"
                                                    width={30}
                                                    height={30}
                                                    />
                                                    <section className={styles.payCurrencyText}>{curr.coin}</section>
                                                </div>
                                            ):(
                                  
                                                <div key={index} className={styles.currencyTicker} onClick={()=>{setCurrency(curr)}}>
                                                    <Image
                                                        src={`/images/currencies/${curr.curren}.png`}
                                                        alt="currency"
                                                        width={30}
                                                        height={30}
                                                    /> 
                                                    <section className={styles.payCurrencyText}>{curr.curren}</section>
                                                </div>
                                         
                                            )
                                            }
                                            
                                            </>
                                    )
                                })
                            }
                               </div>

                                
                            </div>
                        </div>
         </div>
    )
}