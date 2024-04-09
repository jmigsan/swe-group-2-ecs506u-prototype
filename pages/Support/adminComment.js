import React from 'react';
import styles from '@/styles/support.module.css';
import { useEffect, useRef } from 'react';

const adminComment = ({ adminComments, setAdminComments, handleConfirmChange, onClose }) => {
    const textareaRef = useRef(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [adminComments]);

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>

                <div className={styles.modalHeader}>

                    <button className={styles.closeButton} onClick={onClose}>
                        <img className={styles.ticketButtonImage}
                             src="/images/close.png"
                             alt="Add Ticket"/>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <label className={styles.inputLabel}>Outcome Notes</label>
                    <textarea
                        ref={textareaRef}
                        className={styles.input}
                        type="text"
                        placeholder="Enter comments"
                        onChange={(e) => setAdminComments(e.target.value)}
                        value={adminComments}

                    />
                </div>

                <div className={styles.modalFooter}>
                    <button
                        className={styles.submitButton}
                        onClick={() => handleConfirmChange()}
                    >
                        Confirm
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default adminComment;