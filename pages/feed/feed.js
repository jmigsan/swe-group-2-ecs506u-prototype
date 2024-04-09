'use client';

import {useEffect, useState, useLayoutEffect} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/feed.module.css';
import PostModal from './post';


export default function Support() {
    
  const [error, setError] = useState('');
  const [userEmail , setUserEmail] = useState('')
  const [userRole , setUserRole] = useState('')
  const [friendSearch,setFriendSearch] = useState('');
  const [friendSearchResult,setFriendSearchResult] = useState([]);
  const [friends,setFriends] = useState([]);
  const [friendRequests,setFriendRequests] = useState([]);
  const [addPostValue, setAddPostValue] = useState('');
  const [posts, setPosts] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchAll();
  };

    useEffect(() => {
        // Fetch user session information when the component mounts
        fetchUserSession();
    }, []);
    useEffect(()=>{
      if (userEmail){
        if(userRole ==="Investor"){
          handleViewFriends();
          handleViewFriendRequest();
          handleViewPost();
        }
        else if(userRole === "Admin"){
          handleViewPostAdmin();
        }

      }
    },[userEmail])

    useEffect(()=>{
      handleViewPost();
    },[friends])

    useEffect(()=>{
      if(friendSearch){
      handleSearchFriend();}
      else{
        setFriendSearchResult([])
      }
    },[friendSearch])

    function fetchAll (){
      handleViewFriendRequest()
      handleViewFriends()
      handleViewPost()
      handleSearchFriend();
      
    }

    const fetchUserSession = async () => {
        try {
            const res = await fetch('../api/auth/session');

            if (res) {
                const data = await res.json();
                const email = data.user.email;
                console.log("email is ", data.user.email)
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

    const handleSearchFriend = async () =>{
        if (friendSearch){
        try {
            const res = await fetch('../api/feed/searchFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name:friendSearch,
                  userEmail:userEmail
                }),  
            });

            if (res.ok) {
                const data = await res.json(); 
                setFriendSearchResult(data.users)  
            } else {
                setError('Error occurred while retrieving tickets');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Internal Server Error');
        }
      }
    }

    const handleAddFriend = async (recipientEmail) =>{

        try {
            const res = await fetch('../api/feed/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  recipientEmail: recipientEmail,
                  userEmail: userEmail}),  
            });

            if (res.ok) {
                const data = await res.json();
                 
            } else {
                setError('Error occurred while retrieving tickets');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Internal Server Error');
        }
        fetchAll();
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
            setFriends(data.users.friends)
        } else {
            setError('Error occurred while retrieving tickets');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
    }

    }
    const handleViewFriendRequest = async () =>{
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
          

        } 
        else {
          setError('Error occurred while retrieving tickets');
        }
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
      fetchAll()
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
          
        } 
        else {
          setError('Error occurred while retrieving tickets');
        }
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
      fetchAll()
    }

    

    const handleViewPost = async ()=>{
      try {
        
        const res = await fetch('../api/feed/viewPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              friends:friends,
              userEmail:userEmail,
              
            }),
            
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
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
    const handleViewPostAdmin = async ()=>{
      try {
        const res = await fetch('../api/feed/viewPostAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }  
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
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
    const handleRemovePost = async (postID) => {
      try {
        const res = await fetch('../api/feed/removePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postID: postID
            }),
        });
        if (res.ok) {
          const data = await res.json();
        } 
      } 
      catch (error) {
        console.error('Error:', error);
        setError('Internal Server Error');
      }  
      handleViewPostAdmin();
    }

    function convertToDate (timestamp){
      
      const currentTime = new Date();
      const postTime = new Date(timestamp);
      const timeDifference = currentTime.getTime() - postTime.getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
  
      if (years >= 1) {
          return `${years} year${years !== 1 ? 's' : ''} ago`;
      } else if (months >= 1) {
          return `${months} month${months !== 1 ? 's' : ''} ago`;
      } else if (weeks >= 1 && weeks <= 3) {
          return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else if (days >= 1 && days <= 6) {
          return `${days} day${days !== 1 ? 's' : ''} ago`;
      } else if (hours >= 1) {
          return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else if (minutes >= 1) {
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else {
          return `Just now`;
      }

    }

    return (
        <div className={styles.app}>
          {userRole ==="Investor" && (
          <div className={styles.sidebar}>
            <div className={styles.searchDropdown}>
              <input placeholder="Search Friends" className={styles.searchBar}
                id="email"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
              />
              <div className={styles.dropdown}>
              {friendSearchResult.length>0 &&(
                  <div className={styles.dropdownList}>
                    {friendSearchResult.map((user, index) => (
                      <div key={index} className={styles.dropdownListItem}>
                        <div className={styles.userCard}>
                          <div className={styles.userCardNameButton}>
                            <h1 className={styles.userCardName}>{user.firstName}</h1>
                            {user.isFriend === true ? 
                                (<button className={styles.addfriendButton}  type="submit">Added</button>)
                                : user.isFriend === false ?
                                (<button className={styles.addfriendButton}  type="submit">Pending</button>)
                                :
                                (<button className={styles.addfriendButton} onClick={() => handleAddFriend(user.email)} type="submit">Add
                                  {/* <img className={styles.addfriendButtonImg} src='/images/addSymbol.png'></img> */}
                                </button>)
                            }
                          </div>
                          <h1 className={styles.userCardEmail}>{user.email}</h1> 
                        </div>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
          
          <div>
            <div>
              <div className={styles.friends}>Friends</div>
              <div className={styles.dropdownFriend}>
                {friends.map((friend, index)=>(
                  <div className={styles.friendListItem} key={index}>
                    <div>{friend[1]}</div>
                    <button className={styles.rjct} onClick={()=> handleRemoveFriend(friend[0])}>&#10060;</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.friendRequest}>Friend Requests</div>
              <div className={styles.dropdownFriend}>
                {friendRequests.map((friendRequest, index)=>(
                  <div key={index} className={styles.friendListItem}>
                    <div>{friendRequest[1]}</div>
                    <button className={styles.acpt} onClick={()=> handleAcceptFriend(friendRequest,true)}>&#9989;</button>
                    <button className={styles.acpt} onClick={()=> handleAcceptFriend(friendRequest,false)}>&#10060;</button>
                  </div>
                ))}
              </div>
            </div>  
          </div>
        </div>
        )}


        {userRole ==="Investor" && (
        <div>

          <button onClick={openModal} className={styles.createButton}>
            <img className={styles.createButtonImg} src='/images/create.png'></img>
            <h1>Create</h1>
          </button>
          <PostModal isOpen={isModalOpen} onClose={closeModal} userEmail={userEmail} />
        </div>

        )}


        <div className={styles.feed}>
        {posts.length > 0 ?(
          <>
            <div className={styles.title}>Activity</div>
            {posts.map((post, index)=>(
              <div key={index} className={styles.post}>
                <div className={styles.postNameDate}>
                  <div className={styles.name}>{post.userEmail}</div>
                  <div className={styles.date}>{convertToDate(post.dateCreated)}</div>
                </div>
                {userRole === "Admin" && (
                  <button onClick={()=>handleRemovePost(post.id)}>x</button>
                )}
                <div className={styles.details}>{post.post}</div>
              </div>
            ))}
          </>
        )
        :
        (
          <div>
            <div className={styles.title}>Activity</div>
            <div className={styles.post}> No posts</div>
          </div>
        )
        }   
      </div>
    </div>
  )
}
