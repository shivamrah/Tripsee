import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import STATE_INFO from "../data/stateInfo";
import styles from "./StatePlacesPage.module.css";
import { LocaleContext } from "../context/LocaleContext";

const sanitize = (s) =>
    s
        .toString()
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_|_$/g, "");

const PlacesPage = () => {
    const { state } = useParams();
    const decoded = decodeURIComponent(state).replace(/_/g, " ");
    const meta = STATE_INFO[decoded];

    const { t } = useContext(LocaleContext);
    if (!meta) return <p style={{ padding: 20 }}>{t('noData')} "{decoded}"</p>;

    const attractions = meta.attractions || [];

    const navigate = useNavigate();

    const AttractionCard = ({ a }) => {
        const localPath = `/attraction-images/${sanitize(decoded)}_${sanitize(a.name)}.svg`;
        const unsplashSrc = `https://source.unsplash.com/800x600/?${encodeURIComponent(
            decoded + " " + a.name
        )}`;

        const [src, setSrc] = useState(localPath);
        const [usedUnsplash, setUsedUnsplash] = useState(false);

        const handleError = () => {
            if (!usedUnsplash) {
                // try Unsplash once
                setUsedUnsplash(true);
                setSrc(unsplashSrc);
            } else {
                // final fallback
                setUsedUnsplash(false);
                setSrc("/attraction-images/placeholder.svg");
            }
        };

        const handleBook = () => {
            // store desired filters and navigate to home where HomePage will pick them up
            try {
                const displayPrice = a.price + 5000; // user requested adding 5000 INR to price
                localStorage.setItem(
                    "tripSearchFilters",
                    JSON.stringify({ source: decoded, destination: a.name, price: displayPrice })
                );
            } catch (e) {
                // ignore storage errors
            }
            navigate("/");
        };

        const handleAddToMyTrips = () => {
            try {
                const cartRaw = localStorage.getItem("tripCart");
                const cart = cartRaw ? JSON.parse(cartRaw) : [];
                const id = `example-${sanitize(decoded)}-${sanitize(a.name)}`;
                const existing = cart.find((c) => c.id === id);
                const displayPrice = a.price + 5000;
                if (existing) {
                    existing.qty = (existing.qty || 1) + 1;
                    existing.savedAt = new Date().toISOString();
                } else {
                    cart.push({ id, title: `${decoded} — ${a.name}`, price: displayPrice, qty: 1, savedAt: new Date().toISOString() });
                }
                localStorage.setItem("tripCart", JSON.stringify(cart));
                localStorage.setItem("tripCart", JSON.stringify(cart));
                window.dispatchEvent(new Event("tripCartUpdated"));
                alert("Added to My Trips");
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <div className={styles.card}>
                <img
                    src={src}
                    alt={a.name}
                    className={styles.image}
                    onError={handleError}
                />
                <div className={styles.body}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0 }}>{a.name}</h3>
                        <div className={styles.actions}>
                            <button className={styles.bookBtn} onClick={handleBook} aria-label={`Book trip to ${a.name}`}>
                                {t('bookNow')}
                            </button>
                            <button className={styles.addBtn} onClick={handleAddToMyTrips} aria-label={`Add ${a.name} to My Trips`} style={{ marginLeft: 8 }}>
                                {t('addToMyTripsBtn')}
                            </button>
                        </div>
                    </div>
                    <p className={styles.priceBadge}>
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a.price + 5000)} {t('perPerson')}
                    </p>
                    {usedUnsplash && (
                        <p className={styles.attribution}>
                            Image: <a href={`https://unsplash.com/s/photos/${encodeURIComponent(decoded + " " + a.name)}`} target="_blank" rel="noopener noreferrer">Unsplash</a>
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <h1>{decoded} — {t('bookNow')}</h1>
            <p className={styles.subtitle}>{meta.description}</p>

            <div className={styles.grid}>
                {attractions.map((aObj) => (
                    <AttractionCard key={aObj.name} a={aObj} />
                ))}
            </div>
        </div>
    );
};

export default PlacesPage;
