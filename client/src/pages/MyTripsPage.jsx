import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./MyTripsPage.module.css";
import STATE_INFO from "../data/stateInfo";

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
            if (raw) setItems(JSON.parse(raw));
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
        setLoading(true);
        try {
            // For simplicity, create one booking per cart item using seats=[], server will accept it as a mock booking.
            for (const it of items) {
                // If the item represents a client-side example trip (id starts with "example-"), send a lightweight tripSnapshot
                const isExample = typeof it.id === 'string' && it.id.startsWith('example-');
                let tripSnapshot = undefined;
                if (isExample) {
                    const parts = (it.title || '').split(/→|—|-/).map(p => p.trim()).filter(Boolean);
                    const source = parts[0] || '';
                    const destination = parts[1] || '';
                    tripSnapshot = {
                        _id: it.id,
                        source,
                        destination,
                        date: new Date().toISOString(),
                        time: '',
                        price: it.price || 0,
                        totalSeats: 0,
                        bookedSeats: [],
                        imageUrl: ''
                    };
                }

                await API.post(
                    "/bookings",
                    {
                        tripId: it.id,
                        seats: [],
                        totalAmount: (it.price || 0) * (it.qty || 1),
                        ...(tripSnapshot ? { tripSnapshot } : {}),
                    },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
            }
            // Clear cart and navigate to My Bookings
            localStorage.removeItem(CART_KEY);
            setItems([]);
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
            <h1>{t('myTripsTitle')}</h1>
            {items.length === 0 ? (
                <p>{t('myTripsTitle')} list is empty. Add trips from the homepage or trip details.</p>
            ) : (
                <div>
                    <table className={styles.cartTable}>
                        <thead className={styles.cartThead}>
                            <tr>
                                <th>Trip</th>
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
                                        <img src={getThumbnail(it)} alt={it.title} className={styles.thumb} />
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{it.title}</div>
                                            <div className={styles.titleSmall}>{getSecondaryFromTitle(it.title)}</div>
                                        </div>
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
                                {loading ? t('loading') : t('bookTickets')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTripsPage;
