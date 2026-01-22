
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import SeatSelector, { calculateTotalPrice, getSeatPrice } from "../components/trips/SeatSelector";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./TripDetailsPage.module.css";
import toast, { Toaster } from "react-hot-toast";
import STATE_INFO from "../data/stateInfo";

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, locale, formatCurrency } = useContext(LocaleContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFromLocal, setSelectedFromLocal] = useState("");
  const location = useLocation();
  const focusDateRequested = location?.state?.focusDate;
  const dateInputRef = React.useRef(null);

  // Day-wise booking state
  const [dayWiseMode, setDayWiseMode] = useState(false);
  const [day1Places, setDay1Places] = useState([]);
  const [day2Places, setDay2Places] = useState([]);
  const [day1Seats, setDay1Seats] = useState([]);
  const [day2Seats, setDay2Seats] = useState([]);

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

      // Initialize day-wise booking if data is passed
      if (location?.state?.dayWiseBooking) {
        setDayWiseMode(true);
        setDay1Places(location.state.day1Places || []);
        setDay2Places(location.state.day2Places || []);
      }
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

    // Day-wise booking validation
    if (dayWiseMode) {
      if (day1Seats.length === 0) {
        toast.error("Please select seats for Day 1");
        return;
      }
      if (day2Seats.length === 0) {
        toast.error("Please select seats for Day 2");
        return;
      }
      if (day1Seats.length !== day1Places.length) {
        toast.error(`Day 1: Select ${day1Places.length} seats for ${day1Places.length} places`);
        return;
      }
      if (day2Seats.length !== day2Places.length) {
        toast.error(`Day 2: Select ${day2Places.length} seats for ${day2Places.length} places`);
        return;
      }
    } else {
      if (selectedSeats.length === 0) {
        toast.error(t('pleaseSelectSeat'));
        return;
      }
    }

    if (!selectedDate) {
      toast.error(t('pleaseSelectDate'));
      return;
    }
    if (!selectedFromLocal) {
      toast.error(t('pleaseSelectDeparture'));
      return;
    }

    // ensure date is not in the past
    const today = new Date();
    const chosen = new Date(selectedDate + "T00:00:00");
    if (chosen.setHours(0, 0, 0, 0) < new Date(today.setHours(0, 0, 0, 0))) {
      toast.error(t('pleaseChooseValidDate'));
      return;
    }

    // Pass the selected date in the trip object so checkout/confirmation show the chosen date
    const tripWithDate = { ...trip, date: new Date(selectedDate).toISOString() };

    // Calculate total based on actual seat prices
    const calculatedTotal = calculateTotalPrice(selectedSeats);

    // Create booking payload based on mode
    let bookingState = {
      trip: tripWithDate,
      selectedSeats,
      totalAmount: calculatedTotal,
      selectedFrom: selectedFromLocal,
    };

    if (dayWiseMode) {
      const day1Total = calculateTotalPrice(day1Seats);
      const day2Total = calculateTotalPrice(day2Seats);
      bookingState = {
        ...bookingState,
        dayWiseBooking: true,
        day1Places,
        day1Seats,
        day2Places,
        day2Seats,
        totalAmount: day1Total + day2Total
      };
    }

    navigate("/checkout", { state: bookingState });
  };

  if (loading) return <p>{t('loading')} trip details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!trip) return <p>{t('noData')}.</p>;
  
  // Get state info for attractions
  const stateInfo = STATE_INFO[trip.state];

  // If this is a mock/example trip generated by the client, show attractions with images
  if (trip._isExample) {
    return (
      <div className={styles.pageContainer}>
        <Toaster position="top-center" reverseOrder={false} />
        <img src={trip.imageUrl} alt={trip.placeName} className={styles.tripImage} />
        <div className={styles.detailsCard}>
          <div className={styles.tripHeader}>
            <h1>
              {trip.placeName} — {t('bookNow')}
            </h1>
          </div>

          <p className={styles.tripDate}>{new Date(trip.date).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`)}</p>

          {stateInfo && stateInfo.attractions && stateInfo.attractions.length > 0 && (
            <div className={styles.attractionsGrid}>
              {stateInfo.attractions.map((a) => (
                <div key={a.name} className={styles.attractionCard}>
                  <img
                    src={a.imagePath || `https://source.unsplash.com/400x300/?${encodeURIComponent(a.name)}`}
                    alt={a.name}
                    className={styles.attractionImage}
                  />
                  <div className={styles.attractionBody}>
                    <h3>{a.name}</h3>
                    <p className={styles.priceBadge}>{formatCurrency(a.price + 5000, { maximumFractionDigits: 0 })} {t('perPerson')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={{ marginTop: "1rem" }}>
            These are sample popular places for {trip.state}. Real trip bookings are not available for example trips.
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
            {trip.placeName} - {trip.destination}
          </h1>
          <p className={styles.tripPrice}>{formatCurrency(trip.tripCost)} per seat</p>
        </div>

        <p className={styles.tripDate}>
          {new Date(trip.date).toLocaleDateString()} at {trip.time}
        </p>

        {trip.description && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            borderLeft: '4px solid #1976d2'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>About {trip.placeName}</h3>
            <p style={{ margin: 0 }}>{trip.description}</p>
          </div>
        )}

        {trip.attractions && trip.attractions.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1976d2' }}>Popular Attractions in {trip.destination}</h3>
            <div className={styles.attractionsGrid}>
              {trip.attractions.map((a) => (
                <div key={a.name} className={styles.attractionCard}>
                  <img
                    src={a.imagePath || `https://source.unsplash.com/400x300/?${encodeURIComponent(a.name)}`}
                    alt={a.name}
                    className={styles.attractionImage}
                  />
                  <div className={styles.attractionBody}>
                    <h3>{a.name}</h3>
                    <p className={styles.priceBadge}>{formatCurrency(a.price + 5000, { maximumFractionDigits: 0 })} {t('perPerson')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Day-wise Booking Display */}
        {dayWiseMode && (day1Places.length > 0 || day2Places.length > 0) && (
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #06b6d4',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#06b6d4' }}>📅 Day-wise Itinerary</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #06b6d4'
              }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: '#06b6d4' }}>Day 1 - Attractions</h4>
                {day1Places.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                    {day1Places.map((place, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>{place}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#9ca3af' }}>No places selected</p>
                )}
                <div style={{ marginTop: '0.8rem' }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', color: '#374151' }}>Seats for Day 1</label>
                  <input
                    type="text"
                    placeholder="e.g., A1, A2, B1, B2"
                    value={day1Seats.join(', ')}
                    onChange={(e) => setDay1Seats(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #06b6d4'
              }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: '#06b6d4' }}>Day 2 - Attractions</h4>
                {day2Places.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                    {day2Places.map((place, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>{place}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#9ca3af' }}>No places selected</p>
                )}
                <div style={{ marginTop: '0.8rem' }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', color: '#374151' }}>Seats for Day 2</label>
                  <input
                    type="text"
                    placeholder="e.g., C1, C2, D1, D2"
                    value={day2Seats.join(', ')}
                    onChange={(e) => setDay2Seats(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <SeatSelector
          bookedSeats={trip.bookedSeats}
          selectedSeats={selectedSeats}
          onSeatSelect={setSelectedSeats}
        />

        <div className={styles.summary}>
          <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1rem' }}>
            <p style={{ margin: '0.5rem 0', color: '#1f2937' }}>
              <strong>Selected Seats:</strong> {selectedSeats.join(", ") || "None"}
            </p>
            {selectedSeats.length > 0 && (
              <>
                <p style={{ margin: '0.5rem 0', color: '#1f2937' }}>
                  <strong>Number of Tickets:</strong> {selectedSeats.length}
                </p>
                <hr style={{ margin: '0.75rem 0', borderColor: '#e5e7eb' }} />
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ margin: '0.5rem 0', color: '#374151', fontWeight: '600' }}>Seat Prices:</p>
                  {selectedSeats.map((seatId) => (
                    <p key={seatId} style={{ margin: '0.25rem 0 0.25rem 1rem', color: '#4b5563', fontSize: '0.95rem' }}>
                      {seatId}: {formatCurrency(getSeatPrice(seatId))}
                    </p>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', padding: '1rem', backgroundColor: '#0ea5e9', borderRadius: '8px', textAlign: 'center' }}>
                  Package Total: {formatCurrency(calculateTotalPrice(selectedSeats))}
                </div>
              </>
            )}
          </div>
        </div>

        <button onClick={handleConfirmBooking} className={styles.confirmButton}>
          {t('confirmBooking')}
        </button>
      </div>
    </div>
  );
};

export default TripDetailsPage;