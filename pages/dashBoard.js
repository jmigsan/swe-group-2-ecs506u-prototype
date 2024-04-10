import styles from '@/styles/dashboard.module.css'
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LiveChat from './LiveChat/livechat';
import Experienced from './ExperiencedTrading/experienced';
import Support from './Support/support'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function Dashboard(){
    const [onNav, setOnNav] = useState(false);
    const [users, setUsers] = useState([]);
    const [trades, setTrades] = useState([]);
    const [trades2, setTrades2] = useState([]);
    const [trades3, setTrades3] = useState([]);
    const [option, setOption] = useState("home");
    const router = useRouter();
    useEffect(() =>{
        fetchInformation();
    },[]);





                
                   const options = {
                        series: Object.values(trades),
                        labels: Object.keys(trades),
                    }
  
              
            
              const lineOptions = {
                chart: {
                  type: 'line',
                  toolbar: {
                    show: false,
                  },
                 
                },
                stroke: {
                    curve: 'smooth',
                  },
                xaxis:{
                    categories: Object.keys(users)
                },
                series: [{
                    data: Object.values(users),
                  }]
              }

              const lineOptions2 = {
                chart: {
                  type: 'line',
                  toolbar: {
                    show: false,
                  },
                 
                },
                stroke: {
                    curve: 'smooth',
                  },
                xaxis:{
                    categories: Object.keys(trades2)
                },
                series: [{
                    data: Object.values(trades2),
                  }]
              }
              const lineOptions3 = {
                chart: {
                  type: 'line',
                  toolbar: {
                    show: false,
                  },
                 
                },
                stroke: {
                    curve: 'smooth',
                  },
                xaxis:{
                    categories: Object.keys(trades3)
                },
                series: [{
                    data: Object.values(trades3),
                  }]
              }
 

    

    
    async function fetchInformation(){
        try{
            const information = await fetch('api/Admin/fetchInformation', {
                method: 'GET',
            })
            const info = await information.json(); 
            const t = summarizeTrades(info.trades);
 
            const u =summarizeUsers(info.users);
            const t2 = summarizeTrades2(info.trades);
            const t3 = summarizeTrades3(info.trades);
            setTrades3(t3);
            setTrades2(t2);
           setUsers(u);
           setTrades(t);
        }
        catch(error){
            console.error(error);
        }
    }

    function summarizeTrades(trades){
        const Trade_Counts ={};

        trades.forEach(trade=>{
            const coin = trade.Bought;
            if(Trade_Counts[coin]){
                Trade_Counts[coin]++;
            }
            else{
                Trade_Counts[coin]=1;
            }
        })

      return Trade_Counts;
    }

    function summarizeTrades2(trades){
        const arr2 ={};
    
        for(let i=0; i<trades.length; i++){
            
            let d = new Date(trades[i].createDate);
            if(arr2[d.getDate()]){
                arr2[d.getDate()]++;
            }
            else{
                arr2[d.getDate()]=1;
            }
        }

        return arr2
    }

    function summarizeTrades3(trades){
        const arr2 ={};
    
        for(let i=0; i<trades.length; i++){
            
            let d = new Date(trades[i].createDate);
            if(arr2[d.getDate()]){
                if(trades[i].Type=="Buy"){
                    arr2[d.getDate()]+= Math.floor(10* trades[i].AmountBought);
                }
                else{
                    arr2[d.getDate()]+= Math.floor(10* trades[i].AmountSold);
                }
            }
            else{
                if(trades[i].Type=="Buy"){
                    arr2[d.getDate()]= Math.floor(10* trades[i].AmountBought);
                }
                else{
                    arr2[d.getDate()]= Math.floor(10* trades[i].AmountSold);
                }
            }
        }
    
        return arr2;
    }
    function summarizeUsers(users){
   
    

        const arr1 = {};

        for(let i=0; i<users.length; i++){
            let d = new Date(users[i].createDate);
            if(arr1[d.getDate()]){
                arr1[d.getDate()]++;
            }
            else{
                arr1[d.getDate()]=1;
            }
        }
        return arr1;

        
    }

    
    const animations={
        initial:{
            x:"-100%"
        },
        animate:{
            x:"0%"
        },

        exit:{
            x:"-100%"
        }
    }
    return (
        <div className={styles.container}>
            <AnimatePresence>
                {onNav && (
                <motion.div className={styles.leftNav} variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:0.1}}>
                            <section className={styles.leftTitle}>AdminDash</section>
                            <div className={styles.profile}>
                                <Image 
                                    src={'/images/profilePic.png'}
                                    alt="profile"
                                    width={30}
                                    height={30}
                                />
                                <section>Hesham Ahmed</section>
                            </div>
                            <div className={styles.option} onClick={()=>{setOption("home")}}>
                                <Image 
                                    src={'/images/dashboard.png'}
                                    alt="profile"
                                    width={30}
                                    height={30}
                                />
                                      <section>Dashboard</section>
                            </div>

                            <div className={styles.option} onClick={()=>{setOption("tickets")}}>
                                <Image 
                                    src={'/images/tickets.png'}
                                    alt="profile"
                                    width={40}
                                    height={30}
                                />
                                <section>Tickets</section>
                            </div>

                            <div className={styles.option} onClick={()=>{setOption("chat")}}>
                                <Image 
                                    src={'/images/messageDash.png'}
                                    alt="profile"
                                    width={40}
                                    height={40}
                                />
                                <section>Chat Requests</section>
                            </div>

                            <div className={styles.option}>
                                <Image 
                                    src={'/images/analytic.png'}
                                    alt="profile"
                                    width={40}
                                    height={40}
                                />
                                <section>Analytics</section>
                            </div>

                            <div className={styles.option}>
                                <Image 
                                    src={'/images/feedback.png'}
                                    alt="profile"
                                    width={50}
                                    height={50}
                                />
                                <section>Feedback</section>
                            </div>

                            <div className={styles.option}>
                                <Image 
                                    src={'/images/postDash.png'}
                                    alt="profile"
                                    width={50}
                                    height={30}
                                />
                                <section>Manage Posts</section>
                            </div>

                            <div className={styles.option} onClick={()=>{setOption("cryptos")}}>
                                <Image 
                                    src={'/images/crypto.png'}
                                    alt="profile"
                                    width={40}
                                    height={40}
                                />
                                <section>Manage Cryptos</section>
                            </div>
                           
                </motion.div>
                )}
            </AnimatePresence>
            <div className={styles.body}>
                <nav className={styles.nav}>
                    <div className={styles.innerNav}>
                            <Image 
                                src={'/images/adminMenu.png'}
                                alt="burger"
                                width={30}
                                height={30}
                                onClick={()=>{setOnNav((onNav)=>{
                                    return !onNav;
                                });}}
                            />
                            <section className={styles.text}>Home</section>
                        </div>

                        <Image 
                                src={'/images/speech-bubble.png'}
                                alt="messages"
                                width={25}
                                height={25}
                            />
                </nav>
            {option=="home" && (
                <div className={styles.widgets}>
                <div className={styles.topWidget}>
                    <div className={styles.widget}>
                            <section className={styles.WidgetTitle}>Number of Users</section>
                            <ReactApexChart
                            options={lineOptions}
                            series={lineOptions.series}
                                type={lineOptions.chart.type}
                            height={250}
                            />
                    </div>
                    <div className={styles.widget}>
                    <section className={styles.WidgetTitle}>Most Traded Currencies</section>
                    
               
                        <ReactApexChart
                        options={options}
                        series={options.series}
                        type={"pie"}
                        height={250}
                        />

                 
                    </div>
                    <div className={styles.widget}>
                        <section className={styles.WidgetTitle}>Number of Trades</section>
                        <ReactApexChart
                            options={lineOptions2}
                            series={lineOptions2.series}
                                type={lineOptions2.chart.type}
                            height={250}
                            />
                    </div>
                </div>
                <div className={styles.middleWidget}>
                    <section className={styles.WidgetTitle}>Trade Fees</section>
                        <ReactApexChart
                            options={lineOptions3}
                            series={lineOptions3.series}
                            type={lineOptions3.chart.type}
                            height={300}
                            />
                </div>
                <div className={styles.BottomWidget}>
                        <div className={styles.bottomWidget}>
                             <section className={styles.WidgetTitle}>Tickets</section>
                        </div>
                        <div className={styles.bottomWidget}>
                            <section className={styles.WidgetTitle}>Posts</section>
                        </div>
                        <div className={styles.bottomWidget}>
                            <section className={styles.WidgetTitle}>Feedback</section>
                        </div>  
                </div>
            </div>
            )}

            {option=="chat" && (
                <LiveChat />
            )}

            {option=="tickets" && (
                <Support />
            )}
            {option=="cryptos" && (
                <Experienced  className={styles.manageCryptos}/>
            )}

            </div>
        </div>
    )
}