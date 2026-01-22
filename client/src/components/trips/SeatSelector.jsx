

import React from "react";
import styles from "./SeatSelector.module.css";

// Lower Deck Layout - Mixed sleeper and seat arrangement
const lowerDeckSeats = [
  // Row 1: 2 regular seats
  { id: 'L1', type: 'seat', price: 359, row: 1, col: 2, rowSpan: 1 },
  { id: 'L2', type: 'seat', price: 359, row: 1, col: 3, rowSpan: 1 },
  // Row 2: 2 regular seats
  { id: 'L3', type: 'seat', price: 359, row: 2, col: 2, rowSpan: 1 },
  { id: 'L4', type: 'seat', price: 359, row: 2, col: 3, rowSpan: 1 },
  // Row 3: 1 sleeper on left (takes 2 rows), 1 seat, 2 seats on right
  { id: 'L5', type: 'sleeper', price: null, row: 3, col: 1, rowSpan: 2, sold: true },
  { id: 'L6', type: 'seat', price: 359, row: 3, col: 2, rowSpan: 1 },
  { id: 'L7', type: 'seat', price: null, row: 3, col: 3, rowSpan: 1, sold: true },
  // Row 4: seats continue (L5 sleeper spans here), 2 seats
  { id: 'L8', type: 'seat', price: null, row: 4, col: 2, rowSpan: 1, sold: true },
  { id: 'L9', type: 'seat', price: null, row: 4, col: 3, rowSpan: 1, sold: true },
  // Row 5: 1 sleeper, 2 seats
  { id: 'L10', type: 'sleeper', price: null, row: 5, col: 1, rowSpan: 2, sold: true },
  { id: 'L11', type: 'seat', price: 359, row: 5, col: 2, rowSpan: 1 },
  { id: 'L12', type: 'seat', price: 379, row: 5, col: 3, rowSpan: 1 },
  // Row 6: (L10 sleeper spans here), 2 seats
  { id: 'L13', type: 'seat', price: null, row: 6, col: 2, rowSpan: 1, sold: true },
  { id: 'L14', type: 'seat', price: null, row: 6, col: 3, rowSpan: 1, sold: true },
  // Row 7: 1 sleeper, 1 seat, 1 seat
  { id: 'L15', type: 'sleeper', price: null, row: 7, col: 1, rowSpan: 2, sold: true },
  { id: 'L16', type: 'seat', price: null, row: 7, col: 2, rowSpan: 1, sold: true },
  { id: 'L17', type: 'seat', price: 379, row: 7, col: 3, rowSpan: 1 },
  // Row 8: (L15 sleeper spans here), 2 seats
  { id: 'L18', type: 'seat', price: null, row: 8, col: 2, rowSpan: 1, sold: true },
  { id: 'L19', type: 'seat', price: null, row: 8, col: 3, rowSpan: 1, sold: true },
  // Row 9: Regular berth (tall), 2 regular seats
  { id: 'L20', type: 'sleeper', price: 799, row: 9, col: 1, rowSpan: 2 },
  { id: 'L21', type: 'seat', price: 359, row: 9, col: 2, rowSpan: 1 },
  { id: 'L22', type: 'seat', price: 359, row: 9, col: 3, rowSpan: 1 },
  // Row 10: (L20 berth spans here), 2 seats
  { id: 'L23', type: 'seat', price: 359, row: 10, col: 2, rowSpan: 1 },
  { id: 'L24', type: 'seat', price: 359, row: 10, col: 3, rowSpan: 1 },
];

