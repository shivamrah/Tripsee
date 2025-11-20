import React from "react";
import Modal from "../../components/common/Modal";
import styles from "./AdminDashboardPage.module.css";

const TripBookingsModal = ({ isOpen, onClose, bookings, trip }) => {

  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>
        Bookings for {trip.source} to {trip.destination}
      </h2>

      {bookings.length > 0 ? (
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Amount Paid</th>
                <th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const tripInfo = booking.tripInfo || booking.trip || booking.tripSnapshot || {};
                const from = booking.fromLocation || tripInfo.source || tripInfo.title || 'N/A';
                const to = tripInfo.destination || (tripInfo.attractions && tripInfo.attractions[0]?.name) || tripInfo.title || 'N/A';
                const date = booking.travelDate ? new Date(booking.travelDate) : tripInfo.date ? new Date(tripInfo.date) : booking.trip ? new Date(booking.trip.date) : null;
                return (
                  <tr key={booking._id}>
                    <td>{booking.user?.name || 'N/A'}</td>
                    <td>{booking.user?.email || 'N/A'}</td>
                    <td>{from}</td>
                    <td>{to}</td>
                    <td>{date ? date.toLocaleDateString() : 'N/A'}</td>
                    <td>{booking.seats.join(", ")}</td>
                    <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(booking.totalAmount || 0)}</td>
                    <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>There are no bookings for this trip yet.</p>
      )}
    </Modal>
  );
};

export default TripBookingsModal;
