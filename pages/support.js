import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/support.module.css';
import Link from 'next/link';

export default function Support() {
    const [viewingTickets, setViewingTickets] = useState(false);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [talkingToSupport, setTalkingToSupport] = useState(false);
    const [talkingToAI, setTalkingToAI] = useState(false);

    const animations = {
        initial: {y:50},
        animate: {y:0},
        exit: {y:-50},
    };

    const animations2 = {
        hidden: {x:100},
        visible: {x:0},

    };

    // Add functions to handle toggling between different sections

    return (
        <motion.div className={styles.supportContainer}
                    variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:0.5, ease: "easeOut"}}>
            <section className={styles.heading}>
                <h1>Support</h1>
            </section>

            <section className={styles.supportOptions}>
                <div className={styles.option} onClick={() => setViewingTickets(true)}>
                    <h2>View Ongoing Tickets</h2>
                </div>
                <div className={styles.option} onClick={() => setCreatingTicket(true)}>
                    <h2>Create New Ticket</h2>
                </div>
                <div className={styles.option} onClick={() => talkingToSupport(true)}>
                    <h2>Talk to Agent</h2>
                </div>
                <div className={styles.option} onClick={() => talkingToAI(true)}>
                    <h2>Chat with AI bot</h2>
                </div>
            </section>

            {/* conditional rendering for different sections */}
            {viewingTickets && (
                <motion.div className={styles.ticketSection}>
                    {/* Add stuff for viewing ongoing tickets */}
                </motion.div>
            )}

            {creatingTicket && (
                <motion.div className={styles.ticketSection}>
                    {/* Add stuff */}
                </motion.div>
            )}

            {talkingToSupport && (
                <motion.div className={styles.ticketSection}>
                    {/* Add stuff  */}
                </motion.div>
            )}

            {talkingToAI && (
                <motion.div className={styles.ticketSection}>
                    {/* Add stuff  */}
                </motion.div>
            )}

            <section className={styles.backToHome}>
                <Link href="/">
                    Back to Home
                </Link>
            </section>
        </motion.div>
    );
}