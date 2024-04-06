'use client'
import Image from "next/image";
import styles from '@/styles/chatbot.module.css';
import { useState, useEffect } from "react";
import {animate, motion} from 'framer-motion'
import OpenAI from 'openai';
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function chatBot(){
   const [onChatbot, setOnChatbot] = useState(false);

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

   const context = { role: 'assistant', content: "You are assigned a crypto currency live chat role, you will reply to users with advice to crypto, you work for a company named Novatrade and your name is Novatrade AI, try to keep replies short and informative, sometimes mention your name to make conversations feel more human.Dont mention your name at the end of your sentence, only mention it mid conversation. If any questions are asked that are completely irrelevant to cryptocurrencies, reply with something along the lines of (I cannot help you with that as I am trained specifically for advice on cryptocurrencies). However if they greet you, respond with a greeting and mention who you are. If they ask for your name, reply and say what company you work for"};

   const openai = new OpenAI({
       apiKey: "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",
       dangerouslyAllowBrowser: true,
     });

   const handleUserInput = async () => {
       // Start the loading state
       setIsLoading(true);
   
       // Add the user's message to the chat history
       setChatHistory((prevChat) => [
         ...prevChat,
         { role: 'user', content: userInput, name: "You" },
       ]);
   
       // Make a request to OpenAI for the chat completion
       const chatCompletion = await openai.chat.completions.create({
         messages: [context, ...chatHistory, { role: 'assistant', content: userInput}],
         model: 'gpt-3.5-turbo-0125',
       });
   
       // Add the assistant's response to the chat history
       setChatHistory((prevChat) => [
         ...prevChat,
         { role: 'assistant', content: chatCompletion.choices[0].message.content, name: "NovatradeAI"},
       ]);
       
   
       // Clear the user input field and end the loading state
       setUserInput('');
       setIsLoading(false);
   };
    return (
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
    )
}