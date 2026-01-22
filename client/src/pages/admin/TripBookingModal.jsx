import React, { useContext } from "react";
import { LocaleContext } from "../../context/LocaleContext";
import Modal from "../../components/common/Modal";
import styles from "./AdminDashboardPage.module.css";

const TripBookingsModal = ({ isOpen, onClose, bookings, trip }) => {

  const { locale, formatCurrency } = useContext(LocaleContext);

  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <h2>
          Trip Details: {trip.placeName} - {trip.destination}
        </h2>

        {/* Trip Information Section */}
        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
          <h3>Trip Information</h3>
          {trip.imageUrl && (
            <img 
              src={trip.imageUrl} 
              alt={trip.placeName} 
              style={{ width: "100%", maxHeight: "250px", borderRadius: "5px", marginBottom: "15px", objectFit: "cover" }} 
            />
          )}
          
          {trip.description && (
            <div style={{ marginBottom: "15px" }}>
              <strong>Place Description:</strong>
              <p>{trip.description}</p>
            </div>
          )}

          {trip.attractions && trip.attractions.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <strong>Popular Attractions:</strong>
              <ul>
                {trip.attractions.map((attraction, idx) => (
                  <li key={idx}>
                    {attraction.name} - ₹{attraction.price}
                    {attraction.imagePath && (
                      <div>
                        <img 
                          src={attraction.imagePath} 
                          alt={attraction.name} 
                          style={{ width: "100%", maxHeight: "150px", borderRadius: "3px", marginTop: "5px", objectFit: "cover" }} 
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div><strong>Date:</strong> {new Date(trip.date).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`)}</div>
            <div><strong>Time:</strong> {trip.time}</div>
            <div><strong>Trip Cost:</strong> {formatCurrency(trip.tripCost)}</div>
            <div><strong>Total Seats:</strong> {trip.totalSeats}</div>
            <div><strong>Booked Seats:</strong> {trip.bookedSeats?.length || 0}</div>
            <div><strong>Available Seats:</strong> {trip.totalSeats - (trip.bookedSeats?.length || 0)}</div>
          </div>
        </div>

        {/* Bookings Section */}
        <h3 style={{ marginTop: "30px" }}>Bookings</h3>
        {bookings.length > 0 ? (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Seats</th>
                  <th>Amount Paid</th>
                  <th>Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  return (
                    <tr key={booking._id}>
                      <td>{booking.user?.name || 'N/A'}</td>
                      <td>{booking.user?.email || 'N/A'}</td>
                      <td>{booking.seats.join(", ")}</td>
                      <td>{formatCurrency(booking.totalAmount || 0)}</td>
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
      </div>
    </Modal>
  );
};

export default TripBookingsModal;
