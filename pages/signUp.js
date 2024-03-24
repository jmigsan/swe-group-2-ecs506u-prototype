'use client';

import Logo from '@/public/images/crypto-logo.png'
import Image from 'next/image'
import styles from '@/styles/signup.module.css'
import {useState} from 'react'
import Link from 'next/link';

export default function SignUp(){

    const[name, setName]= useState("");
    const[email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [error, setError]= useState("");
    const [success, setSuccess]= useState("");

    async function handleSubmit(){
        
        const name= document.getElementById("name").value;
        const email= document.getElementById("email").value;
        const password= document.getElementById("password").value;
        setName(name);
        setEmail(email);
        setPassword(password);
        if(!name || !email || !password){
            setError("Missing fields");
            setSuccess("")
            return;
        }
        else{
            setError("");
        }

        const userExists = await checkUserExists(email);
        if(userExists){
            try{
                const res = await fetch('api/register/signup' , {
                    method: "POST",
                    headers:{
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name, email, password}),
                });

                if(res.ok){
                    setSuccess("Successfully registered")
                }
                else{
                    setError("Error Occurred");
                }
            }
            
            catch{
                console.log("error");
            }
        }

        else{
            setError("User Exists")
        }
        
        document.getElementById("form").reset();
    }

    async function checkUserExists(email){
        
        try{
            const res = await fetch('api/userExists/checkuser', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({email}),
            })

            if(res.ok){
               
                return true;
            }
            else{
                
                return false;
            }
        }
        catch(error){

            setError("Error occurred")
            return false;
        }
    }
        return (
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
                <form className={styles.form} id="form">
                    <input type="text" className={styles.input}  id="name" placeholder='Enter first name'/>
                    <input type="text" className={styles.input} id="email" placeholder='Enter your email address'/>
                    <input type="password" className={styles.input} id= "password" placeholder='Enter your password'/>
                </form>

                <button type="button" onClick={()=>{handleSubmit()}} className={styles.button}>Create</button>

                {error &&(
                    <div className={styles.error}>
                        <section className={styles.errormessage}>
                        {error}
                        </section>
                        
                    </div>
                )}

                {success &&(
                    <div className={styles.success}>
                         <section className={styles.errormessage}>
                            {success}
                        </section>
                    </div>
                )}

                <section className={styles.footer}>
                    <section className={styles.footerheading}>
                        Already have an account?
                    </section>
                    <section>
                        <Link href="login" className={styles.footerlink}>Login</Link>
                    </section>
                </section>
                
            </div>
           
        </div>
    )
}