"use client";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from 'react';
import LiteTrade from '@/public/images/LiteTrader.png';
import ProTrade from '@/public/images/ProTrader.png';
import MessageFeed from '@/public/images/WebFeed.png';
import {motion, useAnimation} from "framer-motion";
import Image from 'next/image';
import styles from "@/styles/options.module.css";
import AOS from "aos";
import "aos/dist/aos.css";
export default function Options(){
    
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);

    const [options, setOptions] = useState([true, false, false, false, false]);
    function toggleImage(index){
        const tempOptions =options.slice();
        for(let i = 0; i <tempOptions.length; i++){
          if(i==index){
            tempOptions[i]=true;
          }
          else{
            tempOptions[i]=false;
          }
        }
      
        setOptions(tempOptions);
       
      }
      
      
      function toggleOption(index){
        const buttons = document.querySelectorAll("[id='option']");
        for(let i = 0; i<buttons.length; i++){
          if(i===index){
            buttons[i].style.border="1pt solid black";
          }
          else{
            buttons[i].style.border="none";
          }
        }
      }

      const animations4 = {
        hidden2: {opacity:0, y:10},
        visible:{
          opacity:1,
          y:0,
          transition:{
            staggerChildren: 0.3,
          },
        },
      };

      const animations3 = {
        initial: {opacity:0},
        animate: {opacity:1},
      };
    
      const controls2 = useAnimation();
      const [ref, inView] = useInView();
      
      useEffect(() => {
          if (inView) {
            controls2.start("visible");
          }
          
        }, [inView]);


      return (
        <div className={styles.optionsSection}>
        <div className={styles.options}>
            <button data-aos="fade-up"  className={styles.option} onClick={()=>{toggleOption(0); toggleImage(0);}} id="option">Pro Trader</button>
            <button data-aos="fade-up"  className={styles.option} onClick={()=>{toggleOption(1); toggleImage(1);}} id="option">Lite Trader</button>
            <button data-aos="fade-up"  className={styles.option} onClick={()=>{toggleOption(2); toggleImage(2);}} id="option">Message Feed</button>
            <button data-aos="fade-up"  className={styles.option} onClick={()=>{toggleOption(3);}} id="option">Cryptocurrencies</button>
            <button data-aos="fade-up"  className={styles.option} onClick={()=>{toggleOption(4);}} id="option">Education</button>
        </div>

        {options[1] &&(
          <motion.div variants={animations3} initial="initial" animate="animate" transition={{duration:1}}>
            <Image 
              src={LiteTrade}
              alt="lite-trading-page"
              className={styles.image}
            />
          </motion.div>
        )
        }

        {options[0] &&(
          <motion.div variants={animations3} initial="initial" animate="animate" transition={{duration:1}}>
            <Image 
              src={ProTrade}
              alt="pro-trading-page"
              className={styles.image}
            />
          </motion.div>
        )
        }

        {options[2] &&(
          <motion.div variants={animations3} initial="initial" animate="animate" transition={{duration:1}}>
            <Image 
              src={MessageFeed}
              alt="message-feed"
              className={styles.image}
            />
          </motion.div>
        )
        } 
      </div>
      )
}