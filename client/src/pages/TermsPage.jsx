import React from 'react';
import styles from './TermsPage.module.css';

const TermsPage = () => {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>

      <p className={styles.lead}>
        These Terms of Service govern your use of TripSee. By using our service you agree to these terms.
      </p>

      <section className={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using TripSee you accept and agree to be bound by these Terms and our Privacy Policy.</p>
      </section>

      <section className={styles.section}>
        <h2>2. Use of Service</h2>
        <p>You may use the service for lawful personal or business purposes. You agree not to misuse the service or interfere with its operation.</p>
      </section>

      <section className={styles.section}>
        <h2>3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </section>

      <section className={styles.section}>
        <h2>4. Payments and Refunds</h2>
        <p>Payment processing is handled by third-party providers. Refunds are subject to the booking and provider policies; contact support for assistance.</p>
      </section>

      <section className={styles.section}>
        <h2>5. Intellectual Property</h2>
        <p>All content on TripSee is protected by copyright and other laws. You may not reproduce or distribute content without permission.</p>
      </section>

      <section className={styles.section}>
        <h2>6. Limitation of Liability</h2>
        <p>To the extent permitted by law, TripSee and its affiliates are not liable for indirect or consequential damages arising from your use of the service.</p>
      </section>

      <section className={styles.section}>
        <h2>7. Governing Law</h2>
        <p>These Terms are governed by the laws applicable to the service operator's jurisdiction.</p>
      </section>

      <section className={styles.section}>
        <h2>8. Contact</h2>
        <p>Questions about these Terms can be sent to <a href="mailto:malavathakash123@gmail.com">malavathakash123@gmail.com</a>.</p>
      </section>
    </div>
  );
};

export default TermsPage;
