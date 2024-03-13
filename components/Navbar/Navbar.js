import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Novatrade</div>
      <ul className={styles.navMenu}>
        <li className={styles.navItem}>
          <Link href='/'>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href='/inexperienced'>Inexperienced Traders</Link>
        </li>
        <li className={styles.navItem}>
          <Link href='/experienced'>Experienced Traders</Link>
        </li>
        <li className={styles.navItem}>
          <Link href='/posts'>Posts</Link>
        </li>
        <li className={styles.navItem}>
          <Link href='/portfolio'>Portfolio</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
