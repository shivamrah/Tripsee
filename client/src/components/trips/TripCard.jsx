import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "../../pages/StatePlacesPage.module.css";
import STATE_INFO from "../../data/stateInfo";
import { LocaleContext } from "../../context/LocaleContext";
import { AuthContext } from "../../context/AuthContext";
import SuccessModal from "../common/SuccessModal";
import Modal from "../common/Modal";

const TripCard = ({ trip }) => {
  const { t, locale, formatCurrency } = useContext(LocaleContext);
  const { user } = useContext(AuthContext);
  const [showInfo, setShowInfo] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const dateLocaleTag = locale === 'en' ? 'en-IN' : `${locale}-IN`;
  const tripDate = new Date(trip.date).toLocaleDateString(dateLocaleTag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use the trip's own description and state information
  const stateInfo = STATE_INFO[trip.state];
  const description = trip.description || `Explore this amazing trip to ${trip.destination}`;

  const imageSrc =
    trip.imageUrl && trip.imageUrl.length > 0
      ? trip.imageUrl
      : stateInfo && stateInfo.imagePath
        ? stateInfo.imagePath
        : `https://source.unsplash.com/800x600/?${encodeURIComponent(
          trip.destination || trip.state || "india"
        )}`;

  const handleDeleteTrip = () => {
    console.log('Delete button clicked');
    console.log('User:', user);
    console.log('User role:', user?.role);

    if (!user) {
      console.log('No user logged in');
      setShowErrorModal(true);
      return;
    }

    if (user.role !== 'admin') {
      console.log('User is not admin');
      setShowErrorModal(true);
      return;
    }

    // Admin delete logic would go here
    console.log('User is admin, showing confirmation');
    if (window.confirm('Are you sure you want to delete this trip?')) {
      // Call API to delete trip
      console.log('Delete trip:', trip._id);
    }
  };

  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={`Trip: ${trip.placeName}`} className={styles.image} />
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{trip.placeName}</h3>
        <p className={styles.priceBadge}>{formatCurrency(trip.tripCost, { maximumFractionDigits: 0 })} {t('perPerson') || 'per Person'}</p>
        <div className={styles.actions}>
          <button
            className={styles.infoBtn}
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? 'Hide' : (t('info') || 'Info')}
          </button>
          <button
            className={styles.addBtn}
            onClick={() => {
              try {
                const raw = localStorage.getItem("tripCart");
                const cart = raw ? JSON.parse(raw) : [];
                const existing = cart.find((c) => c.id === trip._id);
                if (existing) {
                  existing.qty = (existing.qty || 1) + 1;
                } else {
                  // include imageUrl so thumbnails show for saved trips
                  cart.push({
                    id: trip._id,
                    title: `${trip.placeName} - ${trip.destination}`,
                    price: trip.tripCost || 0,
                    qty: 1,
                    savedAt: new Date().toISOString(),
                    imageUrl: imageSrc,
                    packageState: trip.state || "",
                    day: cart.length + 1
                  });
                }
                localStorage.setItem("tripCart", JSON.stringify(cart));
                // dispatch custom event so navbar badge updates immediately in this tab
                window.dispatchEvent(new Event("tripCartUpdated"));
                setShowSuccessModal(true);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            {t('addToPackageBtn') || 'Add to Package'}
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDeleteTrip}
            aria-label="Delete trip"
            title={user && user.role === 'admin' ? 'Delete trip' : 'Only admins can delete'}
          >
            🗑️ Delete
          </button>
        </div>
        {showInfo && (
          <div className={styles.infoSection}>
            <button
              className={styles.closeButton}
              onClick={() => setShowInfo(false)}
              aria-label="Close info"
            >
              ✕
            </button>
            <div className={styles.infoContent}>
              <p className={styles.infoDescription}>{description}</p>

              <div className={styles.infoDetailsGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>� Date:</span>
                  <span className={styles.infoValue}>{tripDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>⏰ Time:</span>
                  <span className={styles.infoValue}>{trip.time}</span>
                </div>
              </div>

              <div className={styles.infoDetailsGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>💰 Cost:</span>
                  <span className={styles.infoValue}>{formatCurrency(trip.tripCost)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>👥 Seats:</span>
                  <span className={styles.infoValue}>{trip.totalSeats} available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showErrorModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)"
          }}>
            <h2 style={{ color: "#ef4444", marginBottom: "15px", fontSize: "1.5rem", margin: "0 0 15px 0" }}>⛔ Access Denied</h2>
            <p style={{ fontSize: "16px", color: "#374151", marginBottom: "20px", margin: "0 0 20px 0", lineHeight: "1.6" }}>
              Only administrators can delete trips. Please contact an admin if you need to remove this trip.
            </p>
            <button
              onClick={() => {
                console.log('Closing error modal');
                setShowErrorModal(false);
              }}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#2563eb"}
              onMouseLeave={(e) => e.target.style.background = "#3b82f6"}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      <Modal isOpen={false} onClose={() => { }}></Modal>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('success') || "Success!"}
        message={t('addedToPackage') || "Added to package"}
      />
    </div>
  );
};

export default TripCard;
