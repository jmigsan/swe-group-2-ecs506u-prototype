import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/post.module.css';

Modal.setAppElement('#__next');

const PostModal = ({ isOpen, onClose }) => {
  const [addPostValue, setAddPostValue] = useState('');

  const handleSubmit = async () => {
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
    onClose();
  };


  const handleAddPost = async ()=>{
    
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Post Modal"
      overlayClassName={styles.modalOverlay}
      className={styles.modalContent}
    >

    <div className={styles.postMessage}>
        <form onSubmit={handleAddPost} className={styles.postForm}>
          <div className={styles.textContainer}>
              <label className={styles.textLabel}>Create Post</label>
              <textarea type="text" 
               
              onChange={(e) => setAddPostValue(e.target.value)}
              className={styles.textBox} 
              rows={5}
              wrap='soft'/>
          </div>
          <input 
          type="submit" 
          value="Post"
          onChange={(e) => setAddPostValue(e.target.value)}
          className={styles.postButton}/>
        </form>
      </div>

     
      
    </Modal>
  );
};

export default PostModal;