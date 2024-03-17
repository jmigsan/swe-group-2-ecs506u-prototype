import React from 'react';
import styles from './SorryReloadPage.module.css';

const SorryReloadPage = ({ errorCode }) => {
  const reloadPage = () => {
    window.location.reload();
  };

  let errorMessage = '';

  if (errorCode === 429) {
    errorMessage =
      "CoinGecko's servers seem to be overloaded! Refresh the page and try again later.";
  } else {
    errorMessage =
      'There seems to be an error! Refresh the page and try again.';
  }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.modalContent}>
        <div className={styles.textContainer}>
          <h2>Error!</h2>
          <p>{errorMessage}</p>
        </div>
        <button className={styles.errorButton} onClick={reloadPage}>
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default SorryReloadPage;
