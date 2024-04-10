'use client';

import {useEffect, useState, useLayoutEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/support.module.css';

import Modal from './adminComment';
import TicketModal from './ticketView'


export default function Support() {
    const [viewingTickets, setViewingTickets] = useState(true);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [talkingToSupport, setTalkingToSupport] = useState(false);
    const [talkingToAI, setTalkingToAI] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [activeTickets, setActiveTickets] = useState([]) ;
    const [resolvedTickets, setResolvedTickets] = useState([]);

    const [showActiveTickets, setShowActiveTickets] = useState(false);
    const [showSolvedTickets, setShowSolvedTickets] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    const [userEmail , setUserEmail] = useState('')
    const [userRole , setUserRole] = useState('')
    const [adminTicketResolved , setAdminTicketResolved] = useState({})
    const [adminComments, setAdminComments] = useState('');
    const [successFlash, setSuccessFlash] = useState(false);
    const [errorFlash, setErrorFlash] = useState(false);


    const [showModal, setShowModal] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const textareaRef = useRef(null);


    const [sortByDateAscending, setSortByDateAscending] = useState(true);

    const handleActiveTicketsClick = () => {
        console.log("active tickets clicked")
        setActiveTickets(tickets.filter((ticket) => !ticket.solved))
        setShowActiveTickets(true);
        setShowSolvedTickets(false);

    };
    const handleAllTicketsClick = () => {


        console.log("all tickets")
        setShowActiveTickets(false);
        setShowSolvedTickets(false);
    };
    const handleSolvedTicketsClick = () => {
        console.log("solved tickets clicked")
        setActiveTickets(tickets.filter((ticket) => ticket.solved))
        setShowActiveTickets(false);
        setShowSolvedTickets(true);

    };

    function handleOpenModal(){
        setShowModal(true);
    }
    function handleCloseModal(){
        setShowModal(false);
    }
    function handleOpenTicketModal(ticket){
        setCurrentTicket(ticket);
        setShowTicketModal(true);
        console.log("comemement herere ",ticket.comment)
    }
    function handleCloseTicketModal(){
        console.log("first ticket modal   ", showTicketModal)
        setShowTicketModal(false);
        console.log("ticket modal is now", showTicketModal)
    }


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

    useEffect(() => {

        const fetchData = async () => {
            try {

                const userData = await fetchUserSession();

                handleViewTickets();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        console.log("on render")

        fetchData();

    }, [userEmail, userRole]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {

            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [formData.issueDescription]);



    useLayoutEffect(() => {
        if (errorFlash) {
            console.log("errrororororo flash sd sdf sdfsd")
            const view = document.querySelector(`.${styles.entireView}`);


            view.classList.remove(styles.errorFlash);

            // Trigger reflow
            void view.offsetWidth;
            view.classList.add(styles.errorFlash);

            const timer = setTimeout(() => {
                // view.style.backgroundColor = 'white';
                view.classList.remove(styles.errorFlash);
                setErrorFlash(false);
            }, 700);

            return () => clearTimeout(timer);
        }

        if (successFlash) {
            const view = document.querySelector(`.${styles.entireView}`);
            // view.classList.add('flash');
            // view.style.backgroundColor = 'rgb(141, 205, 141)';

            view.classList.remove(styles.flash);

            // Trigger reflow
            void view.offsetWidth;
            view.classList.add(styles.flash);

            const timer = setTimeout(() => {
                // view.style.backgroundColor = 'white';
                view.classList.remove(styles.flash);
                setSuccessFlash(false);
                window.location.reload();
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [successFlash, errorFlash]);

    const fetchUserSession = async () => {
        try {

            const res = await fetch('../api/auth/session');

            if (res.ok) {
                const data = await res.json();
                const email = data.user.email;

                console.log("role is ", data.user.role)
                setUserEmail(data.user.email);
                setUserRole(data.user.role)
                return data
            } else {
                setError('Error fetching user session');
                return null
            }
        } catch (error) {
            setError('Internal Server Error');
            return null
        }
    };


    const handleViewTickets = async (index) => {

        const viewTicket = document.getElementById('viewTicket');
        const createTicket = document.getElementById('createTicket')


        viewTicket.style.transition = "border-bottom 0.5s ease-out";
        viewTicket.style.borderBottom = "7px solid #5AA056";

        if (userRole !== 'Staff') {
            createTicket.style.transition = "border-bottom 0.5s ease-out";


            createTicket.style.borderBottom = "none"
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
                setErrorFlash(true)
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
                setSuccessFlash(true)
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

        viewTicket.style.borderBottom = "none";
        createTicket.style.borderBottom = "7px solid #5AA056"

        setCreatingTicket(true);
        setViewingTickets(false);
        setTalkingToSupport(false);
        setTalkingToAI(false);
    };
    const handleTempSolvedChange = (ticketId, newValue) => {
        setAdminTicketResolved((prevState) => ({
            ...prevState,
            [ticketId]: newValue === 'true',
        }));
    };


    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    function formatSolved(solved) {
        return solved ? "Yes" : "No";
    }
    function flashScreen(){
        setShowConfirmation(true); // Set showConfirmation to true

        setTimeout(() => {
            setShowConfirmation(false);
        }, 2000); // Reset flash after 2 seconds
    }

    function countActiveTickets(tickets){
        let resolvedCount = 0;

        // Iterate through the tickets array
        tickets.forEach(ticket => {
            if (!ticket.solved) {
                resolvedCount++;
            }
        });

        return resolvedCount;
    }

    const  handleConfirmChange = async (ticketId, newValue) => {
        console.log("ticketId is ", ticketId)
        console.log("newValue is ", newValue)
        if(adminComments !== ""){
            handleCloseModal()
            try {
                // Submit the updated solved value to the updateTicket API endpoint
                const response = await fetch(`/api/tickets/updateTicket?id=${ticketId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        newValue: newValue,
                        adminComments: adminComments,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSuccessFlash(true);
                    console.log('Ticket updated successfully:', data.message);
                } else {

                    console.error('Error with changing value:', response.statusText);
                }
            } catch (error) {
                console.error('internal Error:', error);
            }
            setAdminComments("")
        }else{
            console.log("no comments so it should be flashiung")
            setErrorFlash(true)
        }



    };

    const toggleSortOrder = () => {
        // console.log("whoop whoop")
        setSortByDateAscending(prevState => !prevState);
        setTickets(prevTickets => {
            const sortedTickets = [...prevTickets];
            sortedTickets.sort((a, b) => {
                if (sortByDateAscending) {
                    return new Date(a.dateCreated) - new Date(b.dateCreated);
                } else {
                    return new Date(b.dateCreated) - new Date(a.dateCreated);
                }
            });
            return sortedTickets;
        });
        setActiveTickets(prevTickets => {
            const sortedTickets = [...prevTickets];
            sortedTickets.sort((a, b) => {
                if (sortByDateAscending) {
                    return new Date(a.dateCreated) - new Date(b.dateCreated);
                } else {
                    return new Date(b.dateCreated) - new Date(a.dateCreated);
                }
            });
            return sortedTickets;
        });
    };


    return (

        <div className= {styles.entireView} >
            <motion.div className={styles.supportContainer}
                        variants={animations} initial="initial" animate="animate" exit="exit"
                        transition={{duration: 0.5, ease: "easeOut"}}>


                <section className={styles.supportOptions}>
                    <div className={styles.option} id={"viewTicket"} onClick={handleViewTickets}>
                        <h2>View Tickets</h2>
                    </div>
                    {userRole !== 'Staff' && (
                        <>
                            <div className={styles.option} id={"createTicket"} onClick={handleCreateTicket}>
                                <h2>Create Ticket</h2>
                            </div>

                        </>
                    )}
                </section>

                {/* conditional rendering for different sections */}
                {viewingTickets && (
                    <>

                    <motion.div className={styles.ticketSection} variants={animations} initial="initial"
                                animate="animate"
                                exit="exit" transition={{duration: 0.5, ease: "easeOut"}}>

                        <ul className={styles.boxinfo}>
                            <li className={`${styles.totalTickets} ${(!showActiveTickets && !showSolvedTickets) ? styles.clicked : ''}`} onClick={handleAllTicketsClick} >
                                <span className={styles.text}>
                                <h3 className={styles.h3} >{tickets.length}</h3>
                                <p>Total Tickets</p>
                                </span>
                            </li>
                            <li className={`${styles.otherTwo} ${showActiveTickets ? styles.clicked : ''}`} onClick={handleActiveTicketsClick}>
                                <span className={styles.text}>
                                <h3 className={styles.h3} >{countActiveTickets(tickets)}</h3>
                                <p>Active Tickets</p>
                                </span>
                            </li>
                            <li  className={`${styles.otherTwo} ${showSolvedTickets ? styles.clicked : ''}`} onClick={handleSolvedTicketsClick}>
                                <span className={styles.text}>
                                <h3 className={styles.h3} >{tickets.length - countActiveTickets(tickets)}</h3>
                                <p>Resolved Tickets</p>
                                </span>
                            </li>
                        </ul>

                        <table className={styles.ticketsTable}>
                            <thead>
                            <tr>
                                {userRole === 'Staff' && <th>User</th>}
                                <th>Issue Type</th>
                                <th className={styles.DateCreated}>Date Created
                                    <img className={styles.changeOrder} src="/images/two-arrow.png" alt="Change Order" onClick={toggleSortOrder}/>
                                </th>
                                {userRole !== 'Staff' && showActiveTickets === false && showSolvedTickets === true &&
                                    <th>Comments</th>}
                                {adminTicketResolved && userRole === 'Staff' && <th>Resolved</th>}
                                {adminTicketResolved && userRole === 'Staff' && <th></th>}
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*SHOW ONLY ACTIVE TICKETS*/}
                            { showActiveTickets && showSolvedTickets === false &&(
                                activeTickets.map((ticket, index) => (
                                    <motion.tr
                                        className={styles.ticketRow}
                                        initial={"initial"}
                                        animate={"animate"}
                                        exit={"exit"}
                                        variants={animations}
                                        transition={{duration: 0.5, ease: "easeOut"}}
                                        key={index}>
                                        {userRole === 'Staff' && <td>{ticket.userEmail}</td>}
                                        <td>{ticket.issueType}</td>
                                        {/*<td>{ticket.issueDescription}</td>*/}
                                        <td>{formatDate(ticket.dateCreated)}</td>

                                        {userRole === 'Staff' ? (
                                            <>
                                                <td>
                                                    <select
                                                        className={styles.select}
                                                        value={adminTicketResolved[ticket.id] !== undefined ? adminTicketResolved[ticket.id].toString() : ticket.solved.toString()}
                                                        onChange={(e) => handleTempSolvedChange(ticket.id, e.target.value)}
                                                    >
                                                        <option value="true">Yes</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                </td>
                                                {adminTicketResolved[ticket.id] !== ticket.solved && adminTicketResolved[ticket.id] !== undefined ? (
                                                    <>
                                                        <td>
                                                        <button  className={styles.submitButton} onClick={handleOpenModal}>Enter comments</button>
                                                        </td>
                                                        {showModal && (
                                                            <Modal
                                                                adminComments={adminComments}
                                                                setAdminComments={setAdminComments}
                                                                handleConfirmChange={() => handleConfirmChange(ticket.id, adminTicketResolved[ticket.id])}
                                                                onClose={handleCloseModal}
                                                            />
                                                        )}
                                                    </>
                                                ): (
                                                    <td>
                                                        <button className={styles.ticketButton}
                                                                onClick={() => handleOpenTicketModal(ticket)}>
                                                            <img className={styles.ticketButtonImage}
                                                                 src="/images/selection.png"
                                                                 alt="Add Ticket"/>
                                                        </button>
                                                    </td>
                                                )}
                                            </>
                                        ): (
                                            <td>
                                                <button
                                                    className={styles.ticketButton}
                                                    onClick={() => handleOpenTicketModal(ticket)}
                                                >
                                                    <img
                                                        className={styles.ticketButtonImage}
                                                        src="/images/selection.png"
                                                        alt="Add Ticket"
                                                    />
                                                </button>
                                            </td>
                                        )}


                                    </motion.tr>

                                )))

                            }

                            {/*SHOW ONLY SOLVED TICKETS*/}
                            {showSolvedTickets && showActiveTickets === false && (
                                activeTickets.map((ticket, index) => (
                                    <motion.tr
                                        className={styles.ticketRow}
                                        initial={"initial"}
                                        animate={"animate"}
                                        exit={"exit"}
                                        variants={animations}
                                        transition={{duration: 0.5, ease: "easeOut"}} key={index}>
                                        {userRole === 'Staff' && <td>{ticket.userEmail}</td>}
                                        <td>{ticket.issueType}</td>
                                        {/*<td>{ticket.issueDescription}</td>*/}
                                        <td>{formatDate(ticket.dateCreated)}</td>

                                        {userRole === 'Staff' ? (
                                            <>
                                                <td>
                                                    <select
                                                        className={styles.select}
                                                        value={adminTicketResolved[ticket.id] !== undefined ? adminTicketResolved[ticket.id].toString() : ticket.solved.toString()}
                                                        onChange={(e) => handleTempSolvedChange(ticket.id, e.target.value)}
                                                    >
                                                        <option value="true">Yes</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                </td>
                                                {adminTicketResolved[ticket.id] !== ticket.solved && adminTicketResolved[ticket.id] !== undefined ? (
                                                    <>
                                                        <td>
                                                            <button className={styles.submitButton}
                                                                    onClick={handleOpenModal}>Enter comments
                                                            </button>
                                                        </td>
                                                        {showModal && (
                                                            <Modal
                                                                adminComments={adminComments}
                                                                setAdminComments={setAdminComments}
                                                                handleConfirmChange={() => handleConfirmChange(ticket.id, adminTicketResolved[ticket.id])}
                                                                onClose={handleCloseModal}
                                                            />
                                                        )}

                                                    </>
                                                ): (
                                                    <td>
                                                        <button className={styles.ticketButton}
                                                                onClick={() => handleOpenTicketModal(ticket)}>
                                                            <img className={styles.ticketButtonImage}
                                                                 src="/images/selection.png"
                                                                 alt="Add Ticket"/>
                                                        </button>
                                                    </td>
                                                )}
                                            </>
                                        ): (
                                            <>
                                            <td>{ticket.comments}</td>

                                            <td>

                                                <button
                                                    className={styles.ticketButton}
                                                    onClick={() => handleOpenTicketModal(ticket)}
                                                >
                                                    <img
                                                        className={styles.ticketButtonImage}
                                                        src="/images/selection.png"
                                                        alt="Add Ticket"
                                                    />
                                                </button>
                                            </td>
                                            </>
                                        )}

                                    </motion.tr>

                                )))
                            }

                            {/*SHOW ALL TICKETS*/}
                            {showActiveTickets===false && showSolvedTickets === false &&
                                tickets.map((ticket, index) => (


                                <motion.tr
                                    className={styles.ticketRow}
                                    initial={"initial"}
                                    animate={"animate"}
                                    exit={"exit"}
                                    variants={animations}
                                    transition={{duration: 0.5, ease: "easeOut"}} key={index}>

                                    {userRole === 'Staff' && <td>{ticket.userEmail}</td>}
                                    <td>{ticket.issueType}</td>
                                    {/*<td>{ticket.issueDescription}</td>*/}
                                    <td>{formatDate(ticket.dateCreated)}</td>

                                    {userRole === 'Staff' ? (
                                        <>
                                            <td>
                                                <select
                                                    className={styles.select}
                                                    value={adminTicketResolved[ticket.id] !== undefined ? adminTicketResolved[ticket.id].toString() : ticket.solved.toString()}
                                                    onChange={(e) => handleTempSolvedChange(ticket.id, e.target.value)}
                                                >
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </td>
                                            {adminTicketResolved[ticket.id] !== ticket.solved && adminTicketResolved[ticket.id] !== undefined ? (
                                                <>
                                                <td>
                                                    <button className={styles.submitButton}
                                                            onClick={handleOpenModal}>Enter comments
                                                    </button>
                                                </td>
                                                {showModal && (
                                                    <Modal
                                                        adminComments={adminComments}
                                                        setAdminComments={setAdminComments}
                                                        handleConfirmChange={() => handleConfirmChange(ticket.id, adminTicketResolved[ticket.id])}
                                                        onClose={handleCloseModal}
                                                    />
                                                )}

                                                </>
                                            ): (
                                                <td>
                                                    <button className={styles.ticketButton}
                                                            onClick={() => handleOpenTicketModal(ticket)}>
                                                        <img className={styles.ticketButtonImage}
                                                             src="/images/selection.png"
                                                             alt="Add Ticket"/>
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    ): (
                                        <>


                                            <td>

                                                <button
                                                    className={styles.ticketButton}
                                                    onClick={() => handleOpenTicketModal(ticket)}
                                                >
                                                    <img
                                                        className={styles.ticketButtonImage}
                                                        src="/images/selection.png"
                                                        alt="Add Ticket"
                                                    />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </motion.tr>

                            ))
                            }

                            </tbody>
                        </table>

                    </motion.div>

                        {showTicketModal && (
                            <TicketModal
                                issueType={currentTicket.issueType}
                                issueDescription={currentTicket.issueDescription}
                                dateCreated={currentTicket.dateCreated}
                                comment={currentTicket.comments}
                                onClose={handleCloseTicketModal}
                            />
                        )}
                    </>
                )}


                {/*CREATE A TICKET*/}
                {creatingTicket && (
                    <div className={styles.createTicket}>
                        <h2 className={styles.header}>New Ticket</h2>
                        <div className={styles.modalContent}>
                            <div className={styles.formContainer}>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label htmlFor="issueType" className={styles.formLabel}>Issue Type:</label>
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
                                    </div>
                                    <div className={styles.formField}>
                                        <label htmlFor="issueDescription" className={styles.formLabel}>Issue Description:</label>
                                        <textarea
                                            ref={textareaRef}
                                            id="issueDescription"
                                            name="issueDescription"
                                            value={formData.issueDescription}
                                            onChange={handleChange}
                                            className={styles.issueDescriptionTextarea}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.submitButton} onClick={handleTicketSubmit}>
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
}