
import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./CheckoutPage.module.css";
import Modal from "../components/common/Modal";
import { getSeatPrice } from "../components/trips/SeatSelector";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, locale, formatCurrency } = useContext(LocaleContext);


  const [fullName, setFullName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState((state && state.paymentType) || "card");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);

  const { trip, selectedSeats, totalAmount } = state || {};
  // support both `selectedFrom` (older) and `fromLocation` (newer) and travelDate passed from previous steps
  const selectedFrom = (state && (state.selectedFrom || state.fromLocation)) || "";
  const travelDateFromState = (state && (state.travelDate || state.travelDate)) || null;
  const routeFrom = selectedFrom || (trip && trip.placeName) || "";

  // Package booking support
  const isPackageBooking = state && state._isPackage;
  const packageItems = state && state._packageItems;
  const packageState = state && state._packageState;

  // UPI fields
  const [upiName, setUpiName] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!trip) {
      navigate("/");
    }
  }, [trip, navigate]);

  const handleCompletePayment = async () => {

    if (!fullName || !email || !phone) {
      setError("Please fill in all your information.");
      return;
    }
    // allow booking of example trips by sending a trip snapshot
    if (!user || !user.token) {
      // ensure user is logged in before attempting booking
      navigate('/login');
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post(
        "/bookings",
        {
          tripId: trip._id,
          seats: selectedSeats,
          totalAmount: totalAmount,
          travelDate: travelDateFromState || trip.date,
          fromLocation: selectedFrom,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          ...(trip && trip._isExample ? { tripSnapshot: trip } : {}),
        },
      );
      // Show success modal, then navigate on confirmation
      setCreatedBooking(data);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Booking failed. The seats may have been taken."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpiRequest = async () => {
    if (!upiName || !upiId) {
      setError("Please enter UPI name and UPI ID.");
      return;
    }
    setLoading(true);
    setError("");
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    // allow booking of example trips by sending a trip snapshot
    try {
      // Try to send a payment request (mock endpoint). If server doesn't support it, we'll ignore the failure and continue to booking.
      await API.post(
        "/payments/request",
        { upiName, upiId, amount: totalAmount },
        // API interceptor attaches token
      );

      // After requesting payment, create the booking
      const { data } = await API.post(
        "/bookings",
        {
          tripId: trip._id,
          seats: selectedSeats,
          totalAmount: totalAmount,
          paymentInfo: { method: "UPI", upiName, upiId },
          travelDate: travelDateFromState || trip.date,
          fromLocation: selectedFrom,
          ...(trip && trip._isExample ? { tripSnapshot: trip } : {}),
        }
      );
      setCreatedBooking(data);
      setIsSuccessModalOpen(true);
    } catch (err) {
      // If payment request endpoint not available, still attempt booking and show a friendly message
      try {
        const { data } = await API.post(
          "/bookings",
          {
            tripId: trip._id,
            seats: selectedSeats,
            totalAmount: totalAmount,
            paymentInfo: { method: "UPI", upiName, upiId },
            travelDate: travelDateFromState || trip.date,
            fromLocation: selectedFrom,
            customerName: fullName,
            customerEmail: email,
            customerPhone: phone,
            customerName: fullName,
            customerEmail: email,
            customerPhone: phone,
            ...(trip && trip._isExample ? { tripSnapshot: trip } : {}),
          }
        );
        setCreatedBooking(data);
        setIsSuccessModalOpen(true);
      } catch (err2) {
        setError(
          err2.response?.data?.message ||
          "Unable to complete booking. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return <p>{t('loading')}</p>;
  }

  const simulateAndPay = (method) => {
    setError("");
    // open small processing modal, then call the actual handler
    setIsMockPaymentOpen(true);
    setTimeout(async () => {
      setIsMockPaymentOpen(false);
      if (method === 'upi') {
        await handleUpiRequest();
      } else {
        await handleCompletePayment();
      }
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      <h1>{t('proceedToPayment')}</h1>
      <div className={styles.checkoutLayout}>

        <div className={styles.formSection}>
          <div className={styles.infoCard}>
            <h3>Your Information</h3>
            <p className={styles.infoSubtitle}>
              Please provide your contact details for this booking.
            </p>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
              />
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Payment Method</h3>
            <div className={styles.paymentOptions}>
              <div
                className={`${styles.paymentMethod} ${paymentMethod === "card" ? styles.selected : ""
                  }`}
                onClick={() => setPaymentMethod("card")}
              >
                <input
                  type="radio"
                  id="creditCard"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  readOnly
                />
                <label htmlFor="creditCard">Credit or Debit Card</label>
              </div>
              <div
                className={`${styles.paymentMethod} ${paymentMethod === "digital" ? styles.selected : ""
                  }`}
                onClick={() => setPaymentMethod("digital")}
              >
                <input
                  type="radio"
                  id="digitalWallet"
                  name="payment"
                  value="digital"
                  checked={paymentMethod === "digital"}
                  readOnly
                />
                <label htmlFor="digitalWallet">
                  Digital Wallet (e.g., PayPal, Apple Pay)
                </label>
              </div>
            </div>
            <div
              className={`${styles.paymentMethod} ${paymentMethod === "upi" ? styles.selected : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              <input
                type="radio"
                id="upi"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                readOnly
              />
              <label htmlFor="upi">UPI (Request payment to UPI ID)</label>
              {paymentMethod === "upi" && (
                <div className={styles.upiForm}>
                  <div className={styles.inputGroup}>
                    <label>UPI Holder Name</label>
                    <input
                      type="text"
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      placeholder="Name on UPI"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                    />
                  </div>
                  <p className={styles.mockNotice}>
                    The app will attempt to request the amount to the provided UPI ID and then complete the booking.
                  </p>
                </div>
              )}
            </div>
            {paymentMethod === "card" && (
              <div className={styles.cardDetails}>
                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <input type="text" placeholder="**** **** **** ****" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Cardholder Name</label>

                  <input type="text" placeholder="Name on Card" />
                </div>
                <div className={styles.gridTwo}>
                  <div className={styles.inputGroup}>
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <input type="text" placeholder="***" />
                  </div>
                </div>
              </div>
            )}
            <p className={styles.mockNotice}>
              This is a mock payment. No real transaction will occur unless your backend integrates UPI.
            </p>
          </div>
        </div>


        <div className={styles.summarySection}>
          <h3>Booking Summary</h3>
          <div className={styles.summaryCard}>
            <div className={styles.summaryImage}>✈️</div>
            {isPackageBooking ? (
              <>
                <p>
                  <strong>Package:</strong> {packageState}
                </p>
                <p>
                  <strong>From:</strong> {routeFrom}
                </p>
                <p>
                  <strong>Included Places:</strong>
                </p>
                <ul style={{ marginLeft: 20, color: '#475569' }}>
                  {packageItems && packageItems.map((item, idx) => (
                    <li key={idx}>Day {item.day || idx + 1}: {item.title}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p>
                  <strong>Route:</strong> {routeFrom} to {trip?.destination || ""}
                </p>
                <p>
                  <strong>{t('dateLabel')}: </strong> {new Date(travelDateFromState || trip.date).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`)}
                </p>
                <p>
                  <strong>Time:</strong> {trip.time}
                </p>
                <p>
                  <strong>Seats:</strong> {selectedSeats.join(", ")}
                </p>
                <p>
                  <strong>Number of Tickets:</strong> {selectedSeats.length}
                </p>
              </>
            )}
            <hr className={styles.divider} />
            {selectedSeats && selectedSeats.length > 0 && (
              <>
                <div style={{ padding: '0.75rem', marginBottom: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <p style={{ margin: '0.5rem 0', color: '#374151', fontWeight: '600' }}>Seat Prices:</p>
                  {selectedSeats.map((seatId) => (
                    <p key={seatId} style={{ margin: '0.25rem 0 0.25rem 1rem', color: '#4b5563', fontSize: '0.9rem' }}>
                      {seatId}: {formatCurrency(getSeatPrice(seatId))}
                    </p>
                  ))}
                </div>
              </>
            )}
            <p className={styles.totalFare} style={{ backgroundColor: '#0ea5e9', color: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <strong>Package Total:</strong> {formatCurrency(totalAmount)}
            </p>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {paymentMethod === 'upi' ? (
            <button
              onClick={() => simulateAndPay('upi')}
              className={styles.paymentButton}
              disabled={loading}
            >
              {loading ? t('processing') : t('sendUpiAndBook')}
            </button>
          ) : (
            <button
              onClick={() => simulateAndPay('card')}
              className={styles.paymentButton}
              disabled={loading}
            >
              {loading ? t('processing') : t('completePayment')}
            </button>
          )}
        </div>
      </div>
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          if (createdBooking) navigate("/confirmation", { state: { bookingDetails: createdBooking, trip: { ...trip, _packageItems: packageItems, _packageState: packageState, _isPackage: isPackageBooking } } });
        }}
      >
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Payment Completed Successfully</h2>
          <p>Enjoy your trip! Your booking has been confirmed.</p>
          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              if (createdBooking) navigate("/confirmation", { state: { bookingDetails: createdBooking, trip: { ...trip, _packageItems: packageItems, _packageState: packageState, _isPackage: isPackageBooking } } });
            }}
            style={{ marginTop: 12 }}
          >
            OK
          </button>
        </div>
      </Modal>
      <Modal isOpen={isMockPaymentOpen} onClose={() => { }}>
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h3>Processing payment</h3>
          <p>Please wait while we process your payment...</p>
          <div style={{ marginTop: 12 }}>
            <div className={styles.spinner} aria-hidden="true" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;