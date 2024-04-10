import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/post.module.css';
import e from 'cors';

Modal.setAppElement('#__next');

const EditModal = ({ isOpen, onClose, postID,postContent }) => {
  const [editPostValue, setEditPostValue] = useState(postContent);
    
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      
        const res = await fetch('../api/feed/editPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postID:postID,
              post: editPostValue            
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
      
      }  
    onClose();
  };


  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Post Modal"
      overlayClassName={styles.modalOverlay}
      className={styles.modalContent}
    >

    <div className={styles.postMessage}>
        <form onSubmit={handleSubmit} className={styles.postForm}>
          <div className={styles.textContainer}>
              <label className={styles.textLabel}>Edit Post</label>
              <textarea type="text" 
                value={editPostValue}
              onChange={(e) => setEditPostValue(e.target.value)}
              className={styles.textBox} 
              rows={5}
              wrap='soft'/>
          </div>
          <input 
          type="submit" 
          value="Post"
          onChange={(e) => setEditPostValue(e.target.value)}
          className={styles.postButton}/>
        </form>
      </div>

     
      
    </Modal>
  );
};

export default EditModal;