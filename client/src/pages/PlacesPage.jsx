import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import STATE_INFO from "../data/stateInfo";
import API from "../api";
import TripCard from "../components/trips/TripCard";
import styles from "./StatePlacesPage.module.css";
import { LocaleContext } from "../context/LocaleContext";
import { AuthContext } from "../context/AuthContext";
import SuccessModal from "../components/common/SuccessModal";

const sanitize = (s) =>
    s
        .toString()
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_|_$/g, "");

// Generate place-specific info so every attraction has unique, relevant copy
const buildPlaceInfo = (stateName, attractionName, meta) => {
    const rules = [
        { regex: /temple|monastery|gurudwara|church|basilica|shrine/i, text: "is a major pilgrimage spot celebrated for its architecture and rituals." },
        { regex: /fort|palace|heritage|basilica|citadel/i, text: "is a heritage landmark showcasing the region's royal and colonial history." },
        { regex: /beach|bay|coast|shore/i, text: "is a favorite seafront stretch for sunsets, cafés and water fun." },
        { regex: /valley|hill|peak|pass|mountain|ridge/i, text: "is a hill escape known for cool weather, views and treks." },
        { regex: /lake|backwater|dam|sagar|sarovar/i, text: "is a calm waterside stop where boating and sunrise views shine." },
        { regex: /park|sanctuary|reserve|wildlife|safari|national/i, text: "is a wildlife haven with safari routes and rich biodiversity." },
        { regex: /cave|grotto/i, text: "features cavern networks with striking rock formations and folklore." },
        { regex: /garden|orchard/i, text: "offers manicured trails, seasonal blooms and picnic corners." },
        { regex: /market|town|city/i, text: "lets you dive into local food, shopping lanes and everyday culture." },
    ];

    const rule = rules.find((r) => r.regex.test(attractionName));
    if (rule) return `${attractionName} in ${stateName} ${rule.text}`;

    if (meta?.description) {
        const lower = meta.description.charAt(0).toLowerCase() + meta.description.slice(1);
        return `${attractionName} in ${stateName} builds on the state vibe — ${lower}`;
    }

    return `${attractionName} in ${stateName} is a local favorite with its own character and stories.`;
};

