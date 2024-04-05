import React from 'react';
import styles from '@/styles/support.module.css';

const adminComment = ({ adminComments, setAdminComments, handleConfirmChange, onClose }) => {
    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>

                <textarea
                    className={styles.input}
                    type="text"
                    placeholder="Enter comments"
                    onChange={(e) => setAdminComments(e.target.value)}
                    value={adminComments}
                />
                <button onClick={onClose}>Go Back</button>
                <button
                    className={styles.button}
                    onClick={() => handleConfirmChange()}
                >
                    Confirm
                </button>

            </div>
        </div>
    );
};

export default adminComment;