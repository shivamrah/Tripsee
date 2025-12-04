import React, { useContext } from 'react';
import styles from './AboutPage.module.css';
import { LocaleContext } from '../context/LocaleContext';

const AboutPage = () => {
  const { t } = useContext(LocaleContext);

  return (
    <div className={styles.container}>
      <h1>{t('aboutTitle')}</h1>
      <p className={styles.lead}>{t('aboutIntro')}</p>

      <section className={styles.section}>
        <h2>{t('whatThisProject')}</h2>
        <ul>
          <li>{t('aboutFeature1')}</li>
          <li>{t('aboutFeature2')}</li>
          <li>{t('aboutFeature3')}</li>
          <li>{t('aboutFeature4')}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('techStackTitle')}</h2>
        <p>{t('techStackText')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('whyTitle')}</h2>
        <p>{t('whyText')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('contactTitle')}</h2>
        <p>{t('contactHelpLinkText')} <a href="/help">{t('helpCenter') || 'Help Center'}</a>.</p>
      </section>
    </div>
  );
};

export default AboutPage;
