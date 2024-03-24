"use client";
import {motion} from 'framer-motion'
import { useState } from 'react'
import styles from '@/styles/login.module.css'
import Logo from '@/public/images/crypto-logo.png'
import Image from 'next/image'
import {signIn} from "next-auth/react"
import { useRouter } from 'next/router'
import Link from 'next/link';
export default function Login(){
    const router = useRouter();
    const [onUsername, setOnUsername] = useState(true);
    const [onPassword, setOnPassword] = useState(false);
    const [username, setUsername]= useState("");
    const [error, setError]= useState("");
    const [onAnimation, setOnAnimation] = useState(false);

    const animations = {
        initial: {x:100},
        animate: {x:0},
        exit: {x:-50},
      };

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
    function togglePassword(){
        setOnUsername(false);
        setOnPassword(true);
    }

    function toggleUsername(){
        setOnPassword(false);
        setOnUsername(true);
    }

    async function loginUser(){
        const password = document.getElementById("password").value;

        try{
            const res = await signIn(
                "credentials", 
                {
                    username, 
                    password,
                    redirect:false,
                }
            )

            
            if(res.error){
                setError("Invalid Credentials")
                return
            }

            else{
                setOnPassword(false);
                setOnAnimation(true);
                setTimeout(()=>{ router.replace("/")}, 1000)
            }
        }

        catch(error){
            setError("Error Occurred")
        }
        
    }

    const updateUsername= (e) =>{
        setUsername(e.target.value);
    }

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {!onAnimation && (
                <>
                    <section className={styles.heading}>
                        <figure className={styles.logo}>
                        <Image
                            src={Logo}
                            width={50}
                            height={25}
                            alt="Logo"
                            className={styles.logo}
                            />
                        </figure>
                        <section>NovaTrade</section>
                    </section>

                    <section className={styles.subTitle}>
                        <section className={styles.signIn}>Sign In</section>
                        <section className={styles.subheading}>to continue to NovaTrade</section>
                    </section>

                    <form className={styles.form} onSubmit={(e)=>{e.preventDefault();}}>
                    {onUsername && (
                
                        <div>
                            <motion.input type="text" onChange={updateUsername} value ={username} placeholder="Enter Username" variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:1, ease: "easeOut"}} className={styles.username}></motion.input>
                        </div>
                        )}
                    {onPassword && (
                        <div>
                            <motion.input type="password" placeholder="Enter Password" className={styles.username} variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:1, ease: "easeOut"}} id="password"></motion.input>
                        </div>
                    )}
                    </form>
                    {onUsername && (
                        <div className={styles.buttons}>
                            <button type="button" className={styles.buttonDummy}></button>
                            <button type="button" className={styles.button} onClick={()=>{togglePassword();}}>Next</button>
                        </div>
                        
                    )}

                    {onPassword && (
                        <div className={styles.buttons}>
                            <button type="button" className={styles.button2} onClick={()=>{toggleUsername();}}>Back</button>
                            <button type="button" className={styles.button} onClick={()=>{loginUser();}}>Sign In</button>
                        </div>
                    
                    )}

                    {error &&(
                        <div className={styles.error}>
                            <section className={styles.errormessage}>
                            {error}
                            </section>
                            
                        </div>
                    )}

                    <div className={styles.noAccount}>
                        No account? <Link href="/signUp" className={styles.registerLink}>Create One!</Link>
                    </div>

                    <div className={styles.forgotPassword}>
                        <Link href="/forgotPassword" className={styles.forgotLink}>Forgot your password?</Link>
                    </div>
                </>
                )}

                  {onAnimation &&(
                    <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation}>
                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                        <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                    </motion.div>
       
                )}
        
            </div>
        </div>
    )
}