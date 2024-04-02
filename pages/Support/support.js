'use client';

import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/support.module.css';
import { useSession } from "next-auth/react";
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
    const [userRole , setUserRole] = useState('')


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

            const res = await fetch('../api/auth/session');

            if (res) {
                const data = await res.json();
                const email = data.user.email;

                console.log("role is ", data.user.role)
                setUserEmail(data.user.email);
                setUserRole(data.user.role)
            } else {
                setError('Error fetching user session');
            }
        } catch (error) {
            setError('Internal Server Error');
        }
    };



    const handleViewTickets = async (index) => {

        const viewTicket = document.getElementById('viewTicket');
        const createTicket = document.getElementById('createTicket')
        const agent = document.getElementById('agent')
        const bot = document.getElementById('bot')


        viewTicket.style.transition = "border-bottom 0.5s ease-out";
        viewTicket.style.borderBottom = "7px solid #5AA056";

        if (userRole !== 'Admin') {
            createTicket.style.transition = "border-bottom 0.5s ease-out";
            agent.style.transition = "border-bottom 0.5s ease-out";
            bot.style.transition = "border-bottom 0.5s ease-out";


            createTicket.style.borderBottom = "none"
            agent.style.borderBottom = "none"
            bot.style.borderBottom = "none"
        }
        // console.log("handleViewTickets")
        // console.log("---------retrieved session userEmail: ", userEmail)

        // console.log("---------retrieved session userEmail:", JSON.stringify(userEmail))
        try {
            const res = await fetch('../api/tickets/viewTicket', {
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


        event.preventDefault();
        // console.log("handleTicketSubmit has this formData ", JSON.stringify(formData))
        try {

            if (formData.issueType === '' || formData.issueDescription === '') {
                console.log('Form is empty');
                return;
            }

            // Submit the form data to the addTicket API endpoint
            const response = await fetch('../api/tickets/addTicket', {
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
                // console.log('Ticket created successfully:', data.ticket);

            } else {
                // error in form submission
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreateTicket = async =>{
        const viewTicket = document.getElementById('viewTicket');
        const createTicket = document.getElementById('createTicket')
        const agent = document.getElementById('agent')
        const bot = document.getElementById('bot')

        viewTicket.style.borderBottom = "none";
        createTicket.style.borderBottom = "7px solid #5AA056"
        agent.style.borderBottom = "none"
        bot.style.borderBottom = "none"

        setCreatingTicket(true);
        setViewingTickets(false);
        setTalkingToSupport(false);
        setTalkingToAI(false);
    };

    const handleAgent = async =>{
        const viewTicket = document.getElementById('viewTicket');
        const createTicket = document.getElementById('createTicket')
        const agent = document.getElementById('agent')
        const bot = document.getElementById('bot')

        viewTicket.style.borderBottom = "none";
        createTicket.style.borderBottom = "none"
        agent.style.borderBottom = "7px solid #5AA056"
        bot.style.borderBottom = "none"

        setCreatingTicket(false);
        setViewingTickets(false);
        setTalkingToSupport(true);
        setTalkingToAI(false);
    };
    const handleBot = async =>{
        const viewTicket = document.getElementById('viewTicket');
        const createTicket = document.getElementById('createTicket')
        const agent = document.getElementById('agent')
        const bot = document.getElementById('bot')

        viewTicket.style.borderBottom = "none";
        createTicket.style.borderBottom = "none"
        agent.style.borderBottom = "none"
        bot.style.borderBottom = "7px solid #5AA056"

        setCreatingTicket(false);
        setViewingTickets(false);
        setTalkingToSupport(false);
        setTalkingToAI(true);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    return (


        <motion.div className={styles.supportContainer}
                    variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:0.5, ease: "easeOut"}}>


            <section className={styles.supportOptions}>
                <div className={styles.option} id={"viewTicket"} onClick={handleViewTickets}>
                    <h2>View Tickets</h2>
                </div>
                {userRole !== 'Admin' && (
                    <>
                    <div className={styles.option} id={"createTicket"} onClick={handleCreateTicket}>
                        <h2>Create Ticket</h2>
                    </div>
                    <div className={styles.option} id={"agent"} onClick={handleAgent}>
                        <h2>Talk to Agent</h2>
                    </div>
                    <div className={styles.option} id={"bot"} onClick={handleBot}>
                        <h2>Chat with AI bot</h2>
                    </div>
                    </>
                )}
            </section>

            {/* conditional rendering for different sections */}
            {tickets.length > 0 && viewingTickets && (
                <motion.div className={styles.ticketSection} variants={animations} initial="initial" animate="animate"
                            exit="exit" transition={{duration: 0.5, ease: "easeOut"}}>
                    <h2>Tickets:</h2>
                    <table className={styles.ticketsTable}>
                        <thead>
                        <tr>
                            <th>Issue Type</th>
                            <th>Issue Description</th>
                            <th>Date Created</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.map((ticket, index) => (
                            <tr key={index}>
                                <td>{ticket.issueType}</td>
                                <td>{ticket.issueDescription}</td>
                                <td>{formatDate(ticket.dateCreated)}</td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </motion.div>
            )}


            {/*CREATE A TICKET*/}
            {creatingTicket && (
                <div className={styles.ticketSection}>
                    <h2>New Ticket</h2>
                    <table className={styles.ticketsTable}>
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor="issueType">Issue Type:</label>
                                <select
                                    id="issueType"
                                    name="issueType"
                                    value={formData.issueType}
                                    onChange={handleChange}
                                    className={styles.issueTypeSelect}
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
                                        className={styles.otherIssueTypeInput}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="issueDescription">Issue Description:</label>
                                <textarea
                                    id="issueDescription"
                                    name="issueDescription"
                                    value={formData.issueDescription}
                                    onChange={handleChange}
                                    className={styles.issueDescriptionTextarea}
                                ></textarea>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button type="submit" className={styles.submitButton} onClick={handleTicketSubmit}>
                        Submit
                    </button>
                </div>
            )}

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
</motion.div>
)
    ;
}