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
    const [trades , setUserTrades]= useState([]);
    const [portfolio, setUserPortfolio] = useState([]);
    const [tickets, setUserTickers] = useState([]);
    const [details, setUserDetails] = useState([]);
    const [ended, setEnded]= useState(false);
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
                    const id =requests[key].userId;
                    setUserId(id);
                    deleteRequest(id);
                    fetchUserInformation(id);
                    socket.emit('Connected', 'Connected to user');
                    document.getElementById('form2').style.display = 'none';
                    document.getElementById('chat').style.display = 'flex';
                    document.getElementById('info').style.display = 'flex';
                });
               
            }
        document.getElementById('end').addEventListener('click', (e)=>{
            socket.emit("Ended", "Chat has been closed");
            if(session.user.role=="Investor"){
                document.getElementById('chat').style.display = 'none';
                setEnded(true);
            }

            else if(session.user.role=="Staff"){
                document.getElementById('info').style.display = 'none';
                document.getElementById('chat').style.display = 'none';
                setEnded(true);
            }
        });

        socket.on("Ended", (message)=>{
            if(session.user.role=="Investor"){
                document.getElementById('chat').style.display = 'none';
                setEnded(true);
            }

            else if(session.user.role=="Staff"){
                document.getElementById('info').style.display = 'none';
                document.getElementById('chat').style.display = 'none';
                setEnded(true);
            }
        })
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

    async function fetchUserInformation(username){
        try{
            const info = await fetch('../api/Admin/fetchUserInfo', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({username})
            })
  
            const information = await info.json();
            console.log(information);
            setUserDetails(information.details);
            setUserPortfolio(information.portfolio);
            setUserTrades(information.trades);
        }
        catch(error){
            console.error(error);
        }
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

function handleAccor(index){
    const drops = document.querySelectorAll("#drop");

    for(let i=0; i<drops.length; i++){
        if(i==index){
            drops[i].style.height="auto";
            drops[i].style.padding="1em";
        }
        else{
            drops[i].style.height="0%";
            drops[i].style.padding="0em";
        }
    }
}
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
                        <div className={styles.bottomChat}> 
                            <input type="text" placeholder='Type message' id="message" className={styles.inputMessage} />
                            <button type="button" id="end" className={styles.endButton}>End</button>
                        </div>              
                </form>
                {ended && (
                    <div className={styles.ended}>
                        <div className={styles.endedFlex}> 
                            <Image
                                src={'/images/tick.gif'}
                                alt="tick"
                                width={60}
                                height={60}
                            />
                            <section className={styles.endedMessage}>The chat has now ended</section>
                        </div>
                    </div>
                )}
            </div>
        ): (
            <div className={styles.chatWrapper2}>
                <div className={styles.userInfo} id="info">
                    <form className={styles.chat} id="chat" onSubmit={(e)=>{e.preventDefault();}}>
                            <div className={styles.messageBox} id="messageBox">
                            </div>
                            <div className={styles.bottomChat}> 
                            <input type="text" placeholder='Type message' id="message" className={styles.inputMessage} />
                            <button type="button" id="end" className={styles.endButton}>End</button>
                        </div>             
                    </form>

                    <div className={styles.accordion}>
                            <div className={styles.accor}>
                                <section className={styles.accorTitle}>Details</section>
                                <Image 
                                    src={'/images/untoggledDesc.png'}
                                    width={20}
                                    height={20}
                                    alt='down'
                                    onClick={()=>{handleAccor(0)}}
                                />
                            </div>
                            <div className={styles.accorDrop} id="drop">
                                {details && (
                                    <div className={styles.accorTicker}>
                                        <div>{details.firstName}</div>
                                        <div>{details.email}</div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.accor}>
                                <section className={styles.accorTitle}>Trades</section>
                                <Image 
                                    src={'/images/untoggledDesc.png'}
                                    width={20}
                                    height={20}
                                    alt='down'
                                    onClick={()=>{handleAccor(1)}}
                                />
                            </div>
                            <div className={styles.accorDrop} id="drop">
                            {trades && (
                                        
                                        trades.map((trade) =>{
                                            return (
                                            <div className={styles.accorTicker}>
                                                <div>{trade.Type}</div>
                                                <div> {trade.AmountBought}{trade.Bought}</div>
                                                <div>{trade.AmountSold}{trade.Sold}</div>
                                            </div>
                                            )
                                            })
                                )}
                            </div>
                            <div className={styles.accor}>
                                <section className={styles.accorTitle}>Tickets</section>
                                <Image 
                                    src={'/images/untoggledDesc.png'}
                                    width={20}
                                    height={20}
                                    alt='down'
                                    onClick={()=>{handleAccor(2)}}
                                />
                            </div>
                            <div className={styles.accorDrop} id="drop">

                            </div>
                            <div className={styles.accor}>
                                <section className={styles.accorTitle}>Portfolio</section>
                                <Image 
                                    src={'/images/untoggledDesc.png'}
                                    width={20}
                                    height={20}
                                    alt='down'
                                    onClick={()=>{handleAccor(3)}}
                                />
                            </div>
                            <div className={styles.accorDrop} id="drop">
                                {portfolio && (
                                    portfolio.map((p) =>{
                                        return (
                                        <div className={styles.accorTicker}>
                                            <div>{p.amount}</div>
                                            <div>{p.currency}</div>
                                        </div>
                                        )
                                    })
                                )}
                            </div>
                    </div>
                </div>
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
                {ended && (
                    <div className={styles.ended}>
                        <div className={styles.endedFlex}> 
                            <Image
                                src={'/images/tick.gif'}
                                alt="tick"
                                width={60}
                                height={60}
                            />
                            <section className={styles.endedMessage}>The chat has now ended</section>
                        </div>
                    </div>
                )}
            </div>
        )}
        </>
    )
}