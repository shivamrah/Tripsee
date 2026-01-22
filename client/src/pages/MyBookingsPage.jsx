

import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./MyBookingsPage.module.css";
import bookStyles from "./BookTicketsPage.module.css";
import { useNavigate } from "react-router-dom";
import SeatSelector from "../components/trips/SeatSelector";
import Modal from "../components/common/Modal";

import Thumbnail from "../components/common/Thumbnail";
import STATE_INFO from "../data/stateInfo";

// Live clock component for card Time field
const Clock = () => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className={styles.liveClock}>{now.toLocaleTimeString()}</span>;
};

// Step component that allows searching any India place (via Nominatim) and shows results first
const ChooseFromStep = ({ item, onGenerate, onCancel }) => {
  const { formatCurrency, t } = useContext(LocaleContext);
  const [query, setQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState(-1);

  // generate fallback candidates once
  const fallbackRef = React.useRef([]);
  React.useEffect(() => {
    const base = item.price || 5000;
    const candidates = [
      "Hyderabad",
      "Bengaluru",
      "Chennai",
      "Mumbai",
      "New Delhi",
      "Kolkata",
      "Visakhapatnam",
      "Vijayawada",
      "Pune",
      "Lucknow",
      "Jaipur",
      "Coimbatore",
      "Trivandrum",
      "Ahmedabad",
      "Surat",
      "Nagpur",
      "Indore",
      "Bhubaneswar",
      "Mangalore",
    ];
    const dest = (item.destination || item.title || "").toLowerCase();
    const filtered = candidates.filter((c) => c.toLowerCase() !== dest);
    // shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    const pick = filtered.slice(0, 6);
    fallbackRef.current = pick.map((from) => {
      const variance = Math.floor(Math.random() * 3000) - 500;
      const fare = Math.max(250, base + variance);
      return { from, fare };
    });
    // initially expose fallback options (parent expects options array)
    onGenerate(fallbackRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search against Nominatim for places in India
  React.useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      // if query cleared, send parent the fallback list
      onGenerate(fallbackRef.current);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const q = encodeURIComponent(`${query} India`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=in&q=${q}&addressdetails=0&accept-language=en`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'TripSee/1.0 (+https://example.com)' } });
        const json = await resp.json();
        if (cancelled) return;
        const results = json.map((r) => ({ from: r.display_name, fare: Math.max(250, (item.price || 5000) + (Math.floor(Math.random() * 3000) - 500)) }));
        setSearchResults(results);
        // combine search results first, then fallbacks (avoid duplicates)
        const combined = [...results];
        for (const fb of fallbackRef.current) {
          if (!combined.some((c) => c.from.toLowerCase() === fb.from.toLowerCase())) combined.push(fb);
        }
        onGenerate(combined);
      } catch (e) {
        // on any error, fall back to fallback list
        setSearchResults([]);
        onGenerate(fallbackRef.current);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // keyboard navigation for the search results
  const onKeyDown = (e) => {
    const list = searchResults.length > 0 ? searchResults : fallbackRef.current;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((s) => Math.min(s + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = selectedIdx >= 0 ? selectedIdx : 0;
      const chosen = (searchResults.length > 0 ? searchResults : fallbackRef.current)[idx];
      if (chosen) onGenerate([chosen, ...fallbackRef.current.filter((f) => f.from.toLowerCase() !== chosen.from.toLowerCase())]);
    }
  };

  return (
    <div>
      <h2 className={styles.modalTitle}>Choose departure</h2>
      <div className={styles.modalBody}>
        <p>Search any city, town or village in India. Matching results appear first.</p>
        <input
          className={styles.textInput}
          placeholder="Search city / town / village (min 2 chars)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIdx(-1); }}
          onKeyDown={onKeyDown}
          autoFocus
        />

        <div style={{ marginTop: 8 }}>
          {loading && <div>Searching...</div>}
          {!loading && (searchResults.length > 0 ? (
            <ul className={styles.fromOptionsList}>
              {searchResults.map((r, i) => (
                <li key={i} className={styles.fromOption}>
                  <button
                    className={styles.fromBtn}
                    onClick={() => onGenerate([r, ...fallbackRef.current.filter((f) => f.from.toLowerCase() !== r.from.toLowerCase())])}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{r.from}</span>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(r.fare)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p style={{ marginTop: 8, marginBottom: 6 }}>Suggested origins</p>
              <ul className={styles.fromOptionsList}>
                {fallbackRef.current.map((fb, i) => (
                  <li key={i} className={styles.fromOption}>
                    <button className={styles.fromBtn} onClick={() => onGenerate([fb, ...fallbackRef.current.filter((f) => f.from !== fb.from)])}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>{fb.from}</span>
                        <span style={{ fontWeight: 700 }}>{formatCurrency(fb.fare)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className={styles.smallBtn} onClick={onCancel}>{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const { t, locale, formatCurrency } = useContext(LocaleContext);
  const navigate = useNavigate();
  const [savedTrips, setSavedTrips] = useState([]);
  const [bookingModal, setBookingModal] = useState({ open: false, item: null, idx: -1 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [modalFromOptions, setModalFromOptions] = useState([]);
  const [selectedFromIndex, setSelectedFromIndex] = useState(-1);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSearchLoading, setModalSearchLoading] = useState(false);
  const [modalSelectedDate, setModalSelectedDate] = useState("");
  const [savedFlowStep, setSavedFlowStep] = useState("chooseFrom");
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketBooking, setTicketBooking] = useState(null);

  const openTicket = (b) => {
    setTicketBooking(b);
    setTicketOpen(true);
  };

  const closeTicket = () => {
    setTicketBooking(null);
    setTicketOpen(false);
  };

  const generateTicketHtml = (b) => {
    const tripInfo = b.tripInfo || b.trip || b.tripSnapshot || {};
    const fromLocation = b.fromLocation || tripInfo.source || 'N/A';
    const toLocation = tripInfo.destination || (tripInfo.attractions && tripInfo.attractions.length > 0 ? tripInfo.attractions[0].name : tripInfo.title) || 'N/A';
    const seats = b.seats ? b.seats.join(', ') : 'N/A';
    const date = tripInfo.date ? new Date(tripInfo.date).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`) : (b.travelDate ? new Date(b.travelDate).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`) : 'N/A');
    const time = tripInfo.time || (b && b.trip && b.trip.time) || new Date().toLocaleTimeString();
    const total = formatCurrency(b.totalAmount || 0);
    const perSeat = tripInfo.price || (b.totalAmount && b.seats && b.seats.length ? (b.totalAmount / b.seats.length) : null);
    const perSeatStr = perSeat != null ? formatCurrency(perSeat) : '';
    const bookingDate = b.bookingDate ? new Date(b.bookingDate).toLocaleString() : '';

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Ticket - ${b._id}</title>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 24px; color: #1f2937; }
            .header { display:flex; justify-content:space-between; align-items:center; }
            .status { background:#dff6e9; padding:6px 12px; border-radius:20px; }
            h1 { font-size:20px; margin:12px 0; }
            p { margin:8px 0; }
            .total { font-weight:700; margin-top:12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>Booking ID: #${b._id && b._id.toString().slice(-6).toUpperCase()}</div>
            <div class="status">${b._id && b._id.toString().startsWith('saved-') ? 'SAVED' : 'COMPLETED'}</div>
          </div>
          <h1>${fromLocation} — ${toLocation}</h1>
          <p>Date: ${date}</p>
          <p>Time: ${time}</p>
          <p>Seats: ${seats}</p>
          <p>From: ${fromLocation}</p>
          <p>To: ${toLocation}</p>
          ${perSeatStr ? `<p>Price per seat: ${perSeatStr}</p>` : ''}
          <div class="total">Total: ${total}</div>
          ${bookingDate ? `<p>Booking Date: ${bookingDate}</p>` : ''}
        </body>
      </html>
    `;
  };

  const openPrintableWindow = (html, autoClose = false) => {
    // Try opening a new window/tab first
    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      // give the new window a moment to render
      setTimeout(() => {
        try {
          w.print();
          if (autoClose) setTimeout(() => w.close(), 500);
        } catch (e) {
          // fallback to iframe method below
          try {
            w.close();
          } catch (err) { }
          // continue to iframe fallback
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.right = '0';
          iframe.style.bottom = '0';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = '0';
          document.body.appendChild(iframe);
          const idoc = iframe.contentWindow || iframe.contentDocument;
          try {
            idoc.document.open();
            idoc.document.write(html);
            idoc.document.close();
            idoc.focus();
            setTimeout(() => {
              try { idoc.print(); } catch (e2) { alert(t('printFailedCopy')); }
              setTimeout(() => document.body.removeChild(iframe), 500);
            }, 250);
          } catch (e3) {
            alert(t('printFailedPopup'));
          }
        }
      }, 250);
      return;
    }

    // If window.open failed (popup blocked), attempt iframe print fallback
    // Create a hidden iframe, write the HTML, and call print on its window
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      const iwin = iframe.contentWindow || iframe.contentDocument;
      iwin.document.open();
      iwin.document.write(html);
      iwin.document.close();
      iwin.focus();
      setTimeout(() => {
        try {
          iwin.print();
        } catch (e) {
          alert(t('unablePrint'));
        }
        setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) { } }, 500);
      }, 300);
    } catch (err) {
      alert(t('unableOpenPrintWindow'));
    }
  };

  const handlePrint = () => {
    if (!ticketBooking) return;
    const html = generateTicketHtml(ticketBooking);
    openPrintableWindow(html, false);
  };

  const handleDownloadPdf = () => {
    if (!ticketBooking) return;
    const html = generateTicketHtml(ticketBooking);
    // open print dialog — user can choose "Save as PDF"
    openPrintableWindow(html, true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.token) {
        setLoading(false);
        setError(t('pleaseLogInToViewBookings'));
        return;
      }
      try {
        setLoading(true);
        const { data } = await API.get("/bookings/mybookings", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setBookings(data);
      } catch (err) {
        console.error("MyBookingsPage.fetchBookings error:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch your bookings."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    // load saved trips from localStorage
    const loadSaved = () => {
      try {
        const raw = localStorage.getItem("tripCart");
        if (!raw) return setSavedTrips([]);
        const parsed = JSON.parse(raw);
        // normalize entries to ensure imageUrl is present for thumbnails
        const normalized = parsed.map((item) => {
          if (item.imageUrl || item.imagePath) return item;
          // attempt to derive from state metadata if title contains a primary state
          const title = item.title || "";
          const primary = title.split(/→|—|-/).map(p => p.trim()).filter(Boolean)[0] || "";
          const meta = STATE_INFO[primary];
          if (meta && meta.imagePath) return { ...item, imageUrl: meta.imagePath };
          // fallback to unsplash
          const fallbackQuery = encodeURIComponent(item.title || primary || "india");
          return { ...item, imageUrl: `https://source.unsplash.com/160x120/?${fallbackQuery}` };
        });
        setSavedTrips(normalized);
        localStorage.setItem("tripCart", JSON.stringify(normalized));
      } catch (e) {
        setSavedTrips([]);
      }
    };
    loadSaved();

    const onStorage = (e) => {
      if (e.key === "tripCart") loadSaved();
    };
    const onCustom = () => loadSaved();
    window.addEventListener("storage", onStorage);
    window.addEventListener("tripCartUpdated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("tripCartUpdated", onCustom);
    };
  }, [user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalize bookings to use server-provided `tripInfo` (falls back to trip or snapshot)
  const normalizedBookings = bookings.map((b) => ({
    ...b,
    _info: b.tripInfo || b.trip || b.tripSnapshot || {},
  }));

  const upcomingBookings = normalizedBookings.filter((b) => {
    const d = b._info && b._info.date ? new Date(b._info.date) : null;
    return d ? d >= today : true;
  });
  // Map saved trips (from tripCart) into booking-like objects so they appear under Upcoming Bookings
  const savedAsBookings = (savedTrips || []).map((item, i) => {
    const date = item.date ? new Date(item.date) : new Date();
    const savedAt = item.savedAt || item.savedAt === 0 ? item.savedAt : new Date().toISOString();
    const trip = {
      _id: item.id || `saved-trip-${i}`,
      source: item.source || (item.title || "Saved Trip"),
      destination: item.destination || "",
      date: date.toISOString(),
      time: item.time || "",
    };
    const seats = Array.from({ length: item.qty || 1 }, (_, k) => `S${k + 1}`);
    return { _id: `saved-${i}-${item.id || i}`, trip, seats, savedAt };
  });

  const upcomingCombined = [...savedAsBookings, ...upcomingBookings];
  const pastBookings = normalizedBookings.filter((b) => {
    const d = b._info && b._info.date ? new Date(b._info.date) : null;
    return d ? d < today : false;
  });

  useEffect(() => {
    const onAuthLogout = () => {
      setError(t('pleaseLogInToViewBookings'));
      setBookings([]);
    };
    window.addEventListener("authLogout", onAuthLogout);
    return () => window.removeEventListener("authLogout", onAuthLogout);
  }, []);

  // Debounced Nominatim search for the modal's search box (searches India)
  useEffect(() => {
    if (!modalSearchQuery || modalSearchQuery.trim().length < 2) {
      setModalSearchLoading(false);
      return;
    }
    let cancelled = false;
    setModalSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const q = encodeURIComponent(`${modalSearchQuery} India`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&countrycodes=in&q=${q}&addressdetails=0&accept-language=en`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'TripSee/1.0 (+https://example.com)' } });
        const json = await resp.json();
        if (cancelled) return;
        const mapped = json.map((r) => ({ from: r.display_name, fare: Math.max(250, (bookingModal.item?.price || 5000) + (Math.floor(Math.random() * 3000) - 500)) }));
        if (!cancelled) setModalFromOptions(mapped);
      } catch (e) {
        // ignore and keep existing options
      } finally {
        if (!cancelled) setModalSearchLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [modalSearchQuery]);

  const safeSavedTrips = Array.isArray(savedTrips) ? savedTrips : [];

  if (loading) return <p className={styles.centeredMessage}>{t('loading')} {t('myBookings').toLowerCase()}...</p>;

  if (error) {
    const needsLogin = /please log in/i.test(error) || /not authorized/i.test(error) || /token failed/i.test(error);
    return (
      <div className={styles.centeredMessage}>
        <p className={styles.error}>{error}</p>
        {needsLogin && (
          <div style={{ marginTop: 12 }}>
            <button
              className={styles.smallBtnPrimary}
              onClick={() => {
                // ensure stored user is cleared and redirect to login
                try {
                  localStorage.removeItem("userInfo");
                } catch (e) { }
                window.location.href = "/login";
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{t('myBookings')}</h1>

      {/* Saved trips shown as a single package with bottom-level actions */}
      <section className={styles.savedSection}>
        <h2 className={styles.sectionTitle}>{t('savedTrips')}</h2>
        {safeSavedTrips.length > 0 ? (() => {
          try {
            const inferState = (item) => {
              const fromPackage = item.packageState || '';
              const fromTitle = (item.title || '').split(/→|—|–|-/).map((p) => p.trim()).filter(Boolean)[0] || '';
              return (fromPackage || fromTitle || 'Selected State').trim();
            };

            const sortedByDay = [...safeSavedTrips]
              .map((it, idx) => ({
                ...it,
                originalIndex: idx,
                _state: inferState(it),
                sortDay: Number.isFinite(it.day) ? it.day : idx + 1,
              }))
              .sort((a, b) => (a.sortDay || 0) - (b.sortDay || 0));

            const itinerary = [];
            let dayCounter = 1;
            for (let i = 0; i < sortedByDay.length; i++) {
              const current = sortedByDay[i];
              itinerary.push({ ...current, day: dayCounter++, _kind: 'place' });

              const next = sortedByDay[i + 1];
              if (
                next &&
                current._state &&
                next._state &&
                current._state.toLowerCase() !== next._state.toLowerCase()
              ) {
                itinerary.push({
                  _kind: 'travel',
                  day: dayCounter++,
                  fromState: current._state,
                  toState: next._state,
                });
              }
            }

            const packageStates = sortedByDay
              .map((it) => it._state)
              .filter(Boolean)
              .filter((state, idx, arr) => idx === arr.findIndex((s) => (s || '').toLowerCase() === (state || '').toLowerCase()));
            const packageTitle = packageStates.length > 1 ? packageStates.join(' → ') : (packageStates[0] || 'Selected State');
            const placeCount = sortedByDay.length;
            const total = sortedByDay.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);

            const removeItem = (originalIndex) => {
              try {
                const raw = localStorage.getItem("tripCart");
                const arr = raw ? JSON.parse(raw) : [];
                const filtered = arr.filter((_, i) => i !== originalIndex);
                localStorage.setItem("tripCart", JSON.stringify(filtered));
                window.dispatchEvent(new Event("tripCartUpdated"));
                setSavedTrips(filtered);
              } catch (e) {
                // ignore
              }
            };

            return (
              <div className={styles.packageCard}>
                <div className={styles.packageHeader}>
                  <div>
                    <div className={styles.packageLabel}>State Tour Package</div>
                    <div className={styles.packageTitle}>{packageTitle}</div>
                    <div className={styles.packageSub}>{placeCount} place(s) · {formatCurrency(total, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <button className={styles.smallBtn} onClick={() => {
                    try {
                      localStorage.removeItem("tripCart");
                      window.dispatchEvent(new Event("tripCartUpdated"));
                      setSavedTrips([]);
                    } catch (e) { }
                  }}>Clear Package</button>
                </div>

                <div className={styles.itineraryList}>
                  {itinerary.map((it, idx) => {
                    if (it._kind === 'travel') {
                      return (
                        <div key={`travel-${idx}`} className={styles.itineraryRowTravel}>
                          <div className={styles.dayBadge}>Day {it.day}</div>
                          <div className={styles.travelMeta}>
                            <div className={styles.travelLabel}>Travel Day</div>
                            <div className={styles.travelSub}>Move from {it.fromState || 'State A'} to {it.toState || 'State B'}; buffer day for transit</div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={`place-${idx}`} className={styles.itineraryRow}>
                        <div className={styles.dayBadge}>Day {it.day}</div>
                        <Thumbnail
                          src={it.imageUrl || it.imagePath}
                          title={it.title}
                          className={styles.thumbSmall}
                        />
                        <div className={styles.savedMeta}>
                          <div className={styles.savedTitle}>{it.title}</div>
                          <div className={styles.savedSub}>{it.qty || 1} ticket(s)</div>
                        </div>
                        <div className={styles.priceTag}>{formatCurrency((it.price || 0) * (it.qty || 1), { maximumFractionDigits: 0 })}</div>
                        <button className={styles.smallBtnGhost} onClick={() => removeItem(it.originalIndex)}>Remove</button>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.packageBenefits}>
                  <strong>Package includes:</strong>
                  <ul>
                    <li>Day-wise curated plan across {packageTitle}</li>
                    <li>Assisted hotel matching near each stop</li>
                    <li>Priority support and flexible rescheduling</li>
                  </ul>
                </div>

                <div className={styles.packageActions}>
                  <div className={styles.packageTotal}>Total Package: {formatCurrency(total, { maximumFractionDigits: 0 })}</div>
                  <div className={styles.packageButtons}>
                    <button
                      className={styles.smallBtnHotel}
                      onClick={() => {
                        try {
                          navigate('/hotels', { state: { package: { state: packageTitle, items: itinerary } } });
                        } catch (e) {
                          window.location.href = '/hotels';
                        }
                      }}
                    >
                      Book Package Hotels
                    </button>
                    <button
                      className={styles.smallBtnPrimary}
                      onClick={() => {
                        // Start ticket booking flow for the entire package
                        if (itinerary.length === 0) return;
                        setSelectedFromIndex(-1);
                        setModalFromOptions([]);
                        setModalSelectedDate("");
                        setSelectedSeats([]);
                        setSavedFlowStep("chooseFrom");
                        setBookingModal({ open: true, item: { ...itinerary[0], _saved: true, _isPackage: true, _packageItems: itinerary, _packageTotal: total, _packageState: packageTitle }, idx: 0 });
                      }}
                    >
                      Book Package Tickets
                    </button>
                  </div>
                </div>
              </div>
            );
          } catch (err) {
            console.error('Saved trips render failed', err);
            return <p>{t('noSavedTrips')}</p>;
          }
        })() : (
          <p>{t('noSavedTrips')}</p>
        )}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>{t('upcomingBookings')}</h2>
        {upcomingCombined.length > 0 ? (
          <div className={styles.bookingsGrid}>
            {upcomingCombined.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isUpcoming={true}
                onView={openTicket}
              />
            ))}
          </div>
        ) : (
          <p>{t('noUpcomingTrips')}</p>
        )}
      </section>
      {/* Saved-trip booking flow modal: choose origin -> select seats -> checkout */}
      {bookingModal.open && bookingModal.item && bookingModal.item._saved && (
        <div
          className={styles.modalBackdrop}
          onClick={() => {
            setBookingModal({ open: false, item: null, idx: -1 });
            setModalFromOptions([]);
            setSelectedFromIndex(-1);
            setSelectedSeats([]);
            setSavedFlowStep("chooseFrom");
            setModalSelectedDate("");
          }}
        >
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {/* Choose-from step (ChooseFromStep generates options) */}
            {savedFlowStep === "chooseFrom" && modalFromOptions.length === 0 && (
              <ChooseFromStep
                item={bookingModal.item}
                onGenerate={(options) => setModalFromOptions(options)}
                onCancel={() => {
                  setBookingModal({ open: false, item: null, idx: -1 });
                  setModalFromOptions([]);
                  setSelectedSeats([]);
                }}
              />
            )}

            {/* display generated origin options */}
            {savedFlowStep === "chooseFrom" && modalFromOptions.length > 0 && (
              <div className={bookStyles.modalCard}>
                <h2>Choose departure for {bookingModal.item.title}</h2>
                <div className={bookStyles.contentRow}>
                  <div className={bookStyles.leftColumn}>
                    <div className={bookStyles.searchRow}>
                      <input
                        className={bookStyles.searchInput}
                        placeholder="Search city (all India, min 2 chars)"
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                      />
                    </div>
                    {modalSearchLoading && <div style={{ marginBottom: 8 }}>Searching...</div>}
                    <ul className={bookStyles.cityList}>
                      {modalFromOptions.map((opt, i) => (
                        <li key={i} className={bookStyles.cityRow}>
                          <label>
                            <input type="radio" name="fromCityModal" value={opt.from} checked={selectedFromIndex === i} onChange={() => setSelectedFromIndex(i)} />
                            <span className={bookStyles.cityName}>{opt.from}</span>
                          </label>
                          <span className={bookStyles.cityPrice}>{formatCurrency(opt.fare)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={bookStyles.rightColumn}>
                    <div style={{ width: '100%', marginBottom: 12 }}>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Travel Date</label>
                      <input type="date" className={bookStyles.input} value={modalSelectedDate} onChange={(e) => setModalSelectedDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
                    </div>
                    <div className={bookStyles.actionsArea}>
                      <button className={bookStyles.cancel} onClick={() => { setBookingModal({ open: false, item: null, idx: -1 }); setModalFromOptions([]); setSelectedFromIndex(-1); setSelectedSeats([]); setModalSelectedDate(""); }}>{t('cancel')}</button>
                      <button className={bookStyles.proceed} onClick={() => {
                        if (selectedFromIndex < 0) { alert(t('pleaseSelectDepartureModal')); return; }
                        if (!modalSelectedDate) { alert(t('pleaseChooseTravelDate')); return; }
                        const chosen = modalFromOptions[selectedFromIndex];
                        const picked = new Date(modalSelectedDate);
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        if (picked < today) { alert(t('travelDateCannotBePast')); return; }
                        const newItem = { ...bookingModal.item, price: chosen.fare, source: chosen.from, travelDate: modalSelectedDate };
                        setBookingModal({ open: true, item: newItem, idx: bookingModal.idx });
                        // proceed to seats
                        setModalFromOptions([]);
                        setSelectedFromIndex(-1);
                        setSavedFlowStep('selectSeats');
                      }}>{t('bookFromSelectedLocation')}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* seat selection step for saved flow */}
            {savedFlowStep === 'selectSeats' && (
              <div>
                <h2 className={styles.modalTitle}>Select Seats for {bookingModal.item._isPackage ? `${bookingModal.item._packageState} Package` : bookingModal.item.title}</h2>
                <div className={styles.modalBody}>
                  <SeatSelector bookedSeats={bookingModal.item.bookedSeats || []} selectedSeats={selectedSeats} onSeatSelect={setSelectedSeats} />
                  <div className={styles.modalSummary}>
                    <p><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                    {bookingModal.item._isPackage ? (
                      <p><strong>Package Total:</strong> {formatCurrency(bookingModal.item._packageTotal)}</p>
                    ) : (
                      <p><strong>Total:</strong> {formatCurrency((bookingModal.item.price || 5000) * selectedSeats.length)}</p>
                    )}
                    <div className={styles.modalActions}>
                      <button className={styles.smallBtn} onClick={() => { setBookingModal({ open: false, item: null, idx: -1 }); setSelectedSeats([]); setSavedFlowStep('chooseFrom'); }}>Cancel</button>
                      <button className={styles.smallBtnPrimary} onClick={() => {
                        if (selectedSeats.length === 0) { alert('Please select at least one seat.'); return; }
                        const isPackage = bookingModal.item._isPackage;
                        const totalAmount = isPackage ? bookingModal.item._packageTotal : ((bookingModal.item.price || 5000) * selectedSeats.length);
                        const tripObj = bookingModal.item.trip || { _id: bookingModal.item.id || null, source: bookingModal.item.source || bookingModal.item.title || 'Route', destination: bookingModal.item.destination || '' };
                        const packageData = isPackage ? { _isPackage: true, _packageItems: bookingModal.item._packageItems, _packageState: bookingModal.item._packageState } : {};
                        setBookingModal({ open: false, item: null, idx: -1 });
                        setSelectedSeats([]);
                        setSavedFlowStep('chooseFrom');
                        navigate('/checkout', { state: { trip: tripObj, selectedSeats, totalAmount, paymentType: 'upi', travelDate: bookingModal.item?.travelDate, fromLocation: bookingModal.item?.source, ...packageData } });
                      }}>Proceed to Payment</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <section className={styles.pastSection}>
        <h2 className={styles.sectionTitle}>Past Bookings</h2>
        {pastBookings.length > 0 ? (
          <div className={styles.bookingsGrid}>
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isUpcoming={false}
                onView={openTicket}
              />
            ))}
          </div>
        ) : (
          <p>{t('noPastTrips')}</p>
        )}
      </section>
      {/* Ticket modal shown when user clicks View */}
      <Modal isOpen={ticketOpen} onClose={closeTicket}>
        <div style={{ padding: 20, maxWidth: 720 }}>
          {ticketBooking ? (
            (() => {
              const b = ticketBooking;
              const tripInfo = b.tripInfo || b.trip || b.tripSnapshot || b.trip || {};
              const isSaved = b && b._id && b._id.toString().startsWith("saved-");
              const status = isSaved ? "COMPLETED" : (tripInfo.date && new Date(tripInfo.date) >= new Date() ? "Upcoming" : "COMPLETED");

              // Determine From/To for both booked and saved trips.
              // Many saved items store both parts in `trip.source` or `trip.title` (e.g. "State — Place").
              const rawTitle = tripInfo.source || tripInfo.title || '';
              const splitParts = rawTitle.split(/→|—|–|-/).map(s => s.trim()).filter(Boolean);
              const inferredFrom = splitParts.length > 0 ? splitParts[0] : '';
              const inferredTo = splitParts.length > 1 ? splitParts[1] : '';
              const fromLocation = b.fromLocation || (tripInfo.source && tripInfo.destination ? tripInfo.source : (inferredFrom || tripInfo.source)) || 'N/A';
              const toLocation = tripInfo.destination || inferredTo || (tripInfo.attractions && tripInfo.attractions.length > 0 ? tripInfo.attractions[0].name : null) || tripInfo.title || 'N/A';

              // Price per seat: prefer tripInfo.price, otherwise derive from totalAmount / seats
              const perSeatPrice = tripInfo.price || (b.totalAmount && b.seats && b.seats.length > 0 ? b.totalAmount / b.seats.length : null);

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700 }}>Booking ID: #{b._id && b._id.toString().slice(-6).toUpperCase()}</div>
                    <div style={{ background: '#dff6e9', padding: '6px 12px', borderRadius: 20 }}>{status}</div>
                  </div>
                  <h2 style={{ marginTop: 12 }}>{fromLocation} — {toLocation}</h2>
                  <p>Date: {tripInfo.date ? new Date(tripInfo.date).toLocaleDateString() : (b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'N/A')}</p>
                  <p>Time: {tripInfo.time || (b && b.trip && b.trip.time) || new Date().toLocaleTimeString()}</p>
                  {b.seats && b.seats.length > 0 && <p>Seats: {b.seats.join(', ')}</p>}
                  <p>From: {fromLocation}</p>
                  <p>To: {toLocation}</p>
                  {perSeatPrice != null ? (
                    <p>Price per seat: {formatCurrency(perSeatPrice)}</p>
                  ) : null}
                  <p style={{ fontWeight: 700, marginTop: 8 }}>Total: {formatCurrency(b.totalAmount || 0)}</p>
                  {b.bookingDate && <p>Booking Date: {new Date(b.bookingDate).toLocaleString()}</p>}
                  {b.savedAt && <p>Saved: {new Date(b.savedAt).toLocaleString()}</p>}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button className={styles.smallBtn} onClick={handlePrint}>Print</button>
                    <button className={styles.smallBtn} onClick={handleDownloadPdf}>Download (PDF)</button>
                    <button className={styles.smallBtn} onClick={closeTicket}>Close</button>
                  </div>
                </div>
              );
            })()
          ) : (
            <p>No booking selected.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};


const BookingCard = ({ booking, onView }) => {
  const info = booking && (booking.tripInfo || booking.trip || booking.tripSnapshot) || {};
  const isUpcoming = info && info.date ? new Date(info.date) >= new Date() : true;

  const isSavedBooking = booking && booking._id && booking._id.toString().startsWith("saved-");

  // If there is no trip info at all, hide this card (user asked not to show them)
  if (!info || Object.keys(info).length === 0) return null;

  return (
    <div
      className={`${styles.card} ${isUpcoming ? styles.upcomingCard : styles.pastCard
        }`}
    >
      <div className={styles.cardHeader}>
        <span>Booking ID: #{(booking && booking._id ? booking._id.toString() : "UNKNOWN").slice(-6).toUpperCase()}</span>
        <span className={isSavedBooking ? styles.pastTag : (isUpcoming ? styles.upcomingTag : styles.pastTag)}>
          {isSavedBooking ? "COMPLETED" : (isUpcoming ? "Upcoming" : "Completed")}
        </span>
      </div>
      <div className={styles.cardBody}>
        <h3>
          {(info && info.source) || 'N/A'} to {(info && info.destination) || 'N/A'}
        </h3>
        <p>Date: {(info && info.date) ? new Date(info.date).toLocaleDateString() : (booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'N/A')}</p>
        <p>
          Time: {(info && info.time) ? info.time : <Clock />}
        </p>
        {Array.isArray(booking.seats) && booking.seats.length > 0 && <p>Seats: {booking.seats.join(", ")}</p>}
        {isSavedBooking && booking.savedAt && (
          <p>Saved: {new Date(booking.savedAt).toLocaleString()}</p>
        )}
        <div className={styles.cardFooter}>
          <button className={styles.viewBtn} onClick={() => onView && onView(booking)}>View</button>
          <button className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
