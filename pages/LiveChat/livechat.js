import io from 'socket.io-client';
let socket;
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/livechat.module.css'
import Image from 'next/image';
import {motion} from 'framer-motion';
export default function LiveChat(){

    const {data: session} = useSession();
    const [requests, setRequests]= useState(null);
    const [userId, setUserId] = useState("");
    const [waiting, setWaiting] = useState(true);
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


useEffect(() => {
    if(session && requests){
        socketInitializer();
    }
}, [session, requests])
 
    const socketInitializer = async () => {
      await fetch('/api/LiveChat/livechat')
      socket = io()
  
      socket.on('connect', async() => {
    
        
       
        document.getElementById('chat').addEventListener('submit', (e)=>{
                e.preventDefault();

                if(session.user.role=="Investor"){
                    setUserId(session.user.email);
                }
                const msg = document.getElementById('message').value;
                const message ={
                    msg: msg,
                    role: session.user.role,
                    id: userId,
                }

                handleMessageSend(msg);
           
            socket.emit("message", message);
               
                
            })
        

        if(session.user.role=="Investor"){
                await createRequest();
                socket.emit('NewRequest', 'new request made');
        }

        if(session.user.role=="Staff"){
                document.getElementById('form2').addEventListener('submit', (e)=>{
                    e.preventDefault();
                    
                    const key = document.getElementById('connect').getAttribute('data-key'); 
                    const id =requests[key].userId
                    setUserId(id);
                    deleteRequest(id);
                    socket.emit('Connected', 'Connected to user');
                    document.getElementById('form2').style.display = 'none';
                    document.getElementById('chat').style.display = 'flex';
                });
               
            }
        
        socket.on(userId, (message)=>{
            if(message.role=="Investor"){
                handleMessageRecieve(message.msg);
            }
            else if(message.role=="Staff"){
                handleMessageRecieve(message.msg);
            }
        })
        

        socket.on('GetRequests', (message)=>{
            
            if(session.user.role=="Staff"){
                getRequests();
            }
        })
        
        socket.on('Connected', (message)=>{
            if(session.user.role=="Investor"){
                setWaiting(false);
                document.getElementById('chat').style.display = 'flex';
            }
        })
    
           
      })

  
        
    }

    function handleMessageSend(msg){
        
        document.getElementById('message').value = '';
        const box = document.getElementById('messageBox');
        const div=document.createElement('div');
        div.className=styles.ownMessage;
        div.innerHTML = msg;
        box.appendChild(div);
    }

    function handleMessageRecieve(msg){
       
        const box = document.getElementById('messageBox');
        const div=document.createElement('div');
        div.className=styles.otherMessage;
        div.innerHTML = msg;
        box.appendChild(div);
    }

    async function createRequest(){
        const username = session.user.email;
        try{
            await fetch('../api/LiveChat/createRequest', {
                method: 'POST',
                headers:{
                    'Content-Type': 'Application/json'
                },
                body:JSON.stringify({username}),
            })
        }
        catch(error){
            console.log(error);
        }
    }

    async function deleteRequest(username){
      
        console.log(username);
        try{
            await fetch('../api/LiveChat/deleteRequest', {
                method: 'POST',
                headers:{
                    'Content-Type': 'Application/json'
                },
                body:JSON.stringify({username}),
            })
        }
        catch(error){
            console.log(error);
        }
    }
   async function getRequests(){
    try{
        const res = await fetch('../api/LiveChat/getRequests',{
            method: 'GET',
        })

        const reqs = await res.json();
        setRequests(reqs);
    }
    catch(error){
        console.error(error);
    }
   }
   

useEffect(()=>{
    getRequests();
}, [])
    return (
        <>
        {session?.user.role=="Investor" ?(
            <div className={styles.chatWrapper}>
            {waiting && (
                    <div className={styles.waiting}>
                        <Image
                        src={`/images/waitingSupport.png`}
                        alt="cancel"
                        width={80}
                        height={80}
                        />
                        <section className={styles.waitingText}>
                            A member of our support team will be with you shortly
                        </section>
                        <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading">
                                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                        </motion.div>
                    </div>
                )}
               <form className={styles.chat} id="chat" onSubmit={(e)=>{e.preventDefault();}}>
                        <div className={styles.messageBox} id="messageBox">
                        </div>
                        <input type="text" placeholder='Type message' id="message" className={styles.inputMessage} />               
                </form>
            </div>
        ): (
            <div>
                 <form className={styles.chat} id="chat" onSubmit={(e)=>{e.preventDefault();}}>
                        <div className={styles.messageBox} id="messageBox">
                        </div>
                        <input type="text" placeholder='Type message' id="message" className={styles.inputMessage} />               
                </form>
                <form className={styles.connectRequests} id="form2">
                    <section className={styles.formTitle}>Live Chat Requests</section>
                        <div className={styles.connectBox}>
                            {requests?.map((req, i)=>{
                                return (
                                    <div className={styles.connectTicker}>
                                            <section className={styles.userId}>{req.userId}</section>
                                            <button type="submit" className={styles.connectButton} id="connect" data-key={i}>Connect</button>
                                    </div>
                                )
                            })}
                        </div>           
                </form>
            </div>
        )}
        </>
    )
}