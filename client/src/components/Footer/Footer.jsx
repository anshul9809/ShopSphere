import React from 'react';
import styles from "./footer.module.scss";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} ShopSphere. All rights reserved.</p>
    </footer>
  );
}

export default Footer;