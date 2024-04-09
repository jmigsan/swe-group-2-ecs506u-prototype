import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from '@/styles/transactions.module.css'
import nextLeft from "@/public/images/nextLeft.png";
import nextRight from "@/public/images/nextRight.png";
import noNextLeft from "@/public/images/noNextLeft.png";
import noNextRight from "@/public/images/noNextRight.png";
import Image from "next/image";
export default function TransactionHistory(){

    const [transactions, setTransactions] =useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const {data: session} =useSession();
    useEffect(()=>{
        if(session){
        fetchTransactions();
        }
    }, [session])


    async function fetchTransactions() {
        const username=session.user.email;
        try{
            const transactions = await fetch('../api/Deposit/getTransactions', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username})
            })

            const res = await transactions.json();
            console.log(res);
            setTransactions(res);
        }
        catch{
            console.error(error);
        }
    }


    return (
        <div className={styles.transactionBody}>
            <div className={styles.transactionHeader}>
                    <section className={styles.col}>Type</section>
                    <section className={styles.col}>From</section>
                    <section className={styles.col}>To</section>
                    <section className={styles.col}>Price</section>
                    <section className={styles.col}>Date</section>
            </div>

            {transactions.slice(10*(pageNumber-1), 10*pageNumber).map((transaction, index)=>{
                return(
                    <div className={styles.transaction}>
                        {transaction.Type=="Sell" ?(
                        <section className={styles.red}>{transaction.Type} </section>
                        ) :(
                            <section className={styles.green}>{transaction.Type} </section>
                        )}
                        <section className={styles.colT}>{transaction.AmountSold} {transaction.Sold}</section>
                        <section className={styles.colT}>{transaction.AmountBought} {transaction.Bought}</section>
                        <section className={styles.colT}>{transaction.Price}</section>
                        <section className={styles.colT}>{transaction.createDate}</section>
                    </div>
                )
            })}

        <section className={styles.nextPage}>
                {pageNumber!=1 ? (
                <Image 
                    src={nextLeft}
                    width={10}
                    height={10}
                    alt="left"
                    className={styles.arrow}
                    onClick={()=>{setPageNumber((pageNumber)=>{return pageNumber-1;});}}
                />
                ): (
                    <Image 
                    src={noNextLeft}
                    width={10}
                    height={10}
                    alt="left"
                />
                )
                }
            
            <div className={styles.pageNumbers}>

   
                <button className={styles.pageNumber} onClick={() => setPageNumber(1)}>1</button>
              
 
                {pageNumber > 4 && <span>...</span>}
          
                {pageNumber-2>=1 && (
                    <>
                      {Array.from({ length: Math.min(2, pageNumber-2) }).map((_, index) => (
                        <button key={index} className={styles.pageNumber} onClick={() => setPageNumber(pageNumber-2+index)}>{Math.max(2,pageNumber-2+index)}</button>
                      ))}
                    </>
                )}

                {(pageNumber!=1 && pageNumber!= Math.ceil(transactions.length/10))  && (<button className={styles.pageNumber}>{pageNumber}</button>)}
                
                {pageNumber+2<=Math.ceil(transactions.length/10) && (
                    <>
                      {Array.from({ length: Math.min(2, Math.ceil(transactions.length/10)-pageNumber-1) }).map((_, index) => (
                        <button key={index} className={styles.pageNumber} onClick={() => setPageNumber(pageNumber+index+1)}>{pageNumber+index+1}</button>
                      ))}
                    </>
                )}
                {pageNumber+3<Math.ceil(transactions.length/10)  && <span>...</span>}

             
                {transactions.length>10 && (<button  className={styles.pageNumber} onClick={() => setPageNumber(Math.ceil(transactions.length/10) )}>{Math.ceil(transactions.length/10) }</button>)}
                
        </div>

            {pageNumber!=Math.ceil(transactions.length/10) && transactions.length>30 ? (
                    <Image 
                        src={nextRight}
                        width={10}
                        height={10}
                        alt="right"
                        className={styles.arrow}
                        onClick={()=>{setPageNumber((pageNumber)=>{return pageNumber+1;});}}
                    />
                ):
                (
                    <Image 
                        src={noNextRight}
                        width={10}
                        height={10}
                        alt="right"
                    />
                )
                }  
            </section>
        </div>
    )
}