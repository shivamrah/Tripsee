import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HotelsPage.module.css";

const sampleRooms = [
    { id: "std", name: "Standard Room", price: 2500, desc: "Comfortable room with queen bed" },
    { id: "dlx", name: "Deluxe Room", price: 4200, desc: "Larger room with city view" },
    { id: "sui", name: "Suite", price: 7800, desc: "Spacious suite with lounge" },
];

const formatDate = (d) => {
    try {
        return new Date(d).toLocaleDateString();
    } catch (e) {
        return d;
    }
};

const HotelsPage = () => {
    const loc = useLocation();
    const navigate = useNavigate();
    const prefilledTrip = loc.state && loc.state.trip ? loc.state.trip : null;

    const [step, setStep] = useState("selectRoom");
    const [selectedRoom, setSelectedRoom] = useState(sampleRooms[0]);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [processing, setProcessing] = useState(false);
    const [booking, setBooking] = useState(null);

    const nights = (() => {
        if (!checkIn || !checkOut) return 0;
        const a = new Date(checkIn);
        const b = new Date(checkOut);
        const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();

    const totalPrice = selectedRoom ? selectedRoom.price * Math.max(1, nights) : 0;

    const handlePay = async () => {
        if (!checkIn || !checkOut || nights <= 0) {
            alert("Please choose valid check-in and check-out dates.");
            return;
        }
        setProcessing(true);
        // simulate payment delay
        await new Promise((r) => setTimeout(r, 1400));
        const roomNo = Math.floor(100 + Math.random() * 800);
        const id = `H-${Date.now().toString(36).slice(-6).toUpperCase()}`;
        const now = new Date();
        const newBooking = {
            id,
            roomNo,
            roomType: selectedRoom.name,
            pricePerNight: selectedRoom.price,
            nights,
            total: totalPrice,
            checkIn,
            checkOut,
            createdAt: now.toISOString(),
            trip: prefilledTrip,
        };
        // store to localStorage for persistence
        try {
            const raw = localStorage.getItem("hotelBookings") || "[]";
            const arr = JSON.parse(raw);
            arr.unshift(newBooking);
            localStorage.setItem("hotelBookings", JSON.stringify(arr));
        } catch (e) {
            // ignore storage failures
        }
        setBooking(newBooking);
        setProcessing(false);
        setStep("receipt");
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Book Hotel{prefilledTrip ? ` — ${prefilledTrip.title || prefilledTrip}` : ""}</h1>

            {step === "selectRoom" && (
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>Choose Room</div>
                    <div className={styles.roomList}>
                        {sampleRooms.map((r) => (
                            <div
                                key={r.id}
                                className={`${styles.roomCard} ${selectedRoom && selectedRoom.id === r.id ? styles.selected : ""}`}
                                onClick={() => setSelectedRoom(r)}
                            >
                                <div className={styles.roomName}>{r.name}</div>
                                <div className={styles.roomDesc}>{r.desc}</div>
                                <div className={styles.roomPrice}>₹{r.price.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.btnPrimary} onClick={() => setStep("dates")}>Next: Dates</button>
                        <button className={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </div>
            )}

            {step === "dates" && (
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>Select Check-in & Check-out</div>
                    <div className={styles.dateRow}>
                        <label className={styles.label}>Check-in</label>
                        <input className={`${styles.dateInput} ${styles.short}`} type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                        <label className={styles.label}>Check-out</label>
                        <input className={`${styles.dateInput} ${styles.wide}`} type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                    <div className={styles.summary}>
                        <div>Nights: {nights}</div>
                        <div>Per night: ₹{selectedRoom.price.toLocaleString()}</div>
                        <div className={styles.total}>Total: ₹{totalPrice.toLocaleString()}</div>
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.btnPrimary} onClick={() => setStep("payment")}>Proceed to Payment</button>
                        <button className={styles.btnGhost} onClick={() => setStep("selectRoom")}>Back</button>
                    </div>
                </div>
            )}

            {step === "payment" && (
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>Mock Payment</div>
                    <div className={styles.paymentArea}>
                        <p>Amount to pay: <strong>₹{totalPrice.toLocaleString()}</strong></p>
                        <p>Payment method: Mock Card</p>
                        <div className={styles.controls}>
                            <button className={styles.btnPrimary} disabled={processing} onClick={handlePay}>{processing ? "Processing…" : "Pay Now (Mock)"}</button>
                            <button className={styles.btnGhost} onClick={() => setStep("dates")}>Back</button>
                        </div>
                    </div>
                </div>
            )}

            {step === "receipt" && booking && (
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>Booking Receipt</div>
                    <div className={styles.receipt}>
                        <div><strong>Booking ID:</strong> {booking.id}</div>
                        <div><strong>Room No:</strong> {booking.roomNo}</div>
                        <div><strong>Room Type:</strong> {booking.roomType}</div>
                        <div><strong>Check-in:</strong> {formatDate(booking.checkIn)}</div>
                        <div><strong>Check-out:</strong> {formatDate(booking.checkOut)}</div>
                        <div><strong>Nights:</strong> {booking.nights}</div>
                        <div><strong>Price / night:</strong> ₹{booking.pricePerNight.toLocaleString()}</div>
                        <div className={styles.totalRow}><strong>Total Paid:</strong> ₹{booking.total.toLocaleString()}</div>
                        {booking.trip && (
                            <div className={styles.tripInfo}><em>Trip: {booking.trip.title || booking.trip}</em></div>
                        )}
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.btnPrimary} onClick={() => window.print()}>Print / Save</button>
                        <button className={styles.btnGhost} onClick={() => navigate('/my-bookings')}>Go to My Bookings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelsPage;
