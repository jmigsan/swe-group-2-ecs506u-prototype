
import Image from 'next/image';
import Logo from '@/public/images/crypto-logo.png'
import Menu from '@/public/images/menu.png'
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react'
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
import { useRouter } from 'next/router';
import { ModeContext } from '@/pages/_app';
export default function NavBar(){
    const {data: session} = useSession();
    const router = useRouter();
    const [onBurger, setOnBurger] = useState(false);
    const [onLite, setOnLite] = useState(true);
    const animations = {
    initial: {opacity:0},
    animate: {opacity:1},
    exit: {opacity:0},
  };
  const {mode, setMode} = useContext(ModeContext);
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
    if(session?.user.role=="Staff"){
        router.replace("/dashBoard")
    }
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/transfer")}}>Transfer</section>
                                                <section className={styles.subHeading}>Send and Recieve Crypto with NovaTrade users</section>
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
                                    <Link className={styles.link} href="/feed/feed">Feed</Link>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/feed/feed")}}>View your Feed</section>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/feed/feed")}}>Create Post</section>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/feed/feed")}}>Search Friends</section>
                                                <section className={styles.subHeading}>Search for a friend</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/Support/support">Support</Link>
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
                                                <section onClick={()=>{router.replace("/Support/support")}} className={styles.boldText}>Ticket</section>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/LiveChat/livechat")}}>Chat</section>
                                                <section className={styles.subHeading}>Chat with a member of our support team</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                    <Link className={styles.link} href="/Solutions/api">Solutions</Link>
                                    <motion.div variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}} className={styles.toggleMenu}>
                                        <section className={styles.menuOption}>
                                            <figure className={styles.Icon}>
                                                <Image
                                                    src={'/images/solution.png'}
                                                    width={60}
                                                    height={60}
                                                    alt="Logo"
                                                    className={styles.Icon}
                                                />
                                                </figure>
                                                <section className={styles.rightOption}>
                                                <section onClick={()=>{router.replace("/Solutions/api")}} className={styles.boldText}>API</section>
                                                <section className={styles.subHeading}>Integrate NovaTrade API into your system</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            <div className={styles.dropDown}>
                                <section className={styles.link} >Portfolio</section>
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
                                                <section className={styles.boldText} onClick={()=>{router.replace("/portfolio/portfolio")}}>View Portfolio</section>
                                                <section className={styles.subHeading}>View your current assets</section>
                                                </section>
                                        </section>
                                    </motion.div>
                            </div>
                            </>
                        ): (
                            <>
                                <Link className={styles.link} href="/ExperiencedTrading/experienced">Cryptocurrencies</Link>
                            </>
                        )}

                </section>

            </div>

                <section className={styles.loginLinks}>
                        {session?.user?.email? (
                            <>
                                {onLite ? (
                                    <section className={styles.lite}>Lite</section>
                                ):(
                                    <section className={styles.lite}>Pro</section>
                                )
                                }
                                <label class={styles.switch}>
                                    <input type="checkbox" onClick={()=>{setOnLite((onLite)=>{return !onLite}); setMode((mode)=>{
                                        if(mode=="Pro"){
                                            return "Lite";
                                        }
                                        else{
                                            return "Pro";
                                        }
                                    })}}/>
                                    <span class={styles.slider}></span>
                                    </label>
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