// Produce place-specific quick facts for the info panel
const buildPlaceDetails = (stateName, attractionName, price = 5000) => {
    const quoted = (v) => Math.max(4, Math.round(v / 1000));
    const baseLow = quoted(price + 2000);
    const baseHigh = quoted(price + 9000);
    const makeBudget = (lo, hi) => `₹${lo}K - ₹${hi}K/person`;

    const base = {
        bestTime: "October - March",
        weather: "Mild to cool",
        cuisine: `Regional plates in ${stateName}`,
        budget: makeBudget(baseLow, baseHigh),
        transport: "Taxi, bus & train",
        bestFor: `Culture runs around ${attractionName}`,
    };

    const detailRules = [
        {
            regex: /beach|coast|bay|island|shore/i,
            set: (lo, hi) => ({
                bestTime: "November - February (sunsets)",
                weather: "Warm & breezy",
                cuisine: `Seafood grills in ${stateName}`,
                budget: makeBudget(lo + 1, hi + 2),
                transport: "Cab or scooter rentals",
                bestFor: `Sunsets & water time at ${attractionName}`,
            }),
        },
        {
            regex: /valley|hill|peak|pass|mountain|ridge|trek/i,
            set: (lo, hi) => ({
                bestTime: "Mar-Jun & Sep-Nov",
                weather: "Cool mountain air",
                cuisine: `Hearty hill fare in ${stateName}`,
                budget: makeBudget(lo + 2, hi + 3),
                transport: "Cab or shared jeep",
                bestFor: `Views & treks around ${attractionName}`,
            }),
        },
        {
            regex: /temple|monastery|gurudwara|shrine|basilica/i,
            set: (lo, hi) => ({
                bestTime: "Early mornings year-round",
                weather: "Warm, lighter afternoons",
                cuisine: `Prasad stops & street food near ${attractionName}`,
                budget: makeBudget(lo, hi - 2),
                transport: "Cab, rickshaw & walk",
                bestFor: `Pilgrimage & rituals at ${attractionName}`,
            }),
        },
        {
            regex: /fort|palace|heritage|citadel|museum/i,
            set: (lo, hi) => ({
                bestTime: "October - February",
                weather: "Dry & pleasant",
                cuisine: `Royal thalis & chai in ${stateName}`,
                budget: makeBudget(lo + 1, hi + 1),
                transport: "Cab, tuk-tuk & walk",
                bestFor: `Heritage walks around ${attractionName}`,
            }),
        },
        {
            regex: /park|sanctuary|reserve|wildlife|safari|national/i,
            set: (lo, hi) => ({
                bestTime: "Oct - Apr (safaris)",
                weather: "Cool mornings, sunny noon",
                cuisine: "Forest canteen & dhaba fare",
                budget: makeBudget(lo + 3, hi + 4),
                transport: "Jeep safari + cab",
                bestFor: `Wildlife spotting in ${attractionName}`,
            }),
        },
        {
            regex: /lake|backwater|dam|sagar|sarovar/i,
            set: (lo, hi) => ({
                bestTime: "September - February",
                weather: "Calm & breezy",
                cuisine: `Lakeside snacks & tea near ${attractionName}`,
                budget: makeBudget(lo + 1, hi + 1),
                transport: "Cab, boat & walk",
                bestFor: `Boating & sunrise at ${attractionName}`,
            }),
        },
        {
            regex: /cave|grotto/i,
            set: (lo, hi) => ({
                bestTime: "October - March",
                weather: "Cool interiors",
                cuisine: "Snacks at base market",
                budget: makeBudget(lo, hi),
                transport: "Cab + short hike",
                bestFor: `Rock formations in ${attractionName}`,
            }),
        },
        {
            regex: /market|bazaar|city|town|plaza/i,
            set: (lo, hi) => ({
                bestTime: "Evenings year-round",
                weather: "Warm urban",
                cuisine: `Street food crawl in ${stateName}`,
                budget: makeBudget(lo, hi + 1),
                transport: "Metro, cab & walk",
                bestFor: `Food runs & shopping at ${attractionName}`,
            }),
        },
    ];

    const matched = detailRules.find((r) => r.regex.test(attractionName) || r.regex.test(stateName));
    return matched ? { ...base, ...matched.set(baseLow, baseHigh) } : base;
};

