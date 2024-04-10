import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "@/styles/transfer.module.css";
import { motion } from "framer-motion";
import DropDown from "./ExperiencedTrading/CryptoDropDown";
import { useRef } from 'react';
import Image from "next/image";
export default function (req, res){

    const {data:session} = useSession();
    const [coinSent, setCoinSent] = useState({coin: "BTC", amount:0});
    const [amountSent, setAmount] = useState(0);
    const [currency, setCurrency] = useState({symbol: "BTC"})
    const [userSend, setUserSend] = useState({});
    const [balance, setBalance] = useState([]);
    const [drop, setDrop] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const dropdownRef = useRef(null);
    const animations={
        initial:{
            x:"100%",
        },

        animate:{
            x:"0%",
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // Hide the dropdown if a click outside is detected
            setDrop(false);
          }
        };
      
        // Add when the component mounts
        document.addEventListener("mousedown", handleClickOutside);
        
        // Return a function to remove the event listener when the component unmounts
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    async function fetchBalance(){
        try{
        const username= session.user.email;
        const res = await fetch('../api/Deposit/getBalance', {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username})
        })

        const b = await res.json();
        setBalance(b);
        for(let i=0; i<b.length; i++){
            if(b[i].currency==currency.symbol){
                setCoinSent({coin:b[i].currency, amount:b[i].amount})
            }
        }
     }
        catch(error){
            console.error(error);
        }
    }
    
    
    function changeCoin(){

        for(let i=0; i<balance.length; i++){
       
            if(balance[i].currency==currency.symbol){
                setCoinSent({coin:balance[i].currency, amount:balance[i].amount})
            }
        }
    }
    
    useEffect(()=>{
        if(balance){
            changeCoin();
        }
    },[currency])
    const animations2={
        start:{
          x:100,
  
          transition:{
              staggerChildren: 0.1,
          }
        },
         end:{
          x:0,
              transition:{
                  staggerChildren:0.1,
              }
          },
      }
  
      const animations3={
          start:{
              y:"0%",
          },
          end:{
              y:"100%",
          }
      }


    useEffect(()=>{
        if(session){
            fetchBalance();
        }
    }, [session])

    async function handleNextClick(index){
        document.getElementById("text").style.display = "none";
        document.getElementById("loading").style.display = "flex";
        let error;
        let valid;
        if(index==1){
        const username = document.getElementById("input").value;
            if(username==session.user.email){
                error="Cannot be your username";
                valid=false;
            }
            else{
            try{
                const exists = await fetch('api/Login/checkUsername', {
                    method: 'POST',
                    headers:{
                        'Content-type' : 'application/json'
                    },
                    body:JSON.stringify({username})
                })

                if(exists.ok){
                    setUserSend(username);
                    error=""
                    valid=true;
                }

                else{
                    error="User does not exist";
                    valid=false;
                }
            }
            catch(error){
                setError("Error occurred")
            }
        }
    }
    else if(index==2){
        const amount= document.getElementById("input").value;
        if(Number(amount)>coinSent.amount){
            error="Insufficient amount of coin";
            valid=false;
        }
        else if(Number(amount)<=0){
            error="Invalid amount";
            valid=false;

        }
        else{
            setAmount(amount);
            await fetch('api/Transfer/transfer', 
            {
                method: 'POST',
                headers:{
                    'Content-type' : 'application/json',
                },
                body:JSON.stringify({from:session.user.email, to:userSend, coin:coinSent.coin, amount:amount})
            })
            error="";
    
            valid=true;
        }
    }
        setTimeout(()=>{
            document.getElementById("text").style.display = "block";
            document.getElementById("loading").style.display = "none";
            setError(error);
            if(valid){
                setStep(index+1);
            }
        },[3000])
    }
    const formHeight = drop ? "20em" : "auto"; // Adjust the height as needed
    return (
        <div className={styles.transferWrapper}>
                <form className={styles.transferForm} style={{ height: formHeight }}>
                    {step==1 && (
                        <>
                        <section className={styles.header}>
                            <section className={styles.headerTitle}>Enter Username</section>
                            <section className={styles.headerSubTitle}>Enter username of individual to send to</section>
                        </section>
                        <motion.input variants={animations} initial="initial" placeholder="Enter Username" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} type="text" className={styles.input} id="input" />
                        {error && (
                            <section className={styles.error}>{error}</section>
                        )}
                        <button type="button" className={styles.button}>
                                <section className={styles.buttonText} id="text" onClick={()=>{handleNextClick(1)}}>Next</section>
                                <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading">
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                </motion.div>
                        </button>
                        </>
                    )}

                    {step==2 && (
                        <>
                            <section className={styles.header}>
                                <section className={styles.headerTitle}>Choose Coin</section>
                                <section className={styles.headerSubTitle}>Choose crypto and enter amount to send</section>
                            </section>
                            <motion.div  variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.inputs}>
                                <input placeholder="Enter Amount" type="text" className={styles.input} id="input" />
                                <input className={styles.input2} value={coinSent.coin} onClick={()=>{setDrop(true)}}readOnly/>
                            </motion.div>
                            {drop && (
                                <div ref={dropdownRef} className={styles.drop}>
                                    <DropDown setCurrency={setCurrency} type={"crypto"} position={"unset"}/>
                                </div>
                                
                                )}
                            <section className={styles.max}>Max: {coinSent.amount}</section>
                            {error && (
                            <section className={styles.error}>{error}</section>
                            )}
                            <button type="button" className={styles.button}>
                                <section className={styles.buttonText} id="text" onClick={()=>{handleNextClick(2)}}>Next</section>
                                <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading">
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                </motion.div>
                            </button>
                        </>
                    )}

                    {step==3 && (
                        <>
                            <Image 
                            src={'/images/success.png'}
                            width={80}
                            height={70}
                            alt="success"
                            />
                            <section className={styles.successTitle}>Transfer Successful</section>
                            <div className={styles.flex}>
                                <section className={styles.grayText}>Amount</section>
                                <section className={styles.text5}>{amountSent} {coinSent.coin}</section>
                            </div>
                            <div className={styles.flex}>
                                <section className={styles.grayText}>Transferred To</section>
                                <section className={styles.text5}>{userSend}</section>
                            </div>
                        </>
                    )}
                </form>
        </div>
    )
}