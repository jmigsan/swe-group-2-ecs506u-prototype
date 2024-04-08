
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
import chat from '@/public/images/chat.png'
import convert from '@/public/images/convert.png'
import create from '@/public/images/create.png'
import bot from '@/public/images/bot.png'
import posts from '@/public/images/posts.png'
import searchFriends from '@/public/images/searchFriends.png'
import trade from '@/public/images/trade.png'
import ticket from '@/public/images/ticket.png'
import { useRouter } from 'next/router'
export default function NavBar(){
    const {data: session} = useSession();
    const router = useRouter();
    const [onBurger, setOnBurger] = useState(false);
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

  useEffect(()=>{
    console.log(session);
  }, [session])
 
  async function handleLogOut(){
    try{
        await signOut({
            redirect:false,
        }
        )

        router.replace("/");
    }

    catch(error){
        console.error(error)
    }
  }

    return (
        <>{(!(session?.user.role=="Staff")) && (
            
        <div>
        <div className={styles.nav} id="nav">
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
                                <section className={styles.link} >Buy Crypto</section>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/Deposit/DepositWrapper")}}>Buy Crypto via Deposit</section>
                                                <section className={styles.subHeading}>Use balance to buy crypto</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/viewCryptos">Trade</Link>
                                    <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.toggleMenu}>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={convert}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>Convert Crypto</section>
                                                <section className={styles.subHeading}>Convert Crypto to other Crypto's</section>
                                                </section>
                                        </section>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={trade}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText} onClick={()=>{router.replace("/ExperiencedTrading/experienced")}}>Trade on Charts</section>
                                                <section className={styles.subHeading}>View live price action as you trade</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/feed">Feed</Link>
                                    <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.toggleMenu}>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={posts}
                                                    width={45}
                                                    height={45}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>View your Feed</section>
                                                <section className={styles.subHeading}>See your friends and following's posts</section>
                                                </section>
                                        </section>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={create}
                                                    width={45}
                                                    height={45}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>Create Post</section>
                                                <section className={styles.subHeading}>Make your own post to share</section>
                                                </section>
                                        </section>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={searchFriends}
                                                    width={45}
                                                    height={45}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>Search Friends</section>
                                                <section className={styles.subHeading}>Search for a friend</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/support">Support</Link>
                                    <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.toggleMenu}>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={ticket}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>Ticket</section>
                                                <section className={styles.subHeading}>See your ongoing tickets and open a new one if needed</section>
                                                </section>
                                        </section>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={chat}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section className={styles.boldText}>Chat</section>
                                                <section className={styles.subHeading}>Chat with a member of our support team</section>
                                                </section>
                                        </section>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image 
                                                    src={bot}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                            </figure>
                                                <section className={styles.rightOption}>
                                                    <section className={styles.boldText}>Assistant</section>
                                                    <section className={styles.subHeading}>Chat with our built in Chatbot</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            
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
            <section className={styles.burgerMenu}>
                <Image 
                    src={'/images/burger-menu.png'}
                    alt="burger"
                    width={30}
                    height={30}
                    onClick={()=>{setOnBurger(true);}}
                />
            </section>
            </motion.div> 
        </div>
    </div>
        )}</>
       
    )
}