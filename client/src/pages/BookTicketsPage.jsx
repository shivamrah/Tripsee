import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import styles from "./BookTicketsPage.module.css";

// Minimal list of Indian cities for the search/list. Can be extended later.
const INDIAN_CITIES = [
    "New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad",
    "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Ranchi", "Howrah", "Coimbatore",
    "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati",
    "Chandigarh", "Solapur", "Mysore", "Tiruchirappalli"
];

const BookTicketsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passed = location.state || {};
    const tripId = passed.tripId;
    const tripPassed = passed.trip || null;

    const [trip, setTrip] = useState(tripPassed);
    const [query, setQuery] = useState("");
    const [cities, setCities] = useState(INDIAN_CITIES);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFrom, setSelectedFrom] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!trip && tripId) {
            API.get(`/trips/${tripId}`).then((res) => setTrip(res.data)).catch(() => { });
        }
    }, [tripId]);

    useEffect(() => setCities(INDIAN_CITIES), []);

    // Debounced search against Nominatim to get any place in India
    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const q = encodeURIComponent(`${query} India`);
                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=12&countrycodes=in&q=${q}&addressdetails=0&accept-language=en`;
                const resp = await fetch(url, { headers: { 'User-Agent': 'TripSee/1.0 (+https://example.com)' } });
                const json = await resp.json();
                if (cancelled) return;
                const mapped = json.map((r) => ({ name: r.display_name, value: r.display_name }));
                setResults(mapped);
            } catch (e) {
                setResults([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 350);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [query]);

    const filtered = results.length > 0 ? results.map((r) => r.value) : cities.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));

    const formatPrice = (base, i) => {
        const offset = ((i % 6) + 1) * 200; // deterministic offset
        const price = (base || 5000) + offset;
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
    };

    const handleProceed = () => {
        setError("");
        if (!selectedFrom) {
            setError("Please choose a departure city from the list or using search.");
            return;
        }
        if (!trip) {
            setError("Trip information not available.");
            return;
        }
        // validate date
        if (!selectedDate) {
            setError("Please choose a travel date before proceeding.");
            return;
        }
        const picked = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (picked < today) {
            setError("Travel date cannot be in the past.");
            return;
        }
        navigate(`/trip/${trip._id}`, { state: { focusDate: true, selectedFrom, selectedDate } });
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.modalCard}>
                <h2>Choose departure for {trip ? `${trip.source} — ${trip.destination}` : "selected trip"}</h2>

                <div className={styles.contentRow}>
                    <div className={styles.leftColumn}>
                        <div className={styles.searchRow}>
                            <input
                                className={styles.searchInput}
                                placeholder="Search city (all India)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <ul className={styles.cityList}>
                            {loading && <li className={styles.noResult}>Searching...</li>}
                            {!loading && filtered.length === 0 && <li className={styles.noResult}>No results</li>}
                            {!loading && filtered.map((c, i) => (
                                <li key={c + i} className={styles.cityRow}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="fromCity"
                                            value={c}
                                            checked={selectedFrom === c}
                                            onChange={() => setSelectedFrom(c)}
                                        />
                                        <span className={styles.cityName}>{c}</span>
                                    </label>
                                    <span className={styles.cityPrice}>{formatPrice(trip?.price, i)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.rightColumn}>
                        <div style={{ width: '100%' }}>
                            <div style={{ marginBottom: 12 }}>
                                <label className={styles.label} style={{ display: 'block', marginBottom: 6 }}>Travel Date</label>
                                <input type="date" className={styles.input} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
                            </div>
                            <div className={styles.actionsArea}>
                                <button className={styles.cancel} onClick={() => navigate(-1)}>Cancel</button>
                                <button className={styles.proceed} onClick={handleProceed}>Book Bus Tickets from Selected Location</button>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
};

export default BookTicketsPage;
