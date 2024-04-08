import React from 'react';
import styles from '@/styles/support.module.css';
import { motion } from 'framer-motion';
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const TicketView = ({ issueType,issueDescription, dateCreated, comment, onClose }) => {
    function showComment(){
        console.log("Comment is -", comment, "-")
        if(comment === "" || comment === null){
            return "No Comments yet..."
        }else{
            return comment;
        }
    }
    const modalVariants = {
        hidden: {
            opacity: 0,
            y: -50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -50,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    return (

    <>

        <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.modalBackground}
        >
            <div className={styles.modalContent}>
                {/*<div className={styles.modalHeader}>*/}
                {/*    <button className={styles.closeButton} onClick={onClose}>*/}
                {/*        <img className={styles.ticketButtonImage}*/}
                {/*             src="/images/close.png"*/}
                {/*             alt="Add Ticket"/>*/}
                {/*    </button>*/}
                {/*</div>*/}

                <div className={styles.header}>
                    <h2 className={styles.title}>Ticket Details</h2>
                    <p className={styles.date}>Created: {formatDate(dateCreated)}</p>
                    <button className={styles.closeButton} onClick={onClose}>
                        <img className={styles.ticketButtonImage}
                             src="/images/close.png"
                             alt="Add Ticket"/>
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.issueTypeWrapper}>
                        <p className={styles.issueType}>{issueType}</p>
                    </div>
                    <div className={styles.issueDescriptionWrapper}>
                        <p className={styles.issueDescriptionLabel}>Description:</p>
                        <p className={styles.issueDescription}>{issueDescription}</p>
                    </div>
                    <div className={styles.commentWrapper}>
                        <p className={styles.commentLabel}>Comment:</p>
                        <p className={styles.comment}>{showComment(comment)}</p>
                    </div>
                </div>


            </div>
        </motion.div>
    </>
    );
};

export default TicketView;