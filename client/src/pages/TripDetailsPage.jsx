
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import SeatSelector from "../components/trips/SeatSelector";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./TripDetailsPage.module.css";
import toast, { Toaster } from "react-hot-toast";
import STATE_INFO from "../data/stateInfo";

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFromLocal, setSelectedFromLocal] = useState("");
  const location = useLocation();
  const focusDateRequested = location?.state?.focusDate;
  const dateInputRef = React.useRef(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/trips/${id}`);
        setTrip(data);
      } catch (err) {
        // If the trip isn't found on the server, check if this is an example id
        // we generate client-side (format: example-<state> or example-<state>-<i>).
        const raw = id || "";
        if (raw.startsWith("example-")) {
          // extract state name (may contain dashes or spaces). If last segment is numeric, drop it.
          const parts = raw.split("-");
          let stateParts = parts.slice(1);
          const last = stateParts[stateParts.length - 1];
          if (!isNaN(Number(last))) stateParts = stateParts.slice(0, -1);
          const stateName = decodeURIComponent(stateParts.join("-")).replace(/_/g, " ");
          const meta = STATE_INFO[stateName];
          if (meta) {
            // build a mock trip object that TripDetailsPage can render
            const mockTrip = {
              _id: id,
              source: stateName,
              destination: stateName,
              date: new Date().toISOString(),
              time: "09:00",
              price: 0,
              totalSeats: 0,
              bookedSeats: [],
              imageUrl: meta.imagePath || "",
              _isExample: true,
              attractions: meta.attractions || [],
            };
            setTrip(mockTrip);
            setError("");
            return;
          }
        }
        setError(t('loading'));
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  // Initialize selectedDate when trip loads
  useEffect(() => {
    if (trip) {
      // prefer a selectedDate passed in navigation state (from Book Tickets)
      if (location?.state?.selectedDate) {
        setSelectedDate(location.state.selectedDate);
      } else {
        const iso = new Date(trip.date).toISOString();
        setSelectedDate(iso.slice(0, 10));
      }
      // initialize from if passed from BookTicketsPage
      if (location?.state?.selectedFrom) setSelectedFromLocal(location.state.selectedFrom);
    }
  }, [trip]);

  // If the caller requested focus on the date input, focus it when available
  useEffect(() => {
    if (focusDateRequested && dateInputRef.current) {
      try {
        dateInputRef.current.focus();
        // Some browsers open the datepicker on focus when using input[type=date]
      } catch (e) {
        // ignore
      }
    }
  }, [focusDateRequested, dateInputRef, selectedDate]);

  const handleConfirmBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error(t('pleaseSelectSeat'));
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date for your trip.");
      return;
    }
    if (!selectedFromLocal) {
      toast.error("Please select a departure location.");
      return;
    }
    // ensure date is not in the past
    const today = new Date();
    const chosen = new Date(selectedDate + "T00:00:00");
    if (chosen.setHours(0, 0, 0, 0) < new Date(today.setHours(0, 0, 0, 0))) {
      toast.error("Please choose a valid future date.");
      return;
    }
    // Pass the selected date in the trip object so checkout/confirmation show the chosen date
    const tripWithDate = { ...trip, date: new Date(selectedDate).toISOString() };
    navigate("/checkout", {
      state: {
        trip: tripWithDate,
        selectedSeats,
        totalAmount: trip.price * selectedSeats.length,
        selectedFrom: selectedFromLocal,
      },
    });
  };

  const handleAddToMyTrips = () => {
    try {
      const raw = localStorage.getItem("tripCart");
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((c) => c.id === trip._id);
      const qtyToAdd = selectedSeats.length > 0 ? selectedSeats.length : 1;
      if (existing) {
        existing.qty = (existing.qty || 1) + qtyToAdd;
        existing.savedAt = new Date().toISOString();
      } else {
        cart.push({ id: trip._id, title: `${trip.source} → ${trip.destination}`, price: trip.price || 0, qty: qtyToAdd, savedAt: new Date().toISOString() });
      }
      localStorage.setItem("tripCart", JSON.stringify(cart));
      alert(t('addToMyTrips'));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>{t('loading')} trip details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!trip) return <p>{t('noData')}.</p>;
  // If this is a mock/example trip generated by the client, show attractions with images
  if (trip._isExample) {
    return (
      <div className={styles.pageContainer}>
        <Toaster position="top-center" reverseOrder={false} />
        <img src={trip.imageUrl} alt={trip.source} className={styles.tripImage} />
        <div className={styles.detailsCard}>
          <div className={styles.tripHeader}>
            <h1>
              {trip.source} — {t('bookNow')}
            </h1>
          </div>

          <p className={styles.tripDate}>{new Date(trip.date).toLocaleDateString()}</p>

          {trip.attractions && trip.attractions.length > 0 && (
            <div className={styles.attractionsGrid}>
              {trip.attractions.map((a) => (
                <div key={a.name} className={styles.attractionCard}>
                  <img
                    src={`https://source.unsplash.com/400x300/?${encodeURIComponent(a.name)}`}
                    alt={a.name}
                    className={styles.attractionImage}
                  />
                  <div className={styles.attractionBody}>
                    <h3>{a.name}</h3>
                    <p className={styles.priceBadge}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a.price + 5000)} {t('perPerson')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={{ marginTop: "1rem" }}>
            These are sample popular places for {trip.source}. Real trip bookings are not available for example trips.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" reverseOrder={false} />

      <img
        src={trip.imageUrl}
        alt={`View of ${trip.destination}`}
        className={styles.tripImage}
      />

      <div className={styles.detailsCard}>
        <div className={styles.tripHeader}>
          <h1>
            {trip.source} → {trip.destination}
          </h1>
          <p className={styles.tripPrice}>${trip.price} per seat</p>
        </div>

        <p className={styles.tripDate}>
          {new Date(trip.date).toLocaleDateString()} at {trip.time}
        </p>

        <div style={{ margin: '1rem 0' }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Choose Date</label>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block', marginBottom: 6 }}>From</label>
          <input
            type="text"
            value={selectedFromLocal}
            onChange={(e) => setSelectedFromLocal(e.target.value)}
            placeholder="Departure city"
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <SeatSelector
          bookedSeats={trip.bookedSeats}
          selectedSeats={selectedSeats}
          onSeatSelect={setSelectedSeats}
        />

        <div className={styles.summary}>
          <span>{t('selectedSeats')}: {selectedSeats.join(", ") || "None"}</span>
          <span>{t('total')}: ${trip.price * selectedSeats.length}</span>
        </div>

        <button onClick={handleConfirmBooking} className={styles.confirmButton}>
          {t('confirmBooking')}
        </button>
        <button onClick={handleAddToMyTrips} className={styles.confirmButton} style={{ marginLeft: 12 }}>
          {t('addToMyTripsBtn')}
        </button>
      </div>
    </div>
  );
};

export default TripDetailsPage;