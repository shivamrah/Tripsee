import React, { useContext } from 'react';
import styles from './PrivacyPolicyPage.module.css';
import { LocaleContext } from '../context/LocaleContext';

const PrivacyPolicyPage = () => {
  const { t } = useContext(LocaleContext);
  return (
    <div className={styles.container}>
      <h1>{t('privacyTitle')}</h1>

      <p className={styles.lead}>{t('privacyLead')}</p>

      <section className={styles.section}>
        <h2>{t('informationWeCollect') || 'Information we collect'}</h2>
        <p>{t('weMayCollect') || 'We may collect the following information when you use our service:'}</p>
        <ul>
          <li>{t('accountDetails') || 'Account details such as name, email and password when you register.'}</li>
          <li>{t('privacyList1')}</li>
          <li>{t('usageData') || 'Usage data such as pages visited, searches and interactions to improve the product.'}</li>
          <li>{t('deviceInfo') || 'Device and technical information (browser, IP address) to provide and secure the service.'}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('howWeUse') || 'How we use your information'}</h2>
        <ul>
          <li>{t('privacyList2')}</li>
          <li>{t('authenticateUsers') || 'To authenticate users and maintain account security.'}</li>
          <li>{t('communicateBooking') || 'To communicate booking confirmations, updates and customer support messages.'}</li>
          <li>{t('analyzeService') || 'To analyze and improve the service, prevent fraud, and enforce our policies.'}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('sharingAndDisclosures') || 'Sharing and disclosures'}</h2>
        <p>
          {t('weDoNotSell') || 'We do not sell your personal information.'} {t('mayShareWithProviders') || 'We may share information with service providers (for payments, email delivery, hosting, analytics) and as required by law.'}
        </p>
      </section>

      <section className={styles.section}>
        <h2>{t('cookiesAndTracking') || 'Cookies and tracking'}</h2>
        <p>
          {t('cookiesUse') || 'We use cookies and similar technologies to provide core functionality, remember preferences, and measure site usage.'}
        </p>
      </section>

      <section className={styles.section}>
        <h2>{t('dataSecurity') || 'Data security'}</h2>
        <p>
          {t('dataSecurityText') || 'We implement reasonable technical and organizational measures to help protect your data.'}
        </p>
      </section>

      <section className={styles.section}>
        <h2>{t('contactTitle')}</h2>
        <p>
          {t('privacyContactHint') || 'For privacy inquiries or to request deletion of your data, contact us at:'}
          <br />
          <a href="mailto:malavathakash123@gmail.com">malavathakash123@gmail.com</a>
        </p>
      </section>

      <section className={styles.section}>
        <h2>{t('changesToPolicy') || 'Changes to this policy'}</h2>
        <p>{t('policyUpdates') || 'We may update this policy from time to time. The effective date will be updated at the top of the page when changes are made.'}</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
