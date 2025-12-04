import React from 'react';
import styles from './CareersPage.module.css';

const CareersPage = () => {
  return (
    <div className={styles.container}>
      <h1>Careers at TripSee</h1>

      <p className={styles.lead}>
        We're building simple, delightful travel experiences. If you enjoy working
        on full-stack JavaScript projects, building reliable APIs, or creating
        polished user interfaces, we'd love to hear from you.
      </p>

      <section className={styles.section}>
        <h2>Open Positions</h2>
        <p>Currently there are no open positions posted. We're always happy to hear speculative applications.</p>
        <ul>
          <li>
            <strong>Frontend Engineer (React)</strong> — Work on the client UI and improve booking flows.
          </li>
          <li>
            <strong>Backend Engineer (Node.js)</strong> — Build APIs, improve data models and integrations.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Why join TripSee?</h2>
        <ul>
          <li>Small, focused codebase where your work has visible impact.</li>
          <li>Opportunity to design features end-to-end.</li>
          <li>Flexible collaboration and friendly code review culture.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>How to apply</h2>
        <p>
          Send your CV or a short note describing your experience to:
          <br />
          <a href="mailto:malavathakash123@gmail.com">malavathakash123@gmail.com</a>
        </p>
        <p>Please include a link to your GitHub or portfolio and a short message about why you'd like to join.</p>
      </section>

      <section className={styles.section}>
        <h2>Location</h2>
        <p>Remote-first. Office address (for local applicants): 835217 Khalgoan Housing Complex, Hotwar, Ranchi.</p>
      </section>
    </div>
  );
};

export default CareersPage;
