
import {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/api.module.css'
import Image from 'next/image';
export default function Solutions(){
    const {data:session}= useSession();
    const [API_KEY, setKey]= useState("");
    async function generateKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
      
        for (let i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        setKey(result);

        try{
        await fetch('../api/key/createKey', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify({username:session.user.email, key:result})
        })
        }
        catch(error){
            console.error(error);
        }
      }

      function copyText() {
        navigator.clipboard.writeText(API_KEY);
        document.getElementById("copyImage").style.display = "none";
        document.getElementById("copy").style.display = "block";

        setTimeout(()=>{
            document.getElementById("copyImage").style.display = "block";
            document.getElementById("copy").style.display = "none";
        },[2000])
      }
    return (
        <div className={styles.solutionsContainer}>
                <section className={styles.solutionsTitle}>NovaTrade API</section>
                <div className={styles.generateSection}>
                    <section className={styles.generateTitle}>Generate an API key</section>
                    <section className={styles.generateInput}>
                        <div className={styles.inputs}>
                            <input type="text" value={API_KEY} className={styles.input} placeholder='API-KEY' readOnly/>
                            <Image 
                            src={'/images/link.png'}
                            width={30}
                            height={30}
                            alt="copy"
                            className={styles.copy}
                            id="copyImage"
                            onClick={()=>{copyText();}}
                            />
                            <section className={styles.copyMessage} id="copy">Copied!</section>
                        </div>
                        
                        <button className={styles.generateButton} onClick={()=>{generateKey()}}>
                                Generate
                        </button>
                    </section>
                </div>
                <div className={styles.documentationSection}>
                    <section className={styles.generateTitle}>Documentation</section>
                    <div className={styles.intro}>
                        <section className={styles.Title}>Introduction</section>
                        <section className={styles.introParagraph}>The NovaTrade API is a suite of high-performance RESTful JSON endpoints that are specifically designed to meet the mission-critical demands of application developers, data scientists, and enterprise business platforms.</section>
                        <section className={styles.introParagraph}>This API reference includes all technical documentation developers need to integrate third-party applications and platforms</section>
                    </div>
                    
                    <div className={styles.intro}>
                        <section className={styles.Title}>Quick Start Guide</section>
                        <section className={styles.introParagraph}>For developers eager to hit the ground running with the CoinMarketCap API here are a few quick steps to make your first call with the API.</section>
                        <div className={styles.steps}>
                                <section>
                                    <section className={styles.stepBold}>1.Create an Account</section> You can sign up at novaTrade.com - This is our live production environment with the latest market data. Select the free Basic plan if it meets your needs or upgrade to a paid tier.
                                </section>
                                <section>
                                    <section className={styles.stepBold}>2.Make a test call using your key</section> Once you sign up you'll land on your Developer Portal account dashboard. Copy your API from the API Key box in the top right panel.
                                </section>
                                <section>
                                    <section className={styles.stepBold}>3.Implement into your application!</section> Now that you've confirmed your API Key is working, get familiar with the API by reading the rest of this API Reference and commence building your application!
                                </section>
                        </div>
                    </div>
                    <div className={styles.intro}>
                        <section className={styles.Title}>Endpoint Overview</section>
                        <section className={styles.overViewTitle}>The NovaTrade API is divided into two top level categories</section>
                        <table className={styles.table}>
                            <tr>
                                <td className={styles.colT}>
                                    Endpoint Category
                                </td>
                                <td className={styles.colT}>
                                    Documentation
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    /nova-Trade
                                </td>
                                <td className={styles.col}>
                                    Endpoint that executes a spot trade based on the parameters specified by the user
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    /nova-Price
                                </td>
                                <td className={styles.col}>
                                    Endpoint that returns the latest price data for all crypto currencies provided on the NovaTrade platform
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={styles.intro}>
                        <section className={styles.Title}>Trade</section>
                        <section className={styles.introParagraph}>The Trade endpoint allows you to easily buy or sell any crypto currency available on our exchange platform</section>
                        <section className={styles.introParagraph}>Below you can see an example api call as well as the accepted parameters</section>
                        <section className={styles.exampleUrl}>http:localhost:3000/api/nova-Trade?API_KEY='YOUR_KEY'&coin=BTC&amount=1&currency=GBP&type=Buy</section>
                        <section className={styles.overViewTitle}>Accepted parameters</section>
                        <table className={styles.table}>
                            <tr>
                                <td className={styles.colT}>
                                    Parameter
                                </td>
                                <td className={styles.colT}>
                                    Documentation
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    API_KEY
                                </td>
                                <td className={styles.col}>
                                    The API key that you generated above
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    coin
                                </td>
                                <td className={styles.col}>
                                    The symbol for the cryptocurrency you wish to trade
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    amount
                                </td>
                                <td className={styles.col}>
                                    The amount of the coin as an INTEGER that you want to buy or sell
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    currency
                                </td>
                                <td className={styles.col}>
                                    The fiat currency that you want to buy with or recieve when selling a coin
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    type
                                </td>
                                <td className={styles.col}>
                                    The type of trade to be executed. Can be Buy or Sell
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={styles.intro}>
                        <section className={styles.Title}>Price Data</section>
                        <section className={styles.introParagraph}>The Price Data endpoint allows you to recieve live price data for your desired cryptocurrency!</section>
                        <section className={styles.introParagraph}>Below you can see an example api call as well as the accepted parameters</section>
                        <section className={styles.exampleUrl}>http://localhost:3000/api/nova-Price/price?API_KEY=GDnSwqARkx&symbol=BTC&currency=GBP</section>
                        <table className={styles.table}>
                            <tr>
                                <td className={styles.colT}>
                                    Parameter
                                </td>
                                <td className={styles.colT}>
                                    Documentation
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    API_KEY
                                </td>
                                <td className={styles.col}>
                                    The API key that you generated above
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    symbol
                                </td>
                                <td className={styles.col}>
                                    The symbol to retrieve price data for
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.colL}>
                                    currency
                                </td>
                                <td className={styles.col}>
                                    The currency the price data should be shown in
                                </td>
                            </tr>
                            
                        </table>
                    </div>
                </div>
                
        </div>
    )
}