import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./TripCard.module.css";
import STATE_INFO from "../../data/stateInfo";
import { LocaleContext } from "../../context/LocaleContext";

const TripCard = ({ trip }) => {
  const { t } = useContext(LocaleContext);

  const tripDate = new Date(trip.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Prefer trip.imageUrl, otherwise try to use a mapped state image query and description.
  const stateKey = trip.source || trip.destination || "";
  const stateMeta = STATE_INFO[stateKey];
  const imageSrc =
    trip.imageUrl && trip.imageUrl.length > 0
      ? trip.imageUrl
      : stateMeta && stateMeta.imagePath
        ? stateMeta.imagePath
        : stateMeta
          ? `https://source.unsplash.com/800x600/?${encodeURIComponent(
            stateMeta.imageQuery
          )}`
          : `https://source.unsplash.com/800x600/?${encodeURIComponent(
            trip.source || trip.destination || "india"
          )}`;

  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={`Trip: ${trip.source} to ${trip.destination}`} className={styles.cardImage} />
      <div className={styles.cardBody}>
        <div className={styles.tripInfo}>
          <h3 className={styles.tripTitle}>
            {trip.source} to {trip.destination}
          </h3>
          <p className={styles.tripDate}>{tripDate}</p>
          {stateMeta && (
            <>
              <p className={styles.cityInfo}>{stateMeta.description}</p>
              {stateMeta.attractions && stateMeta.attractions.length > 0 && (
                <ul className={styles.attractions}>
                  {stateMeta.attractions.slice(0, 3).map((a) => (
                    <li key={a.name} className={styles.attractionItem}>
                      {a.name} — <span className={styles.priceBadge}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a.price + 5000)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
        <div className={styles.priceSection}>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to={`/book-tickets`} state={{ tripId: trip._id, trip }} className={styles.bookButton}>
              Book Tickets
            </Link>
            <button
              className={styles.addButton}
              onClick={() => {
                try {
                  const raw = localStorage.getItem("tripCart");
                  const cart = raw ? JSON.parse(raw) : [];
                  const existing = cart.find((c) => c.id === trip._id);
                  if (existing) {
                    existing.qty = (existing.qty || 1) + 1;
                  } else {
                    cart.push({ id: trip._id, title: `${trip.source} → ${trip.destination}`, price: trip.price || 0, qty: 1, savedAt: new Date().toISOString() });
                  }
                  localStorage.setItem("tripCart", JSON.stringify(cart));
                  localStorage.setItem("tripCart", JSON.stringify(cart));
                  // dispatch custom event so navbar badge updates immediately in this tab
                  window.dispatchEvent(new Event("tripCartUpdated"));
                  alert(t('addToMyTrips'));
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {t('addToMyTripsBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
