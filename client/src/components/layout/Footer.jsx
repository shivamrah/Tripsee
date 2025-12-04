import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/help#contact">Contact</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()} TripSee All rights
            reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
