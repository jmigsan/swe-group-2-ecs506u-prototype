'use client';

import {useEffect, useState, useLayoutEffect} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/support.module.css';



export default function Support() {
    const [viewingTickets, setViewingTickets] = useState(false);
    const [creatingTicket, setCreatingTicket] = useState(false);
    
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    const [userEmail , setUserEmail] = useState('')
    const [userRole , setUserRole] = useState('')
    const [adminTicketResolved , setAdminTicketResolved] = useState({})
    const [adminComments, setAdminComments] = useState('');
    const [successFlash, setSuccessFlash] = useState(false);
    const [errorFlash, setErrorFlash] = useState(false);
    const [friendSearch,setFriendSearch] = useState('');
    const [friends,setFriends] = useState([]);
    const [friendRequests,setFriendRequests] = useState([]);


    const [showModal, setShowModal] = useState(false);


    function handleOpenModal(){
        setShowModal(true);
    }
    function handleCloseModal(){
        setShowModal(false);
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
    useEffect(()=>{
      if (userEmail){
        handleViewFriends();
        handleViewFriendRequest();
      }
    },[userEmail])

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
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [successFlash, errorFlash]);

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

    const handleFriendSearch = async (e) =>{
      e.preventDefault();
        try {
            console.log(userEmail);
            const res = await fetch('../api/feed/searchFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                  recipientEmail:friendSearch
                }),
                
            });

            if (res.ok) {
                const data = await res.json();
                /// finish this
                console.log(data);
            } else {
                setError('Error occurred while retrieving tickets');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Internal Server Error');
        }
    }

    const handleAddFriend = async (e) =>{
      e.preventDefault();
        try {
            const res = await fetch('../api/feed/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  recipientEmail: friendSearch,
                  userEmail: userEmail}),
                
            });

            if (res.ok) {
                const data = await res.json();
                /// finish this
                console.log(data);
            } else {
                setError('Error occurred while retrieving tickets');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Internal Server Error');
        }
    }

    const handleViewFriends = async () =>{
      
      try {
        const res = await fetch('../api/feed/viewFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: userEmail}),
            
        });

        if (res.ok) {
            const data = await res.json();
            /// finish this
            console.log(data, "here11");
            setFriends(data.users.friends)
        } else {
            setError('Error occurred while retrieving tickets');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
    }

    }
    const handleViewFriendRequest = async (requestEmail,accept) =>{
      try {
        const res = await fetch('../api/feed/viewFriendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({         
              userEmail: userEmail,
            }),
            
        });

        if (res.ok) {
          const data = await res.json();
          /// finish this
          console.log(data, "here1");
          setFriendRequests(data.users.friends)
        } 
        else {
          setError('Error occurred while retrieving tickets');
        }
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
    }

    const handleAcceptFriend = async (requestEmail,accept) =>{
      console.log(accept)
      try {
        const res = await fetch('../api/feed/acceptFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              friendID: requestEmail[0],
              
              userEmail: userEmail,
              accept: accept
            }),
            
        });

        if (res.ok) {
          const data = await res.json();
          /// finish this
          //console.log(data);
        } 
        else {
          setError('Error occurred while retrieving tickets');
        }
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
    }
    const handleRemoveFriend = async (friendID) =>{
      
      try {
        const res = await fetch('../api/feed/removeFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              friendID: friendID
            }),
            
        });

        if (res.ok) {
          const data = await res.json();
          /// finish this
          //console.log(data);
        } 
        else {
          setError('Error occurred while retrieving tickets');
        }
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
    }

    return (

        <div className={styles.app}>
        <div className={styles.sidebar}>
        <form onSubmit={handleFriendSearch}>
          <label htmlFor="email">Friend's Email:</label>
          <input placeholder="Search Friends" className={styles.search}
            id="email"
            type="email"
            value={friendSearch}
            onChange={(e) => setFriendSearch(e.target.value)}
            required
          />
          <button onClick={handleFriendSearch}className={styles.addfriendbutton} type="submit">searchFriend</button>
          <button onClick={handleAddFriend}className={styles.addfriendbutton} type="submit">Add Friend</button>
        </form>

        <div>
          <h1>Friend list</h1>
          {friends.map((friend, index)=>(
            <div key={index}>
            <h1>{friend[1]}</h1>
            <button onClick={()=> handleRemoveFriend(friend[0])}>remove</button>
            </div>
          ))}
        </div>

        <div>
          <h1>Friend request list</h1>
          {friendRequests.map((friendRequest, index)=>(
            <div key={index}>
              <h1 >{friendRequest[1]}</h1>
              <button onClick={()=> handleAcceptFriend(friendRequest,true)}>accept</button>
            </div>
          ))}
        </div>


        
      </div>
    </div>
    )
    ;
}