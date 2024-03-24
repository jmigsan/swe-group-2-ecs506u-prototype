import styles from '@/styles/forgotPassword.module.css'
import Image from 'next/image'
import { useState } from 'react'
import {motion} from 'framer-motion'
import Logo from '@/public/images/crypto-logo.png'
import { useRouter } from 'next/router'
export default function ForgotPassword(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [onUsername, setOnUsername] = useState(true);
    const [onVerification, setOnVerification] = useState(false);
    const [onPassword, setOnPassword] = useState(false);
    const [verificationCode, setCode] = useState("");
    const [error, setError] = useState("");
    const animations = {
        initial: {x:100},
        animate: {x:0},
        exit: {x:-50},
      };

    async function sendCode(){
        const to = document.getElementById("username").value;
        setUsername(to);
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

            if(!res.ok){
                console.log("here3")
                setError("User not found");
                return false;
            }
            else{
                setError("");
                return true;
            }

        }

        catch(error){
                setError("error occurred");
                return false;
        }


      
    }

    function verifyCode(){
        const inputted_code = document.querySelectorAll("#verificationNum");
        const correct_code = verificationCode.toString();
        for(let i=0; i<3; i++){
            if(inputted_code[i].value.toString()!=correct_code[i]){
                return
            }
        }
        setOnVerification(false);
        setOnPassword(true);
        
    }

    async function resetPassword(){ 
        const initial_password =document.getElementById("password").value;
        const confirmedpassword = document.getElementById("confirmedpassword").value;

        if(initial_password==confirmedpassword){
            const res= await fetch('api/resetPassword/reset', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({username, initial_password}),
            })

            if(res.ok){
                router.replace('/login')
            }

            else{
                setError("Error occurred");
            }
        }

        else{
            setError("Passwords do not match")
        }
    }

    return(
        <div className={styles.body}>
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
            {onUsername && (
             
             <section className={styles.header}>
                Recover your account 
                </section>
 
            )}

            {onVerification && (
                    <section className={styles.header}>
                        Verify your Identity
                    </section>
                )
            }

            {onPassword && (
                    <section className={styles.header}>
                        Reset password
                    </section>
                )
            }
            {onUsername && (
             
                    <section className={styles.subheader}>
                        Enter your username 
                    </section>
        
                )}




            {onVerification && (
                    <section className={styles.subheader}>
                        A code has been sent to this email if there a valid account with it
                    </section>
                )

            }
           

            <form className={styles.form}>
                {onUsername && (
                    <motion.input id="username" variants={animations} initial="initial" animate="animate"  type="text" placeholder="Username" className={styles.username} transition={{duration:1, ease: "easeOut"}} ></motion.input>
                )}
                
                { onVerification && (
                    <div className={styles.verificationCode}>
                        <input type="text" id="verificationNum" className={styles.verificationNum}/>
                        <input type="text" id="verificationNum" className={styles.verificationNum}/>
                        <input type="text" id="verificationNum" className={styles.verificationNum}/>
    
                    </div>
                )
                    
                }

                {onPassword && (
                    <div className={styles.resetPassword}>
                        <input type="password" id="password"  placeholder='New password' className={styles.password}/>
                        <input type="password" id="confirmedpassword"  placeholder='Confirm password' className={styles.password}/>
                    </div>
                )

                }
            </form>

            {error && (
                <section className={styles.error}>{error}</section>
            )}

    
            {onUsername && (
                <div className={styles.buttons}>
                    <button type="button" className={styles.greyButton} onClick={()=>{router.replace("/login")}}>Cancel</button>
                    <button type="button" className={styles.button} onClick={async()=>{ if(await sendCode()){ setOnUsername(false); setOnVerification(true);}}}>Next</button>
                </div>
            )
            }

            {onVerification  && (
                <div className={styles.buttons}>
                    <button type="button" className={styles.greyButton} onClick={()=>{setOnVerification(false); setOnUsername(true);}}>Back</button>
                    <button type="button" className={styles.button} onClick={()=>{verifyCode();}}>Check</button>
                </div>
            )
            }

            {onPassword && (
                <div className={styles.buttons}>
                    <button type="button" className={styles.dummyButton}></button>
                    <button type="button" className={styles.button} onClick={()=>{resetPassword();}}>Reset</button>
            </div>
            )}
            </div>
        </div>
    )
}