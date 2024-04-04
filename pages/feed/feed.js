import styles from '/styles/feed.module.css'
import {useEffect} from 'react';

const profilePic = "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg";
import React, { useState } from 'react';

const feed = () =>{
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(null); 

  // Function to add a friend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId) {
      setError('User ID is not set.');
      return;
    }

    try {
      const response = await fetch('/api/feed/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, 
          friendEmail: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add friend');
      }

      // Clear the input and refetch friends list to update UI
      setEmail('');
      fetchFriends();
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to fetch friends
  const fetchFriends = async () => {
    if (!userId) return; 

    try {
      const response = await fetch(`/api/feed/friends?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [userId]);

    return(
      <div className={styles.app}>
        <div className={styles.sidebar}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Friend's Email:</label>
          <input placeholder="Search Friends" className={styles.search}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.addfriendbutton} type="submit">Add Friend</button>
        </form>
        <div className={styles.friendsList}>
          <h2>My Friends</h2>
          {error && <p>{error}</p>}
          <ul>
            {friends.map((friend) => (
              <li key={friend.id}>
                {friend.name} - {friend.email}
              </li>
            ))}
          </ul>
        </div>
        </div>
        <div className={styles.feed}>
          <div className={styles.title}>Activity</div>
          <div className={styles.post}>
            <div className={styles.profile}>
              <img src={profilePic} className={styles.picture} alt="Profile Picture" />
              <div className={styles.user}>
                <div className={styles.nameContainer}>
                  <div className={styles.name}>John Doe</div>
                  <div className={styles.username}>@JohnDoe</div>
                </div>
                <div className={styles.date}>15:00 March 10, 2024</div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.crypto}>
                <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"} className={styles.coin} alt="Bitcoin" />
                <div className={styles.coinInfo}>
                  <div className={styles.boughtSold}>Bought</div>
                  <div className={styles.transaction}>
                    <div className={styles.coinName}>Bitcoin</div>
                    <div>&nbsp;at&nbsp;</div>
                    <div className={styles.price}>$40,000</div>
                  </div>
                </div>
              </div>
              <div className={styles.postText}>This coin is so cool! I'm so glad I bought it</div>
            </div>
          </div>
          <div className={styles.post}>
            <div className={styles.profile}>
              <img src={profilePic} className={styles.picture} alt="Profile Picture" />
              <div className={styles.user}>
                <div className={styles.nameContainer}>
                  <div className={styles.name}>Cass Smith</div>
                  <div className={styles.username}>@CassSmith</div>
                </div>
                <div className={styles.date}>19:30 March 14, 2024</div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.crypto}>
                <img src={"https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Cardano-Logo-Graphics-13393853-1.jpg"} className={styles.coin} alt="Cadarno" />
                <div className={styles.coinInfo}>
                  <div className={styles.boughtSold}>Sold</div>
                  <div className={styles.transaction}>
                    <div className={styles.coinName}>Cadarno</div>
                    <div>&nbsp;at&nbsp;</div>
                    <div className={styles.price}>$2.42</div>
                  </div>
                </div>
              </div>
              <div className={styles.postText}>You should really sell this coin!</div>
            </div>
          </div>
        </div>
        <div className={styles.postMessage}>
            <form className={styles.postForm}>
                <div className={styles.transactionContainer}>
                    <label className={styles.transactionLabel}>Transaction History</label>
                    <select className={styles.transactionSelect} name="transactions" id="transactions">
                        <option value="None">None</option>
                        <option value="Sold Etherium at $21250">Sold Etherium at $21250</option>
                        <option value="Bought Bitcoin at $55000">Bought Bitcoin at $55000</option>
                    </select>
                </div>
                <div className={styles.textContainer}>
                    <label className={styles.textLabel}>Your Text</label>
                    <input type="text" placeholder="Text" className={styles.textBox} />
                </div>
                <input type="submit" value="Post" className={styles.postButton}/>
            </form>
        </div>
      </div>
    )
}

export default feed;