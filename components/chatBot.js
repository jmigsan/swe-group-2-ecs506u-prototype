'use client'
import Image from "next/image";
import styles from '@/styles/chatbot.module.css';
import { useState, useEffect } from "react";
import {animate, motion} from 'framer-motion'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from "next-auth/react";
export default function chatBot(){
   const [onChatbot, setOnChatbot] = useState(false);
    const {data:session} = useSession();
   const animations={
        initial:{
        y:'100%',
   
        },
        animate:{
            y:'0%'
        
        }
   }

   const animations2={
    animate:{
        rotate:360
    }
   }

   const [userInput, setUserInput] = useState('');
   const [chatHistory, setChatHistory] = useState([]);
   const [isLoading, setIsLoading] = useState(false);



   

   const handleUserInput = async () => {
       
       setIsLoading(true);
   
       
       setChatHistory((prevChat) => [
         ...prevChat,
         { role: 'user', content: userInput, name: "You" },
       ]);

       try {
        
        const res = await fetch('api/Chatbot/chatbot',{
            method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chatHistory:chatHistory,
                userInput:userInput
              }), });

        if (res.ok) {
            const data = await res.json();
            setChatHistory((prevChat) => [
                ...prevChat,
                { role: 'assistant', content: data.content, name: "NovatradeAI"},
              ]);
            
            
        } else {
            console.error('Error fetching user session');
        }
    } catch (error) {
        console.error('Internal Server Error');
    }
 
       setUserInput('');
       setIsLoading(false);
   };
    return (
        <>
    {session?.user.role==="Investor" && (
        <motion.div className={styles.chatBot}>
            <motion.div className={styles.chatBotHover}  variants={animations2} animate="animate" transition={{duration:0.6, ease:"easeInOut"}}>
            <Image 
                src={'/images/chatBotLogo.png'}
                height={60}
                width={60}
                alt="logo"
            />
            <section className={styles.text} onClick={()=>{setOnChatbot(true); console.log("here")}}>Support</section>
            </motion.div>
        {onChatbot && (
            <motion.div className={styles.chatBotContainer} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, originY: 0 , ease:"easeInOut"}}>
                <div className={styles.header}>
                    <section>NovaBot</section>
                    <Image
                        src={`/images/cancel.png`}
                        alt="cancel"
                        width={24}
                        height={24}
                        onClick={()=>{setOnChatbot(false)}}
                        
                        /> 
                </div>
                <div className={styles.chatHistory}>
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`${styles[message.role === 'assistant' ? 'assistantMessage' : 'userMessage']}`}>
                            {console.log(message)}
                            <h1>{message.name}</h1>
                            <h2>{message.content}</h2>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleUserInput} className={styles.userInput}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder="Type your message here..."
                            className={styles.input}
                        />
                        <button onClick={handleUserInput} disabled={isLoading}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                        </button>
                </form>
            </motion.div>
        )}
        </motion.div>
    )}
    </>
    )
  
}