import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../components/common/Modal';
import styles from './AdminDashboardPage.module.css';
import API from '../../api';
import { LocaleContext } from '../../context/LocaleContext';

const EditBookingModal = ({ isOpen, onClose, booking, onSaved }) => {
  const [seats, setSeats] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) {
      setSeats(Array.isArray(booking.seats) ? booking.seats.join(', ') : (booking.seats || ''));
      setTotalAmount(booking.totalAmount || '');
      setTravelDate(booking.travelDate ? new Date(booking.travelDate).toISOString().slice(0, 10) : (booking.tripInfo && booking.tripInfo.date ? new Date(booking.tripInfo.date).toISOString().slice(0, 10) : ''));
      setFromLocation(booking.fromLocation || (booking.tripInfo && (booking.tripInfo.source || booking.tripInfo.title)) || '');
    }
  }, [booking]);

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      const payload = {
        seats: seats.split(',').map(s => s.trim()).filter(Boolean),
        totalAmount: Number(totalAmount) || 0,
        travelDate: travelDate || undefined,
        fromLocation: fromLocation || undefined,
      };
      const { data } = await API.put(`/bookings/${booking._id}`, payload);
      onSaved && onSaved(data);
      onClose();
    } catch (err) {
      console.error('Failed to save booking', err);
      const { t } = useContext(LocaleContext);
      alert(t('failedToSaveBooking') || 'Failed to save booking. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ maxWidth: 640 }}>
        <h2>{`Edit Booking #${booking._id && booking._id.slice(-6).toUpperCase()}`}</h2>
        <div className={styles.formRow}>
          <label>{useContext(LocaleContext).t('seatsCommaHint')}</label>
          <input className={styles.input} value={seats} onChange={(e) => setSeats(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label>{useContext(LocaleContext).t('totalAmountLabel')}</label>
          <input className={styles.input} value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label>{useContext(LocaleContext).t('travelDateLabel')}</label>
          <input type="date" className={styles.input} value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label>{useContext(LocaleContext).t('fromLocationLabel')}</label>
          <input className={styles.input} value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button className={styles.cancel} onClick={onClose} disabled={saving}>{useContext(LocaleContext).t('cancel')}</button>
          <button className={styles.proceed} onClick={handleSave} disabled={saving}>{saving ? useContext(LocaleContext).t('saving') : useContext(LocaleContext).t('save')}</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBookingModal;
