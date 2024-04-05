'use client';

import {useEffect, useState, useLayoutEffect} from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/feed.module.css';



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
        handleViewPost();
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
      
        try {
            
            const res = await fetch('../api/feed/searchFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                  name:friendSearch
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

    const handleAddFriend = async (recipientEmail) =>{
      //e.preventDefault();
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
                window.location.reload();
                /// finish this
                
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
          /// finish this
          
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
          window.location.reload();
          /// finish this
          
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
          window.location.reload();
          /// finish this
          
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

    const handleAddPost = async ()=>{
      try {
        const res = await fetch('../api/feed/addPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail:userEmail,
              post: addPostValue
            }),
            
        });

        if (res.ok) {
          const data = await res.json();
          window.location.reload();
          /// finish this
          
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
          /// finish this
          
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
          /// finish this
          
    
          
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
          
            <div className={styles.searchDropdown}>
              <input placeholder="Search Friends" className={styles.searchBar}
                id="email"
                class="search-input"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                required
              />
              <div className={styles.dropdown}>
              {friendSearchResult.length>0 &&(
                  <div className={styles.dropdownList}>
                    {friendSearchResult.map((user, index) => (
                      <div key={index} className={styles.dropdownListItem}>
                        <div className={styles.userCard}>
                          <h1 className={styles.userCardName}>{user.firstName}</h1>
                          <h1 className={styles.userCardEmail}>{user.email}</h1>
                          <button className={styles.addfriendbutton} onClick={() => handleAddFriend(user.email)} type="submit">Add</button>
                        </div>
                      </div>
                    ))}
                  </div>
                
                
              )}
              </div>
              {/* <button onClick={handleSearchFriend}className={styles.addfriendbutton} type="submit">Search Friend</button> */}
            
            </div>

          <div>
            <div className={styles.friends}>Friends</div>
            
            {friends.map((friend, index)=>(
              <div className={styles.friendListItem} key={index}>
              <div>{friend[1]}</div>
              <button className={styles.rjct} onClick={()=> handleRemoveFriend(friend[0])}>&#10060;</button>
              </div>
            ))}
          </div>

          <div>
            <div className={styles.friends}>Friend Requests</div>
            {friendRequests.map((friendRequest, index)=>(
              <div key={index} className={styles.friendListItem}>
                <div>{friendRequest[1]}</div>
                <button className={styles.acpt} onClick={()=> handleAcceptFriend(friendRequest,true)}>&#9989;</button>
              </div>
            ))}
        </div>


        
      </div>
      <div className={styles.postMessage}>
            <form onSubmit={handleAddPost} className={styles.postForm}>
                {/* <div className={styles.transactionContainer}>
                    <label className={styles.transactionLabel}>Transaction History</label>
                    <select className={styles.transactionSelect} name="transactions" id="transactions">
                        <option value="None">None</option>
                        <option value="Sold Etherium at $21250">Sold Etherium at $21250</option>
                        <option value="Bought Bitcoin at $55000">Bought Bitcoin at $55000</option>
                    </select>
                </div> */}
                <div className={styles.textContainer}>
                    <label className={styles.textLabel}>Your Text</label>
                    <input type="text" 
                    placeholder="Text" 
                    onChange={(e) => setAddPostValue(e.target.value)}
                    className={styles.textBox} />
                </div>
                <input 
                type="submit" 
                value="Post"
                onChange={(e) => setAddPostValue(e.target.value)}
                className={styles.postButton}/>
            </form>
        </div>
        <div className={styles.feed}>
        
        {posts.length > 0 &&(
          <>
          <div className={styles.title}>Activity</div>
          
          {posts.map((post, index)=>(
            <div key={index} className={styles.post}>
              
              <div className={styles.name}>{post.userEmail}</div>
              {userRole === "Admin" && (
                <button onClick={handleRemovePost(post.id)}>x</button>
              )}
              <div className={styles.details}>{post.post}</div>
            </div>
          ))}
          </>
        )}
          
        </div>
    </div>
    )
    ;
}