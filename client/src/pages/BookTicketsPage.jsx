import React, { useState, useEffect, useContext, useMemo } from "react";
import { LocaleContext } from "../context/LocaleContext";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import STATE_INFO from "../data/stateInfo";
import styles from "./BookTicketsPage.module.css";

const BookTicketsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passed = location.state || {};
    const tripId = passed.tripId;
    const tripPassed = passed.trip || null;

    const [trip, setTrip] = useState(tripPassed);
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(true); // default to open so all states show immediately
    const stateNames = useMemo(() => Object.keys(STATE_INFO).sort(), []);
    const [selectedFrom, setSelectedFrom] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState("");

    // Day-wise booking state
    const [selectedDay1Places, setSelectedDay1Places] = useState([]);
    const [selectedDay2Places, setSelectedDay2Places] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [dayWiseMode, setDayWiseMode] = useState(false);

    useEffect(() => {
        if (!trip && tripId) {
            API.get(`/trips/${tripId}`).then((res) => setTrip(res.data)).catch(() => { });
        }
    }, [tripId]);

    // Load attractions from state metadata
    useEffect(() => {
        if (trip && trip.state) {
            const stateMeta = STATE_INFO[trip.state];
            if (stateMeta && stateMeta.attractions) {
                setAttractions(stateMeta.attractions);
            }
        }
    }, [trip]);

    const filtered = stateNames.filter((stateName) => {
        const q = query.trim().toLowerCase();
        if (!q) return true; // show all states when no query
        return stateName.toLowerCase().startsWith(q);
    });
    const showList = showDropdown || query.trim().length > 0;

    const { formatCurrency, t } = useContext(LocaleContext);
    const formatPrice = (base, i) => {
        const offset = ((i % 6) + 1) * 200; // deterministic offset
        const price = (base || 5000) + offset;
        return formatCurrency(price);
    };

    const toggleDay1Place = (place) => {
        setSelectedDay1Places(prev => {
            if (prev.includes(place)) {
                return prev.filter(p => p !== place);
            } else {
                if (prev.length >= 2) {
                    return [prev[1], place];
                }
                return [...prev, place];
            }
        });
    };

    const toggleDay2Place = (place) => {
        setSelectedDay2Places(prev => {
            if (prev.includes(place)) {
                return prev.filter(p => p !== place);
            } else {
                if (prev.length >= 2) {
                    return [prev[1], place];
                }
                return [...prev, place];
            }
        });
    };

    const handleProceed = () => {
        setError("");

        if (dayWiseMode) {
            // Day-wise booking validation
            if (!selectedFrom) {
                setError(t('pleaseSelectDeparture'));
                return;
            }
            if (!selectedDate) {
                setError(t('pleaseChooseTravelDate'));
                return;
            }
            if (selectedDay1Places.length !== 2) {
                setError("Please select exactly 2 places for Day 1");
                return;
            }
            if (selectedDay2Places.length !== 2) {
                setError("Please select exactly 2 places for Day 2");
                return;
            }

            const picked = new Date(selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (picked < today) {
                setError("Travel date cannot be in the past.");
                return;
            }

            // Proceed with day-wise booking data
            navigate(`/trip/${trip._id}`, {
                state: {
                    focusDate: true,
                    selectedFrom,
                    selectedDate,
                    dayWiseBooking: true,
                    day1Places: selectedDay1Places,
                    day2Places: selectedDay2Places
                }
            });
        } else {
            // Original booking flow
            if (!selectedFrom) {
                setError(t('pleaseSelectDeparture'));
                return;
            }
            if (!trip) {
                setError(t('tripInfoNotAvailable'));
                return;
            }
            if (!selectedDate) {
                setError(t('pleaseChooseTravelDate'));
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
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.modalCard}>
                <h2>{t('chooseDepartureTitle')} for {trip ? `${trip.placeName} - ${trip.destination}` : t('selectedTrip') || "selected trip"}</h2>

                {/* Booking Mode Toggle */}
                <div className={styles.modeToggle}>
                    <button
                        className={`${styles.modeBtn} ${!dayWiseMode ? styles.active : ''}`}
                        onClick={() => {
                            setDayWiseMode(false);
                            setSelectedDay1Places([]);
                            setSelectedDay2Places([]);
                        }}
                    >
                        Standard Booking
                    </button>
                    {attractions.length >= 4 && (
                        <button
                            className={`${styles.modeBtn} ${dayWiseMode ? styles.active : ''}`}
                            onClick={() => setDayWiseMode(true)}
                        >
                            Day-wise Booking (2+2)
                        </button>
                    )}
                </div>

                <div className={styles.contentRow}>
                    <div className={styles.leftColumn}>
                        {!dayWiseMode ? (
                            <>
                                <div className={styles.searchRow}>
                                    <input
                                        className={styles.searchInput}
                                        placeholder={t('searchCityPlaceholder')}
                                        value={query}
                                        onFocus={() => setShowDropdown(true)}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>

                                {showList && (
                                    <ul className={styles.cityList}>
                                        {filtered.length === 0 && <li className={styles.noResult}>{t('noResults')}</li>}
                                        {filtered.map((c, i) => (
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
                                )}
                            </>
                        ) : (
                            <div className={styles.dayWiseContainer}>
                                <h3 className={styles.dayTitle}>📅 Day 1 - Select 2 Places</h3>
                                <div className={styles.placesGrid}>
                                    {attractions.slice(0, Math.ceil(attractions.length / 2)).map((attr) => (
                                        <label key={attr.name} className={styles.placeOption}>
                                            <input
                                                type="checkbox"
                                                checked={selectedDay1Places.includes(attr.name)}
                                                onChange={() => toggleDay1Place(attr.name)}
                                            />
                                            <span className={styles.placeName}>{attr.name}</span>
                                            <span className={styles.placePrice}>{formatCurrency(attr.price + 5000, { maximumFractionDigits: 0 })}</span>
                                        </label>
                                    ))}
                                </div>

                                <h3 className={styles.dayTitle}>📅 Day 2 - Select 2 Places</h3>
                                <div className={styles.placesGrid}>
                                    {attractions.slice(Math.ceil(attractions.length / 2)).map((attr) => (
                                        <label key={attr.name} className={styles.placeOption}>
                                            <input
                                                type="checkbox"
                                                checked={selectedDay2Places.includes(attr.name)}
                                                onChange={() => toggleDay2Place(attr.name)}
                                            />
                                            <span className={styles.placeName}>{attr.name}</span>
                                            <span className={styles.placePrice}>{formatCurrency(attr.price + 5000, { maximumFractionDigits: 0 })}</span>
                                        </label>
                                    ))}
                                </div>

                                {dayWiseMode && (
                                    <div className={styles.selectionSummary}>
                                        <p>Day 1 Selected: {selectedDay1Places.length}/2</p>
                                        <p>Day 2 Selected: {selectedDay2Places.length}/2</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.rightColumn}>
                        <div style={{ width: '100%' }}>
                            <div style={{ marginBottom: 12 }}>
                                <label className={styles.label} style={{ display: 'block', marginBottom: 6 }}>Departure City</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Enter city name"
                                    value={selectedFrom}
                                    onChange={(e) => setSelectedFrom(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label className={styles.label} style={{ display: 'block', marginBottom: 6 }}>Travel Date</label>
                                <input type="date" className={styles.input} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
                            </div>
                            <div className={styles.actionsArea}>
                                <button className={styles.cancel} onClick={() => navigate(-1)}>{t('cancel')}</button>
                                <button className={styles.proceed} onClick={handleProceed}>
                                    {dayWiseMode ? 'Book Day-wise Trip' : t('bookFromSelectedLocation')}
                                </button>
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
