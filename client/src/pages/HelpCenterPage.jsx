import React, { useContext } from 'react';
import styles from './HelpCenterPage.module.css';
import { LocaleContext } from '../context/LocaleContext';

const HelpCenterPage = () => {
  const { t } = useContext(LocaleContext);
  return (
    <div className={styles.container}>
      <h1>{t('helpCenter')}</h1>
      <p>{t('helpIntro') || 'If you need assistance, we are here to help. Below are the best ways to reach us.'}</p>

      <section className={styles.card} id="contact">
        <h2>{t('contactSupport') || 'Contact Support'}</h2>
        <p>
          Email: <a href="mailto:malavathakash123@gmail.com">malavathakash123@gmail.com</a>
          <br />
          Phone: <a href="tel:+918374639557">+91 83746 39557</a>
        </p>
        <p>{t('helpResponseTime')}</p>
      </section>

      <section className={styles.card}>
        <h2>{t('company') || 'Company'}</h2>
        <p>{t('helpSupportTitle')}</p>
        <p>
          {t('addressLabel') || 'Address:'}<br />
          835217 Khalgoan Housing Complex<br />
          Hotwar, Ranchi
        </p>
      </section>

      <section className={styles.card}>
        <h2>{t('resources') || 'Resources'}</h2>
        <p>{t('helpContactHint')}</p>
      </section>
    </div>
  );
};

export default HelpCenterPage;
