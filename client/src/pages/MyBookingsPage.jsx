

import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./MyBookingsPage.module.css";
import bookStyles from "./BookTicketsPage.module.css";
import { useNavigate } from "react-router-dom";
import SeatSelector from "../components/trips/SeatSelector";
import Modal from "../components/common/Modal";

// Thumbnail component that falls back to initials box when image fails
const Thumbnail = ({ src, title, className }) => {
  const [failed, setFailed] = React.useState(false);
  const initials = React.useMemo(() => {
    if (!title) return "TR";
    return title
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }, [title]);

  if (!src || failed) {
    return (
      <div className={`${styles.thumbSmallPlaceholder} ${className || ""}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

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
                      <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(r.fare)}</span>
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
                        <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fb.fare)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className={styles.smallBtn} onClick={onCancel}>Cancel</button>
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
  const { t } = useContext(LocaleContext);
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
    const date = tripInfo.date ? new Date(tripInfo.date).toLocaleDateString() : (b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'N/A');
    const time = tripInfo.time || (b && b.trip && b.trip.time) || new Date().toLocaleTimeString();
    const total = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(b.totalAmount || 0);
    const perSeat = tripInfo.price || (b.totalAmount && b.seats && b.seats.length ? (b.totalAmount / b.seats.length) : null);
    const perSeatStr = perSeat != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(perSeat) : '';
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
              try { idoc.print(); } catch (e2) { alert('Print failed. Please copy or save the ticket manually.'); }
              setTimeout(() => document.body.removeChild(iframe), 500);
            }, 250);
          } catch (e3) {
            alert('Print failed. Please check your popup blocker or try copying the ticket content.');
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
          alert('Unable to print the ticket. Please check your popup blocker or try the Download (PDF) option.');
        }
        setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) { } }, 500);
      }, 300);
    } catch (err) {
      alert('Unable to open print window. Please check your popup blocker.');
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
        setError("Please log in to view your bookings.");
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
        setSavedTrips(JSON.parse(raw));
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

  const upcomingBookings = bookings.filter(
    (b) => b.trip && new Date(b.trip.date) >= today
  );
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
  const pastBookings = bookings.filter(
    (b) => b.trip && new Date(b.trip.date) < today
  );

  useEffect(() => {
    const onAuthLogout = () => {
      setError("Please log in to view your bookings.");
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

  if (loading) return <p className={styles.centeredMessage}>Loading your bookings...</p>;

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

      {/* Saved trips from localStorage (My Trips) */}
      <section className={styles.savedSection}>
        <h2 className={styles.sectionTitle}>{t('savedTrips')}</h2>
        {savedTrips && savedTrips.length > 0 ? (
          <div className={styles.savedList}>
            {savedTrips.map((item, idx) => (
              <div key={idx} className={styles.savedItem}>
                <Thumbnail
                  src={item.imageUrl || item.imagePath}
                  title={item.title}
                  className={styles.thumbSmall}
                />
                <div className={styles.savedMeta}>
                  <div className={styles.savedTitle}>{item.title}</div>
                  <div className={styles.savedSub}>{item.qty} ticket(s)</div>
                </div>
                <div className={styles.savedActions}>
                  <button
                    className={styles.smallBtn}
                    onClick={() => {
                      // remove this item from tripCart
                      try {
                        const raw = localStorage.getItem("tripCart");
                        const arr = raw ? JSON.parse(raw) : [];
                        const filtered = arr.filter((it, i) => i !== idx);
                        localStorage.setItem("tripCart", JSON.stringify(filtered));
                        window.dispatchEvent(new Event("tripCartUpdated"));
                        setSavedTrips(filtered);
                      } catch (e) {
                        // ignore
                      }
                    }}
                  >
                    Remove
                  </button>
                  <button
                    className={styles.smallBtnPrimary}
                    onClick={() => {
                      // Open modal to choose origin and generate fares for this saved trip
                      setSelectedFromIndex(-1);
                      setModalFromOptions([]);
                      setSelectedSeats([]);
                      setSavedFlowStep("chooseFrom");
                      setModalSelectedDate("");
                      setBookingModal({ open: true, item: { ...item, _saved: true }, idx });
                    }}
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no saved trips. Add trips to "My Trips" to see them here.</p>
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
          <p>You have no upcoming trips.</p>
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
                          <span className={bookStyles.cityPrice}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(opt.fare)}</span>
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
                      <button className={bookStyles.cancel} onClick={() => { setBookingModal({ open: false, item: null, idx: -1 }); setModalFromOptions([]); setSelectedFromIndex(-1); setSelectedSeats([]); setModalSelectedDate(""); }}>Cancel</button>
                      <button className={bookStyles.proceed} onClick={() => {
                        if (selectedFromIndex < 0) { alert('Please select a departure location.'); return; }
                        if (!modalSelectedDate) { alert('Please choose a travel date.'); return; }
                        const chosen = modalFromOptions[selectedFromIndex];
                        const picked = new Date(modalSelectedDate);
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        if (picked < today) { alert('Travel date cannot be in the past.'); return; }
                        const newItem = { ...bookingModal.item, price: chosen.fare, source: chosen.from, travelDate: modalSelectedDate };
                        setBookingModal({ open: true, item: newItem, idx: bookingModal.idx });
                        // proceed to seats
                        setModalFromOptions([]);
                        setSelectedFromIndex(-1);
                        setSavedFlowStep('selectSeats');
                      }}>Book Bus Tickets from Selected Location</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* seat selection step for saved flow */}
            {savedFlowStep === 'selectSeats' && (
              <div>
                <h2 className={styles.modalTitle}>Select Seats for {bookingModal.item.title}</h2>
                <div className={styles.modalBody}>
                  <SeatSelector bookedSeats={bookingModal.item.bookedSeats || []} selectedSeats={selectedSeats} onSeatSelect={setSelectedSeats} />
                  <div className={styles.modalSummary}>
                    <p><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                    <p><strong>Total:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((bookingModal.item.price || 5000) * selectedSeats.length)}</p>
                    <div className={styles.modalActions}>
                      <button className={styles.smallBtn} onClick={() => { setBookingModal({ open: false, item: null, idx: -1 }); setSelectedSeats([]); setSavedFlowStep('chooseFrom'); }}>Cancel</button>
                      <button className={styles.smallBtnPrimary} onClick={() => {
                        if (selectedSeats.length === 0) { alert('Please select at least one seat.'); return; }
                        const totalAmount = (bookingModal.item.price || 5000) * selectedSeats.length;
                        const tripObj = bookingModal.item.trip || { _id: bookingModal.item.id || null, source: bookingModal.item.source || bookingModal.item.title || 'Route', destination: bookingModal.item.destination || '' };
                        setBookingModal({ open: false, item: null, idx: -1 });
                        setSelectedSeats([]);
                        setSavedFlowStep('chooseFrom');
                        navigate('/checkout', { state: { trip: tripObj, selectedSeats, totalAmount, paymentType: 'upi', travelDate: bookingModal.item?.travelDate, fromLocation: bookingModal.item?.source } });
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
          <p>You have no past trips.</p>
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
                    <p>Price per seat: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(perSeatPrice)}</p>
                  ) : null}
                  <p style={{ fontWeight: 700, marginTop: 8 }}>Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(b.totalAmount || 0)}</p>
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
  const isUpcoming = booking.trip && new Date(booking.trip.date) >= new Date();


  const isSavedBooking = booking && booking._id && booking._id.toString().startsWith("saved-");

  if (!booking.trip) {
    return (
      <div className={`${styles.card} ${styles.invalidCard}`}>
        <div className={styles.cardHeader}>
          <span>Booking ID: #{booking._id.slice(-6).toUpperCase()}</span>
        </div>
        <div className={styles.cardBody}>
          <h3>Trip No Longer Available</h3>
          <p>
            This trip may have been cancelled or removed by the administrator.
          </p>
          <div className={styles.cardFooter}>
            <button className={styles.viewBtn} onClick={() => onView && onView(booking)}>
              View
            </button>
            <button className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${isUpcoming ? styles.upcomingCard : styles.pastCard
        }`}
    >
      <div className={styles.cardHeader}>
        <span>Booking ID: #{booking._id.toString().slice(-6).toUpperCase()}</span>
        <span className={isSavedBooking ? styles.pastTag : (isUpcoming ? styles.upcomingTag : styles.pastTag)}>
          {isSavedBooking ? "COMPLETED" : (isUpcoming ? "Upcoming" : "Completed")}
        </span>
      </div>
      <div className={styles.cardBody}>
        <h3>
          {booking.trip.source} to {booking.trip.destination}
        </h3>
        <p>Date: {new Date(booking.trip.date).toLocaleDateString()}</p>
        <p>
          Time: {booking.trip.time ? booking.trip.time : <Clock />}
        </p>
        {!isSavedBooking && <p>Seats: {booking.seats.join(", ")}</p>}
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