// Upper Deck Layout - Sleeper berths (tall rectangles) in 2 columns
const upperDeckSeats = [
  // Row 1: 1 tall sleeper, 1 sold
  { id: 'U1', type: 'sleeper', price: 549, row: 1, col: 1, rowSpan: 2 },
  { id: 'U2', type: 'sleeper', price: null, row: 1, col: 2, rowSpan: 2, sold: true },
  // Row 3: 2 sleepers (another sold on left)
  { id: 'U3', type: 'sleeper', price: null, row: 3, col: 1, rowSpan: 2, sold: true },
  { id: 'U4', type: 'sleeper', price: 579, row: 3, col: 2, rowSpan: 2 },
  { id: 'U5', type: 'sleeper', price: 579, row: 3, col: 3, rowSpan: 2 },
  // Row 5: 2 more sleepers
  { id: 'U6', type: 'sleeper', price: null, row: 5, col: 1, rowSpan: 2, sold: true },
  { id: 'U7', type: 'sleeper', price: 579, row: 5, col: 2, rowSpan: 2 },
  { id: 'U8', type: 'sleeper', price: 579, row: 5, col: 3, rowSpan: 2 },
  // Row 7: 2 more sleepers
  { id: 'U9', type: 'sleeper', price: null, row: 7, col: 1, rowSpan: 2, sold: true },
  { id: 'U10', type: 'sleeper', price: 579, row: 7, col: 2, rowSpan: 2 },
  { id: 'U11', type: 'sleeper', price: 579, row: 7, col: 3, rowSpan: 2 },
  // Row 9: 2 more sleepers
  { id: 'U12', type: 'sleeper', price: 759, row: 9, col: 1, rowSpan: 2 },
  { id: 'U13', type: 'sleeper', price: 549, row: 9, col: 2, rowSpan: 2 },
  { id: 'U14', type: 'sleeper', price: 549, row: 9, col: 3, rowSpan: 2 },
];

// Export seat data for use in other components
export const allSeats = [...lowerDeckSeats, ...upperDeckSeats];

// Helper function to get seat price by ID
export const getSeatPrice = (seatId) => {
  const seat = allSeats.find(s => s.id === seatId);
  return seat?.price || 0;
};

// Helper function to calculate total price for selected seats
export const calculateTotalPrice = (selectedSeats) => {
  return selectedSeats.reduce((total, seatId) => {
    return total + getSeatPrice(seatId);
  }, 0);
};

const SeatSelector = ({
  bookedSeats = [],
  selectedSeats = [],
  onSeatSelect,
}) => {

  const handleSeatClick = (seatId) => {
    const seat = allSeats.find(s => s.id === seatId);
    if (seat?.sold || bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      onSeatSelect(selectedSeats.filter((s) => s !== seatId));
    } else {
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  const renderSeat = (seat, isUpperDeck = false) => {
    const isBooked = seat.sold || bookedSeats.includes(seat.id);
    const isSelected = selectedSeats.includes(seat.id);
    const isSleeper = seat.type === 'sleeper';

    return (
      <button
        key={seat.id}
        type="button"
        onClick={() => handleSeatClick(seat.id)}
        className={`${styles.seat} 
          ${isSleeper ? styles.sleeperSeat : styles.regularSeat}
          ${isBooked ? styles.sold : styles.available} 
          ${isSelected ? styles.selected : ""}`}
        title={isBooked ? "Sold" : seat.price ? `₹${seat.price}` : ""}
        disabled={isBooked}
        style={{
          gridColumn: seat.col,
          gridRow: `${seat.row} / span ${seat.rowSpan}`
        }}
      >
        {isBooked ? (
          <span className={styles.soldText}>Sold</span>
        ) : (
          <>
            <span className={styles.seatIcon}>
              {isSleeper ? '💺' : '💺'}
            </span>
            {seat.price && <span className={styles.priceText}>₹{seat.price}</span>}
          </>
        )}
      </button>
    );
  };

  return (
    <div className={styles.seatSelector}>
      <h3 className={styles.title}>Select Your Seat(s)</h3>

      <div className={styles.deckContainer}>
        {/* Lower Deck Section */}
        <div className={styles.deckSection}>
          <div className={styles.deckHeader}>
            <h4 className={styles.deckTitle}>Lower deck</h4>
            <div className={styles.driverIcon}>
              <svg className={styles.steeringWheel} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className={styles.busLayout}>
            <div className={styles.lowerDeckGrid}>
              {lowerDeckSeats.map((seat) => renderSeat(seat, false))}
            </div>
          </div>
        </div>

        {/* Upper Deck Section */}
        <div className={styles.deckSection}>
          <h4 className={styles.deckTitle}>Upper deck</h4>
          <div className={styles.busLayout}>
            <div className={styles.upperDeckGrid}>
              {upperDeckSeats.map((seat) => renderSeat(seat, true))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <p>
          <span className={`${styles.legendItem} ${styles.available}`}></span>
          Available
        </p>
        <p>
          <span className={`${styles.legendItem} ${styles.booked}`}></span>
          Booked
        </p>
        <p>
          <span className={`${styles.legendItem} ${styles.selected}`}></span>
          Selected
        </p>
      </div>

      <div className={styles.bookedSeatsInfo}>
        <strong>Booked Seats:</strong> {bookedSeats.join(", ") || "None"}
      </div>
    </div>
  );
};

export default SeatSelector;
