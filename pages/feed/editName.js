import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/post.module.css';
import e from 'cors';

Modal.setAppElement('#__next');

const EditNameModal = ({ isOpen, onClose, userEmail,name }) => {

  const [editNameValue, setEditNameValue] = useState(name);
  
    
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      
        const res = await fetch('../api/feed/editName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail:userEmail,
              name:editNameValue        
            }),
            
        });
  
        if (res.ok) {
          const data = await res.json();
          window.location.reload();

 
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
              <label className={styles.textLabel}>Change Name</label>
              <textarea type="text" 
                value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              className={styles.textBox} 
              rows={5}
              wrap='soft'/>
          </div>
          <input 
          type="submit" 
          value="Change"
          onChange={(e) => setEditNameValue(e.target.value)}
          className={styles.postButton}/>
        </form>
      </div>

     
      
    </Modal>
  );
};

export default EditNameModal;