'use client';

import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/support.module.css';
import Link from 'next/link';

export default function Support() {
    const [viewingTickets, setViewingTickets] = useState(false);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [talkingToSupport, setTalkingToSupport] = useState(false);
    const [talkingToAI, setTalkingToAI] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [userEmail , setUserEmail] = useState('')


    const [formData, setFormData] = useState({
        issueType: '',
        otherIssueType: '',
        issueDescription: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const animations = {
        initial: {y:50},
        animate: {y:0},
        exit: {y:-50},
    };

    const animations2 = {
        hidden: {x:100},
        visible: {x:0},

    };
    const animations3={
        start:{
            y:"0%",
        },
        end:{
            y:"100%",
        }
    }

    useEffect(() => {
        // Fetch user session information when the component mounts
        fetchUserSession();
    }, []);

    const fetchUserSession = async () => {
        try {
            const res = await fetch('/api/auth/session');
            if (res.ok) {
                const data = await res.json();
                const email = data.user.email;
                setUserEmail(email); // Set user email in component state
            } else {
                setError('Error fetching user session');
            }
        } catch (error) {
            setError('Internal Server Error');
        }
    };



    const handleViewTickets = async () => {
        console.log("handleViewTickets")
        // console.log("---------retrieved session userEmail: ", userEmail)

        console.log("---------retrieved session userEmail:", JSON.stringify(userEmail))
        try {



            const res = await fetch('api/tickets/viewTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail}),
                // body: JSON.stringify({ userEmail }),
            });

            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets);
                setSuccess('Tickets retrieved successfully');
                // Ensure only the "View Ongoing Tickets" section is displayed
                setViewingTickets(true);
                setCreatingTicket(false);
                setTalkingToSupport(false);
                setTalkingToAI(false);
            } else {
                setError('Error occurred while retrieving tickets');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Internal Server Error');
        }
    };

    const handleTicketSubmit = async (event) =>{

        setViewingTickets(false);
        setCreatingTicket(true);



        event.preventDefault();
        console.log("handleTicketSubmit has this formData ", JSON.stringify(formData))
        try {

            if (formData.issueType === '' || formData.issueDescription === '') {
                console.log('Form is empty');
                return;
            }

            // Submit the form data to the addTicket API endpoint
            const response = await fetch('api/tickets/addTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    issueType: formData.issueType,
                    otherIssueType: formData.otherIssueType,
                    issueDescription:formData.issueDescription,
                }),
            });

            if (response.ok) {
                //successful form submission
                const data = await response.json();
                console.log('Ticket created successfully:', data.ticket);

            } else {
                // error in form submission
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <motion.div className={styles.supportContainer}
                    variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:0.5, ease: "easeOut"}}>
            <section className={styles.heading}>
                <h1>Support</h1>
            </section>

            <section className={styles.supportOptions}>
                <div className={styles.option} onClick={handleViewTickets}>
                    <h2>View Ongoing Tickets</h2>
                </div>
                <div className={styles.option} onClick={() => setCreatingTicket(true)}>
                    <h2>Create New Ticket</h2>
                </div>
                <div className={styles.option} onClick={() => setTalkingToSupport(true)}>
                    <h2>Talk to Agent</h2>
                </div>
                <div className={styles.option} onClick={() => setTalkingToAI(true)}>
                    <h2>Chat with AI bot</h2>
                </div>
            </section>

            {/* conditional rendering for different sections */}
            {tickets.length > 0 && (
                <motion.div className={styles.ticketSection} variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:0.5, ease: "easeOut"}}>
                    <h2>Tickets:</h2>
                    <ul>
                        {tickets.map((ticket, index) => (
                            <li key={index}>
                                <div className={styles.ticket}>
                                    <div className={styles.ticketInfo}>
                                        <span className={styles.label}>Issue Type:</span>
                                        <span className={styles.issueType}>{ticket.issueType}</span>
                                    </div>
                                    <div className={styles.ticketInfo}>
                                        <span className={styles.label}>Issue Description:</span>
                                        <span className={styles.issueDescription}>{ticket.issueDescription}</span>
                                    </div>
                                    <div className={styles.ticketInfo}>
                                        <span className={styles.label}>Date Created:</span>
                                        <span className={styles.dateCreated}>{ticket.dateCreated}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}


            {/*CREATE A TICKET*/}
            {creatingTicket && (
                <div className={styles.ticketSection}>
                    <h2>New Ticket</h2>
                    <form onSubmit={handleTicketSubmit}>

                        <div>
                            <label htmlFor="issueType">Issue Type:</label>
                            <select
                                id="issueType"
                                name="issueType"
                                value={formData.issueType}
                                onChange={handleChange}
                            >
                                <option value="">Select Issue Type</option>
                                <option value="Bug">Bug</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.issueType === 'Other' && (
                                <input
                                    type="text"
                                    id="otherIssueType"
                                    name="otherIssueType"
                                    placeholder="Specify Issue Type"
                                    value={formData.otherIssueType}
                                    onChange={handleChange}
                                />
                            )}
                        </div>
                        <div>
                            <label htmlFor="issueDescription">Issue Description:</label>
                            <textarea
                                id="issueDescription"
                                name="issueDescription"
                                value={formData.issueDescription}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
                )
            }

            {
                talkingToSupport && (
                    <motion.div className={styles.ticketSection}>
                        {/* Add stuff  */}
                    </motion.div>
                )
            }

            {
                talkingToAI && (
                    <motion.div className={styles.ticketSection}>
                        {/* Add stuff  */}
                    </motion.div>
                )
            }

            <section className={styles.backToHome}>
                <Link href="/">
                    Back to Home
                </Link>
            </section>
</motion.div>
)
    ;
}