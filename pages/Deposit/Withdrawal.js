import styles from '@/styles/withdraw.module.css';
import { useState,  useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';           
import DropDown from '@/pages/ExperiencedTrading/CryptoDropDown';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
export default function Withdrawal(){
    const {data:session} = useSession();
    const [step, setStep]=useState(1);
    const [Currency, setCurrency] = useState({curren: "GBP"});                                                                                                                                                                                                                                                                                                                                                                                      
    const [drop, setDrop]=useState(false);
    const dropdownRef = useRef(null);
    const [balance, setBalance]= useState(0);
    const [amount, setAmount]= useState(0);
    const [sentence, setSentence]= useState("Contacting Bank...");
    const router = useRouter();
    const animations={
      initial:{
        x:'100%',
      },
      animate:{
        x:'0%',
      }
    }

    const animations2={
      start:{
        transition:{
            staggerChildren: 0.1,
        }
      },
       end:{
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

    async function updateBalance(){
      const username= session.user.email;
      const currency = Currency.curren;
      try{
          await fetch('../api/Deposit/deposit', {
              method: 'POST',
              headers:{
                  'Content-Type': 'application/json',
              },

              body: JSON.stringify({username, currency, amount})
          });

      }

      catch(error){
          console.error(error);
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


      useEffect(()=>{
        if(session){
          setbalance();
        }
      }, [Currency, session]);

      function handleWithdraw(){
        document.getElementById("text2").style.display="none";
       document.getElementById("loading").style.display = "flex";
        setTimeout(() => {
          document.getElementById("loading").style.display = "none";
          document.getElementById("text2").style.display="inline";
          const valid =checkInputs();
          if(valid){
            setStep(3);
          }
        },[3000]);

    
      }

      function handlePayment(){
        const processingMessages = [
          "Contacting Bank...",
          "Authenticating Details...",
          "Verifying Transaction...",
          "Securing Funds Transfer...",
          "Processing Withdrawal...",
          "Finalizing Request...",
          "Confirming with Ledger...",
          "Completion Imminent...",
          "Syncing with Blockchain...",
          "Executing Smart Contract...",
          "Confirming Receipt...",
          "Updating Account Balance...",
          "Generating Transaction Record...",
          "Performing Security Checks...",
          "Awaiting Final Confirmation..."
        ];

        let i=0;

        document.getElementById("loading").style.display="flex";
        document.getElementById("step3").style.display="none";
        
        const interval =setInterval(async (interval) => {
          if(i==processingMessages.length){
              document.getElementById("image1").style.display="none";
              document.getElementById("image2").style.display="block";
              clearInterval(interval);
              await updateBalance();
              router.replace("/Deposit/DepositWrapper")
           
            
          }
            setSentence(processingMessages[i])
            i+=1
        },[800])

       

      }
      function checkInputs(){

        if(Number(document.getElementById("amount").value) >balance || Number(document.getElementById("amount").value)==0){
          document.getElementById("amount").style.border = "1pt solid red";
          document.getElementById("amount").style.borderRadius = "0.5em";
          return false;
        }
        else{
          document.getElementById("amount").style.border = "none";
          document.getElementById("amount").style.borderRadius = "0em";
          document.getElementById("amount").style.borderBottom = "1pt solid lightgray";
          return true;
        }
      }

      async function setbalance()
      {

        const b = await fetchBalance();
        for(let i=0; i<b.length; i++){

          if(b[i].currency==Currency.curren){

            setBalance(b[i].amount);
          }
        }
      }
      const formHeight = drop ? "25em" : "auto"; // Adjust the height as needed
      
      async function fetchBalance(){

        try{
        const username= session.user.email;
        const res = await fetch('../api/Deposit/getBalance', {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username})
        })

        const balance = await res.json();
        return balance;
      }

      catch(error) {
          console.error(error);
      }
    }
    return (
        <div className={styles.withdrawContainer}>
       
            <form className={styles.withdrawForm} onSubmit={(e)=>{e.preventDefault()}} id="form" style={{ height: formHeight }}>
                {step==1 && (
                    <>
                    <div className={styles.stepTitle}>1.Select a currency</div>
                    <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.pickCurrency} onClick={()=>{setDrop(true)}}>
                      <Image
                            src={`/images/currencies/${Currency.curren}.png`}
                            alt="currency"
                            width={30}
                            height={30}
                      />
                      <section className={styles.currencyName}>{Currency.curren}</section>
                      <Image
                        src={`/images/currencies/downArrow.png`}
                         alt="currency"
                        width={14}
                       height={14}
                       />
                    </motion.div>
                    {drop &&(
                    <div ref={dropdownRef}>
                        <DropDown setCurrency={setCurrency} type={"fiat"} position={"unset"}/>
                    </div>

                  )}     

                  <button className={styles.button} onClick={()=>{setStep(2)}}>Next</button>      
                    
                  </>
                )}

                {step==2 && (
                  <>
                    <div className={styles.stepTitle}>2.Enter Amount to Withdraw</div>
                    <div className={styles.maxAmount}>
                      <motion.input className={styles.input} variants={animations} initial="initial" type="text" placeholder="Enter Amount" onChange={(e)=>{setAmount(-Number(e.target.value))}} animate="animate" id="amount" transition={{duration:0.4, ease:"easeInOut"}}/>
                      <section className={styles.max} onClick={()=>{document.getElementById("amount").value=balance; setAmount(-balance)}}>Max: {balance}</section>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.backButton} onClick={()=>{setStep(1)}}>Back</button> 
                      <button className={styles.button} onClick={()=>{handleWithdraw();}}>
                        
                
                          <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading">
                            <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                            <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                            <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                          </motion.div>
                
                          <section id="text2">Next</section>
                 
                      </button> 

                    </div>
                </>
                )}

                {step==3 && (
                  <>
                  <div id="step3" className={styles.step3}>
                    <div className={styles.stepTitle}>3.Enter Bank Details</div>
                      <input type="text" className={styles.input} placeholder="Enter Full Name" />
                      <input type="text" className={styles.input} placeholder="Enter Account Number" />
                      <input type="text" className={styles.input} placeholder="Enter Sort Code" />
                      <div className={styles.buttons}>
                        <button className={styles.backButton} onClick={()=>{setStep(2)}}>Back</button> 
                        <button className={styles.button} onClick={()=>{handlePayment();}}>Process</button>
                    </div>
                  </div>
                  <div id="loading" className={styles.loading}>
                    <motion.img  src={'/images/loadingAnimation.png'} width={80} height={80} animate={{ rotate: 360 }} transition={{duration: 2, repeat: Infinity,repeatType: "loop"}} id="image1"/>
                    <img src={'/images/tick.gif'} width={80} height={80} id="image2" className={styles.image2}/>
                    <div className={styles.loadingText}>{sentence}</div>            
                  </div>
                  </>
                )}
            </form>
        </div>
    )
}