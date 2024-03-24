"use client";
import Image from 'next/image';
import Logo from '@/public/images/crypto-logo.png'
import Menu from '@/public/images/menu.png'
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link';
import { useState, useEffect } from 'react'
import {motion} from 'framer-motion'
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import walletIcon from '@/public/images/wallet.png'
export default function NavBar(){
    const {data: session} = useSession();
    const [cryptoHover, setCryptoHover] = useState(false);

    const animations = {
    initial: {opacity:0},
    animate: {opacity:1},
    exit: {opacity:0},
  };

  const animations2={
    initial: {
        opacity:0,
        y:-100,
    },

    animate:{
        opacity:1,
        y:0
    }
  }

  
 
  async function handleLogOut(){
    try{
        await signOut({
            redirect:false,
        }
        )
    }

    catch(error){
        console.error(error)
    }
  }



    return (
        <div>
            <div className={styles.nav}>
                <motion.div variants={animations2} initial="initial" animate="animate" transition={{duration: 0.5, ease:"easeInOut"}} className={styles.navbar}>
                    <div className={styles.leftNav}>
                    <header className={styles.heading}>
                        <Link href="/">
                            <figure className={styles.logo}>
                                <Image
                                    src={Logo}
                                    width={50}
                                    height={25}
                                    alt="Logo"
                                />
                            </figure>
                        </Link>
                        
                        <section className={styles.title}>
                            NovaTrade
                        </section>
                    </header>

                    <section className={styles.links}>
                            {session?.user?.email? (
                                <>
                                <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/viewCryptos">Buy Crypto</Link>
                                        <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.toggleMenu}>
                                            <section className={styles.menuOption}>
                                                <figure className={styles.Icon}>
                                                    <Image 
                                                        src={walletIcon}
                                                        width={40}
                                                        height={30}
                                                        alt="Logo"
                                                        className={styles.Icon}
                                                    />
                                                    </figure>
                                                    <section className={styles.rightOption}>
                                                    <section className={styles.boldText}>Buy Crypto via Deposit</section>
                                                    <section className={styles.subHeading}>Use balance to buy crypto</section>
                                                    </section>
                                                    </section>
                                        </motion.div>
                                </div>
                                <Link className={styles.link} href="/viewCryptos">Trade</Link>
                                <Link className={styles.link} href="/feed">Feed</Link>
                                <Link className={styles.link} href="/support">Support</Link>
                                </>
                            ): (
                                <>
                                    <Link className={styles.link} href="/viewCryptos">Cryptocurrencies</Link>
                                </>
                            )}
                    
                    </section>
            
                </div>

                    <section className={styles.loginLinks}>
                            {session?.user?.email? (
                                <>
                                    <button className={styles.button}onClick={()=>{handleLogOut();}}>Log Out</button>
                                </>
                            ): (
                                <>
                                    <Link className={styles.button} href="/login">Log In</Link>
                                    <Link className={styles.button} href="/signUp">Sign Up</Link>
                                </>
                            )}
                    
                    </section>
                </motion.div>
            </div>

        </div>
    )
}