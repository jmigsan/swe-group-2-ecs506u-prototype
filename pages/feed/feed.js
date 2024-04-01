import styles from '/styles/feed.module.css'
const profilePic = "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg";

const feed = () =>{
    return(
      <div className={styles.app}>
        <div className={styles.sidebar}>
          <input type="text" placeholder="Search Friends" className={styles.search} />
          <div className={styles.friendsContainer}>
            <div className={styles.friends}>Friends</div>
            <ul className={styles.friendList}>
                <li className={styles.friendListItem}><img src={profilePic} className={styles.friendPicture} alt="Profile Picture" /><div className={styles.friendName}>Jordan King<div className={styles.friendUsername}>@JordanKing</div></div></li>
                <li className={styles.friendListItem}><img src={profilePic} className={styles.friendPicture} alt="Profile Picture" /><div className={styles.friendName}>Amy Ford<div className={styles.friendUsername}>@AmyFord</div></div></li>
                <li className={styles.friendListItem}><img src={profilePic} className={styles.friendPicture} alt="Profile Picture" /><div className={styles.friendName}>James Summer<div className={styles.friendUsername}>@JamesSummer</div></div></li>
                <li className={styles.friendListItem}><img src={profilePic} className={styles.friendPicture} alt="Profile Picture" /><div className={styles.friendName}>Cass Smith<div className={styles.friendUsername}>@CassSmith</div></div></li>
            </ul>
          </div>
          <div className={styles.friendsRequests}>
            <div className={styles.friends}>Friends Requests</div>
            <ul className={styles.friendList}>
                <li className={styles.friendListItem}>
                    <img src={profilePic} className={styles.friendPicture} alt="Profile Picture" />
                    <div className={styles.friendName}>Sean Evan<div className={styles.friendUsername}>@SeanEvan</div></div>
                    <button className={styles.acpt}>&#9989;</button>
                    <button className={styles.rjct}>&#10060;</button>
                </li>
                <li className={styles.friendListItem}>
                    <img src={profilePic} className={styles.friendPicture} alt="Profile Picture" />
                    <div className={styles.friendName}>Melissa Nika<div className={styles.friendUsername}>@MelNika</div></div>
                    <button className={styles.acpt}>&#9989;</button>
                    <button className={styles.rjct}>&#10060;</button>
                </li>
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