const PlacesPage = () => {
    const { state } = useParams();
    const decoded = decodeURIComponent(state).replace(/_/g, " ");
    const meta = STATE_INFO[decoded];

    const { t, formatCurrency } = useContext(LocaleContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);

    // Fetch trips for this state/destination
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data } = await API.get("/trips");
                // Filter trips where state matches the current state (case-insensitive)
                const filteredTrips = data.filter((trip) => {
                    const tripState = (trip.state || "").trim().toLowerCase();
                    const currentState = decoded.trim().toLowerCase();
                    return tripState === currentState;
                });
                // Trips are already sorted by date (earliest first) from the backend
                setTrips(filteredTrips);
            } catch (error) {
                console.error("Failed to fetch trips", error);
            } finally {
                setLoadingTrips(false);
            }
        };
        fetchTrips();
    }, [decoded]);

    if (!meta) return <p style={{ padding: 20 }}>{t('noData')} "{decoded}"</p>;

    const attractions = meta.attractions || [];

    const AttractionCard = ({ a }) => {
        const [showInfo, setShowInfo] = useState(false);
        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [showErrorModal, setShowErrorModal] = useState(false);
        const localPath = `/attraction-images/${sanitize(decoded)}_${sanitize(a.name)}.svg`;
        const unsplashSrc = `https://source.unsplash.com/800x600/?${encodeURIComponent(
            decoded + " " + a.name
        )}`;

        // prefer an explicit imagePath from data (links you pasted) before local file fallback
        const [src, setSrc] = useState(a.imagePath || localPath);
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

        const handleAddToPackage = () => {
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
                    // try to attach a sensible image URL so thumbnails render for saved example trips
                    const chosenImage = a.imagePath || unsplashSrc || localPath;
                    cart.push({ id, title: `${decoded} — ${a.name}`, price: displayPrice, qty: 1, savedAt: new Date().toISOString(), imageUrl: chosenImage, packageState: decoded, day: cart.length + 1 });
                }
                localStorage.setItem("tripCart", JSON.stringify(cart));
                window.dispatchEvent(new Event("tripCartUpdated"));
                setShowSuccessModal(true);
            } catch (err) {
                console.error(err);
            }
        };

        const handleDeleteAttraction = () => {
            if (!user || user.role !== 'admin') {
                setShowErrorModal(true);
                return;
            }
            if (window.confirm(`Are you sure you want to delete ${a.name}?`)) {
                // Remove this attraction from the state info
                const stateMeta = STATE_INFO[decoded];
                if (stateMeta && stateMeta.attractions) {
                    stateMeta.attractions = stateMeta.attractions.filter((attr) => attr.name !== a.name);
                    window.location.reload(); // Reload to reflect changes
                }
            }
        };

        const infoText = a.description || buildPlaceInfo(decoded, a.name, meta);
        const details = buildPlaceDetails(decoded, a.name, a.price + 5000);

        return (
            <div className={styles.card}>
                <img
                    src={src}
                    alt={a.name}
                    className={styles.image}
                    onError={handleError}
                />
                <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{a.name}</h3>
                    <p className={styles.priceBadge}>
                        {formatCurrency(a.price + 5000, { maximumFractionDigits: 0 })} {t('perPerson')}
                    </p>
                    <div className={styles.actions}>
                        <button className={styles.infoBtn} onClick={() => setShowInfo(!showInfo)} aria-label={`Info about ${a.name}`}>
                            {showInfo ? 'Hide' : (t('info') || 'Info')}
                        </button>
                        <button className={styles.addBtn} onClick={handleAddToPackage} aria-label={`Add ${a.name} to package`}>
                            {t('addToPackageBtn') || 'Add to Package'}
                        </button>
                        <button className={styles.deleteBtn} onClick={handleDeleteAttraction} aria-label={`Delete ${a.name}`} title={user && user.role === 'admin' ? 'Delete attraction' : 'Only admins can delete'}>
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
                            <p className={styles.infoText}>{infoText}</p>

                            <div className={styles.infoDetailsGrid}>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>🌡️ Best Time:</span>
                                    <span className={styles.detailValue}>{details.bestTime}</span>
                                </div>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>🌤️ Weather:</span>
                                    <span className={styles.detailValue}>{details.weather}</span>
                                </div>
                            </div>

                            <div className={styles.infoDetailsGrid}>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>🍽️ Cuisine:</span>
                                    <span className={styles.detailValue}>{details.cuisine}</span>
                                </div>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>💰 Budget:</span>
                                    <span className={styles.detailValue}>{details.budget}</span>
                                </div>
                            </div>

                            <div className={styles.infoDetailsGrid}>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>🚗 Transport:</span>
                                    <span className={styles.detailValue}>{details.transport}</span>
                                </div>
                                <div className={styles.infoDetailItem}>
                                    <span className={styles.detailLabel}>🎯 Best For:</span>
                                    <span className={styles.detailValue}>{details.bestFor}</span>
                                </div>
                            </div>

                            <div className={styles.ratingContainer}>
                                <label>{t('rating') || 'Rating'}:</label>
                                <div className={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={styles.starIcon} title={`${star} stars`}>★</span>
                                    ))}
                                </div>
                                <span className={styles.ratingScore}>4.5/5</span>
                            </div>
                        </div>
                    )}
                    {usedUnsplash && (
                        <p className={styles.attribution}>
                            Image: <a href={`https://unsplash.com/s/photos/${encodeURIComponent(decoded + " " + a.name)}`} target="_blank" rel="noopener noreferrer">Unsplash</a>
                        </p>
                    )}
                </div>
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title={t('success') || "Success!"}
                    message={t('addedToPackage') || 'Added to package'}
                />
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
                                Only administrators can delete attractions. Please contact an admin if you need to remove this attraction.
                            </p>
                            <button
                                onClick={() => setShowErrorModal(false)}
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
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <h1>{decoded} — {t('bookNow')}</h1>
            <p className={styles.subtitle}>{meta.description}</p>

            {/* Combined Attractions and Trips Section */}
            <h2 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}>
                ✨ Popular Attractions & Bus Trips
            </h2>
            <div className={styles.grid}>
                {/* Display Trips first, then Attractions */}
                {trips.map((trip) => (
                    <TripCard key={trip._id} trip={trip} />
                ))}
                {attractions.map((aObj) => (
                    <AttractionCard key={aObj.name} a={aObj} />
                ))}
            </div>
        </div>
    );
};

export default PlacesPage;
