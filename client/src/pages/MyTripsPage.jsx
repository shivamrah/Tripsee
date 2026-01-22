import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./MyTripsPage.module.css";
import STATE_INFO from "../data/stateInfo";
import Thumbnail from "../components/common/Thumbnail";

const CART_KEY = "tripCart";

const MyTripsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { t } = useContext(LocaleContext);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const raw = localStorage.getItem(CART_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                // normalize saved items: ensure imageUrl exists and packageState/day defaults exist
                const normalized = parsed.map((it, idx) => {
                    const primary = getPrimaryFromTitle(it.title || "");
                    const base = { packageState: it.packageState || primary || "", day: it.day || idx + 1 };
                    if (it.imageUrl || it.imagePath) return { ...it, ...base };
                    const meta = STATE_INFO[primary];
                    if (meta && meta.imagePath) return { ...it, imageUrl: meta.imagePath, ...base };
                    // fallback to unsplash search
                    const fallbackQuery = encodeURIComponent(it.title || primary || "india");
                    return { ...it, imageUrl: `https://source.unsplash.com/160x120/?${fallbackQuery}`, ...base };
                });
                setItems(normalized);
                // persist normalized entries so subsequent loads are immediate
                localStorage.setItem(CART_KEY, JSON.stringify(normalized));
            }
        } catch (e) {
            setItems([]);
        }
    }, []);

    const save = (next) => {
        setItems(next);
        localStorage.setItem(CART_KEY, JSON.stringify(next));
        // notify other components (navbar) about cart change
        window.dispatchEvent(new Event("tripCartUpdated"));
    };

    const updateQty = (id, qty) => {
        const next = items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
        save(next);
    };

    const removeItem = (id) => {
        const next = items.filter((it) => it.id !== id);
        // re-normalize day order after removal
        const renumbered = next.map((it, idx) => ({ ...it, day: idx + 1 }));
        save(renumbered);
    };

    const updateDay = (id, day) => {
        const sanitized = Math.max(1, Math.floor(day || 1));
        const next = items.map((it) => (it.id === id ? { ...it, day: sanitized } : it));
        save(next);
    };

    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

    const getPrimaryFromTitle = (title) => {
        if (!title) return "";
        // split on arrow or em-dash or hyphen
        const parts = title.split(/→|—|-/).map(p => p.trim()).filter(Boolean);
        return parts.length > 0 ? parts[0] : title;
    };

    const getSecondaryFromTitle = (title) => {
        if (!title) return "";
        const parts = title.split(/→|—|-/).map(p => p.trim()).filter(Boolean);
        return parts.length > 1 ? parts[1] : "";
    };

    const getThumbnail = (it) => {
        // If the saved item already contains an explicit image URL, prefer it
        if (it && (it.imageUrl || it.imagePath)) {
            return it.imageUrl || it.imagePath;
        }
        // try to derive a state or destination keyword for an image
        const primary = getPrimaryFromTitle(it.title || "");
        const meta = STATE_INFO[primary];
        if (meta && meta.imagePath) return meta.imagePath;
        if (meta && meta.imageQuery) return `https://source.unsplash.com/160x120/?${encodeURIComponent(meta.imageQuery)}`;
        // fallback to searching the title
        const fallbackQuery = encodeURIComponent(it.title || primary || "india");
        return `https://source.unsplash.com/160x120/?${fallbackQuery}`;
    };

    const handleBook = async () => {
        if (!user) return navigate("/login");
        if (items.length === 0) return;

        // Build a day-wise itinerary snapshot for potential use
        const itinerary = [...items]
            .sort((a, b) => (a.day || 0) - (b.day || 0))
            .map((it, idx) => ({
                day: it.day || idx + 1,
                title: it.title,
                tripId: it.id,
                price: it.price || 0,
                qty: it.qty || 1,
            }));

        setLoading(true);
        try {
            // Book one record per item (previous behavior), leaving room for seat selection later.
            for (const item of items) {
                const isExample = typeof item.id === 'string' && item.id.startsWith('example-');
                let tripSnapshot = undefined;
                if (isExample) {
                    const parts = (item.title || '').split(/→|—|-/).map(p => p.trim()).filter(Boolean);
                    const source = parts[0] || '';
                    const destination = parts[1] || '';
                    tripSnapshot = {
                        _id: item.id,
                        source,
                        destination,
                        date: new Date().toISOString(),
                        time: '',
                        price: item.price || 0,
                        totalSeats: 0,
                        bookedSeats: [],
                        imageUrl: ''
                    };
                }

                await API.post(
                    "/bookings",
                    {
                        tripId: item.id,
                        // Use a placeholder seat so the backend seat validator passes; real seat selection can follow in checkout.
                        seats: ["PKG-" + (item.day || 1)],
                        totalAmount: (item.price || 0) * (item.qty || 1),
                        itinerary,
                        ...(tripSnapshot ? { tripSnapshot } : {}),
                    },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
            }

            // Keep cart intact so user can manage remaining items later.
            navigate("/my-bookings");
        } catch (err) {
            console.error(err);
            alert("Booking failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>State Tour Package</h1>
            {items.length === 0 ? (
                <p>Package is empty. Add trips from the homepage or destination details.</p>
            ) : (
                <div>
                    <table className={styles.cartTable}>
                        <thead className={styles.cartThead}>
                            <tr>
                                <th>Trip</th>
                                <th>State</th>
                                <th>Day</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it) => (
                                <tr key={it.id} className={styles.cartRow}>
                                    <td className={styles.tripCell} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Thumbnail src={getThumbnail(it)} title={it.title} className={styles.thumb} />
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{it.title}</div>
                                            <div className={styles.titleSmall}>{getSecondaryFromTitle(it.title)}</div>
                                        </div>
                                    </td>
                                    <td className={styles.tripCell}>{it.packageState || getPrimaryFromTitle(it.title)}</td>
                                    <td className={styles.tripCell}>
                                        <input
                                            type="number"
                                            min={1}
                                            value={it.day || 1}
                                            onChange={(e) => updateDay(it.id, Number(e.target.value))}
                                            className={styles.qtyInput}
                                        />
                                    </td>
                                    <td className={styles.tripCell}>${(it.price || 0).toFixed(2)}</td>
                                    <td className={styles.tripCell}>
                                        <input
                                            type="number"
                                            min={1}
                                            value={it.qty}
                                            onChange={(e) => updateQty(it.id, Number(e.target.value))}
                                            className={styles.qtyInput}
                                        />
                                    </td>
                                    <td className={styles.tripCell}>${((it.price || 0) * (it.qty || 1)).toFixed(2)}</td>
                                    <td className={styles.tripCell}>
                                        <button className={styles.removeBtn} onClick={() => removeItem(it.id)}>{t('remove')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.cartFooter}>
                        <div className={styles.totalText}>{t('total')}: ${total.toFixed(2)}</div>
                        <div>
                            <button onClick={handleBook} disabled={loading} className={styles.bookBtn}>
                                {loading ? t('loading') : 'Book Package'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTripsPage;
