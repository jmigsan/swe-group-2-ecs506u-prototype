"use client";
import {motion} from 'framer-motion'
import { useState } from 'react'
import styles from '@/styles/login.module.css'
import Logo from '@/public/images/crypto-logo.png'
import Image from 'next/image'
import {signIn} from "next-auth/react"
import { useRouter } from 'next/router'
import Link from 'next/link';
import email from '@/public/images/email.png'
import authenticator from '@/public/images/authenticator.png'
import arrow from '@/public/images/authArrow.png'
import close from '@/public/images/close.png'
import { signOut } from 'next-auth/react';
export default function Login(){
    const router = useRouter();
    const [onUsername, setOnUsername] = useState(true);
    const [onPassword, setOnPassword] = useState(false);
    const [username, setUsername]= useState("");
    const [error, setError]= useState("");
    const [on2FA, setOn2FA] = useState(false);
    const [password, setPassword] = useState("");
    const [verificationCode, setCode] = useState("");
    const [onVerification, setOnVerification] = useState(false);
    const [inputted_code, setInputtedCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const animations = {
        initial: {x:100},
        animate: {x:0},
        exit: {x:-50},
      };

    const twoFAanimations ={
        initial:{
            opacity:0,
        },
        animate:{
            opacity:100,
        }
    }
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
    async function togglePassword(){

        
        document.getElementById("text").style.display="none";
        document.getElementById("loading").style.display="flex";
       
            setTimeout(async () => {
                try{

                const res = await fetch('api/Login/checkUsername', {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify({username})

                })

                document.getElementById("text").style.display="inline";
                document.getElementById("loading").style.display="none";

                if(!res.ok){
                    setError("Invalid username")
                    return
                }
                else{
                    setError("");
                }

            }

            catch(error){
                setError("error occurred");
            }
            setOnUsername(false);
            setOnPassword(true);
        }, 1000);
    }

    function toggleUsername(){
        setOnPassword(false);
        setOnUsername(true);
    }

    async function sendCode(){
        setOnVerification(true);
        const to = username;
        const code = Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();
        setCode(code);

        try{
            const res = await fetch('api/resetPassword/sendCode' , {
                method: "POST",
                headers:{
                "Content-Type": "application/json"
                },
                body: JSON.stringify({to, code}),
            });

            
        }

        catch(error){
                setError("error occurred");
                return false;
        }


    }
    
    async function loginUser(){
        document.getElementById("text2").style.display="none";
        document.getElementById("loading2").style.display="flex";
        const password = document.getElementById("password").value;
        setPassword(password);
       setTimeout(async () =>{ try{
            const res = await fetch('api/Login/checkPassword' , {
                method: "POST",
                headers:{
                "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password}),
            });

            document.getElementById("text2").style.display="inline";
            document.getElementById("loading2").style.display="none";
            if(res.status === 404){
                setError("Invalid Credentials")
                return
            }

            else{
                setError("");
                document.getElementById("2FA").style.display="block";
                setOn2FA(true);
            }
        }

        catch(error){
            setError("Error Occurred")
        }
       }, 1000);
        
    }

    const updateUsername= (e) =>{
        setUsername(e.target.value);
    }

    const handleCodeChange= (e) =>{
        setInputtedCode(e.target.value);
    }

    async function checkCode(){
        if(inputted_code==verificationCode){
            const res = await signIn(
                "credentials", 
                {
                    username, 
                    password,
                    redirect:false,
                }
            )
            if(res.ok){
                router.replace("/")
            }
        }
        else{
            setCodeError("Invalid Code");
        }
    }

    async function handleClose(){
        setCodeError("");
        document.getElementById("2FA").style.display="none";
        setOnVerification(false);
        setOn2FA(false);
    }

    return (
        
        <div className={styles.body}>
            <div className={styles.twoFactor} id="2FA">
                {on2FA && (
                    <>
                            <motion.div className={styles.twoFactorForm} variants={twoFAanimations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                {!onVerification && (
                                    <form className={styles.verificationForm}>
                                        <section className={styles.verificationTop}>
                                            <section className={styles.verificationHeader}>
                                                <section className={styles.verificationTitle}>Security Verification</section>
                                                <section className={styles.verificationSubTitle}>Choose one of the following options to continue</section>
                                            </section>
                                            <figure className={styles.close} onClick={()=>{handleClose();}}>
                                                <Image
                                                    src={close}
                                                    width={20}
                                                    height={20}
                                                    alt="close"
                                                    className={styles.logo}
                                                />
                                            </figure>
                                        </section>
                                        <section className={styles.options}>
                                        <section className={styles.verificationOption} onClick={()=>{sendCode();}}>
                                            <section className={styles.verificationOptionTitle}>
                                                <figure>
                                                    <Image 
                                                        src={email}
                                                        alt="email"
                                                        width={30}
                                                        height={30}
                                                        className={styles.logo}
                                                    />
                                                </figure>
                                                <section className={styles.verificationOptionText}>Email</section>
                                            </section>

                                            <figure>
                                                <Image 
                                                    src={arrow}
                                                    alt="next"
                                                    width={30}
                                                    height={20}
                                                    className={styles.logo}
                                                />
                                            </figure>
                                        </section>

                                        <section className={styles.verificationOption}>
                                            <section className={styles.verificationOptionTitle}>
                                                <figure>
                                                    <Image 
                                                        src={authenticator}
                                                        alt="authenticator"
                                                        width={30}
                                                        height={30}
                                                        className={styles.logo}
                                                    />
                                                </figure>
                                                <section className={styles.verificationOptionText}>Authenticator App</section>
                                            </section>

                                            <figure>
                                                <Image 
                                                    src={arrow}
                                                    alt="next"
                                                    width={30}
                                                    height={20}
                                                    className={styles.logo}
                                                />
                                            </figure>
                                        </section>
                                        </section>
                                    </form>
                                    )}
                                {onVerification && (
                                    <motion.div className={styles.emailVerification} variants={animations} initial="initial" animate="animate" transition={{duration:0.4, ease:"easeInOut"}}>
                                            <form className={styles.emailForm}>
                                                <section className={styles.emailTop}>
                                                    <section className={styles.verificationTitle}>Security Verification</section>
                                                    <figure className={styles.close} onClick={()=>{handleClose();}}>
                                                        <Image
                                                            src={close}
                                                            alt="logo"
                                                            width={20}
                                                            height={20}
                                                            className={styles.logo}
                                                        />
                                                    </figure>
                                                </section>
                                                    <section className={styles.middlePart}>
                                                        <article className={styles.verificationSubTitle}>Email verification code</article>
                                                        <input type="text" onChange={handleCodeChange} className={styles.codeInput}/>
                                                        <article className={styles.verificationSubTitle}>Enter the 3-digit code sent to your email</article>
                                                    
                                                    </section>
                                                    {codeError && (
                                                            <section className={styles.codeError}>{codeError}</section>
                                                        )}
                                                <button type ="button" className={styles.codeButton} onClick={()=>{checkCode();}} id="codeButton">Submit</button>
                                            </form>
                                    </motion.div>
                                )}
                            </motion.div>
                    </>
                )}
            </div>
            <div className={styles.container}>
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
                            <button type="button" className={styles.button} onClick={()=>{togglePassword();}}>
                                <section className={styles.buttonText} id="text">Next</section>
                                <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading">
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                    <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                </motion.div>
                            </button>
                        </div>
                        
                    )}

                    {onPassword && (
                    
                    <div className={styles.buttons}>
                        <button type="button" className={styles.button2} onClick={()=>{toggleUsername();}}>Back</button>
                        <button type="button" className={styles.button} onClick={()=>{loginUser();}}>
                            <section className={styles.buttonText} id="text2">Sign In</section>
                            <motion.div variants={animations2} initial="start" animate="end" className={styles.loadingAnimation} id="loading2">
                                <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                                <motion.span variants={animations3} className={styles.dot} transition={{duration:0.4, repeatType: "mirror", repeat: Infinity,}}></motion.span>
                            </motion.div>
                        </button>
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
           
            </div>
        </div>
        
    )
}