'use client';
import styles from '@/styles/home.module.css';
import feed from '@/public/images/feed.png'
import { useRouter } from 'next/router';
import { useInView } from "react-intersection-observer";
import {motion, useAnimation} from "framer-motion";
import { useEffect, useState } from 'react';
import Options from "./options";
import Image from 'next/image';
import AOS from "aos";
import "aos/dist/aos.css";
export default function Home(){
  
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const router = useRouter();

  const animations = {
    initial: {y:50},
    animate: {y:0},
    exit: {y:-50},
  };

  const animations2 = {
    hidden: {x:100},
    visible: {x:0},

  };

 
const controls = useAnimation();
const [ref, inView] = useInView();

useEffect(() => {
    if (inView) {
      controls.start("visible");
    }

    else{
      controls.start("hidden");
    }
  }, [inView]);




  return (
    <div className={styles.home}>
      <motion.div variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:1.5, ease: "easeOut"}} className={styles.container}>
        <section className={styles.title}>
          Trade, Socialize, Explore
        </section>
        <section className={styles.title2}> with NovaTrade</section>
        <section className={styles.body}>
          NovaTrade is an innovative crypto currency exchange platform which brings together social media and trading
          into one center. Here you can trade and socialize with your friends using our integrated post feed. Take a trade, share
          it with your friends, and see what they are doing as well! Whether you are an experienced trader in the market or a beginner
          looking to learn, NovaTrade ensures that you are well taken care of.
        </section>
      </motion.div>

      <div className={styles.phoneBackground}>
        <section className={styles.section2}>
          <section className={styles.section2Title}>
              Meet NovaTrade!
          </section>
          <section className={styles.section2Body}>
            See what your friends are trading and post your own trades as well!
          </section>
          <section className={styles.section2footer}>
            Open an account and start trading today
          </section>
          <button className={styles.getStarted} onClick={()=>{
            router.replace("/signUp")
          }}>Get started</button>
        </section>

         <motion.section  ref= {ref} variants={animations2} initial="hidden" animate={controls} transition={{duration:1, ease: "easeOut"}}>
          <figure data-aos="flip-down"  data-aos-duration="2000">
            <Image
            src={feed}
            alt="Picture of Iphone"
            className={styles.post}
            />
          </figure>
         </motion.section>
      </div>

      <Options controls={controls}/>
      

    </div>
  )
}