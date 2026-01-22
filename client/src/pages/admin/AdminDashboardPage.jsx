

import React, { useState, useEffect, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { LocaleContext } from "../../context/LocaleContext";
import AddEditTripModal from "./AddEditTripModal";
import TripBookingsModal from "./TripBookingModal";
import EditBookingModal from "./EditBookingModal";
import Modal from "../../components/common/Modal";
import styles from "./AdminDashboardPage.module.css";

const AdminDashboardPage = () => {
  // --- STATES ---
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // States for the details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTripBookings, setSelectedTripBookings] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Error state
  const [errorMessage, setErrorMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const { t, locale, formatCurrency } = useContext(LocaleContext);


  const fetchData = async () => {
    try {
      setLoading(true);

      const [tripsRes, bookingsRes] = await Promise.all([
        API.get("/trips"),
        API.get("/bookings/all", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
      setTrips(tripsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);


  const handleOpenModal = (trip = null) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
  };

  const handleSaveTrip = async (tripData) => {
    const payload = {
      placeName: tripData.placeName,
      destination: tripData.destination,
      state: tripData.state,
      description: tripData.description,
      tripCost: tripData.tripCost,
      date: tripData.date,
      time: tripData.time,
      totalSeats: tripData.totalSeats,
      imageUrl: tripData.imageUrl,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setIsSaving(true);
      if (editingTrip) {
        await API.put(`/trips/${editingTrip._id}`, payload, config);
      } else {
        await API.post("/trips", payload, config);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save trip", error);
      const errorMessage = error.response?.data?.message || error.message || t('failedToSaveTrip');
      setErrorMessage(errorMessage);
      setIsErrorModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await API.delete(`/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchData();
      } catch (error) {
        console.error("Failed to delete trip", error);
      }
    }
  };


  const handleViewDetails = async (trip) => {
    setSelectedTrip(trip);
    try {
      const { data } = await API.get(`/trips/${trip._id}/bookings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedTripBookings(data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch trip bookings", error);
      alert(t('couldNotLoadBookingDetails'));
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsEditBookingOpen(true);
  };

  const handleCloseEditBooking = () => {
    setIsEditBookingOpen(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(t('confirmDeleteBooking'))) return;
    try {
      await API.delete(`/bookings/${bookingId}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete booking', err);
      alert(t('failedToDeleteBooking'));
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  if (loading) return <p>{t('loadingDashboard')}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <h1>{t('adminDashboard')}</h1>
      <button
        onClick={() => handleOpenModal()}
        className={styles.addTripButton}
      >
        {t('addNewTrip')}
      </button>


      <div className={styles.tableContainer}>
        <h2>{t('tripManagement')}</h2>
        <table>
          <thead>
            <tr>
              <th>{t('placeName') || 'Place Name'}</th>
              <th>{t('destination') || 'Destination'}</th>
              <th>{t('state') || 'State'}</th>
              <th>{t('dateLabel')}</th>
              <th>{t('tripCost') || 'Cost'}</th>
              <th>{t('seatsLabelShort')}</th>
              <th>{t('actionsLabel')}</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.placeName}</td>
                <td>{trip.destination}</td>
                <td>{trip.state}</td>
                <td>{new Date(trip.date).toLocaleDateString(locale === 'en' ? 'en-IN' : `${locale}-IN`)}</td>
                <td>{formatCurrency(trip.tripCost)}</td>
                <td>
                  {trip.bookedSeats.length} / {trip.totalSeats}
                </td>
                <td>
                  <button
                    onClick={() => handleViewDetails(trip)}
                    className={styles.detailsButton}
                  >
                    {t('details')}
                  </button>
                  <button
                    onClick={() => handleOpenModal(trip)}
                    className={styles.editButton}
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip._id)}
                    className={styles.deleteButton}
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className={styles.tableContainer} style={{ marginTop: "2rem" }}>
        <h2>{t('bookingManagement')}</h2>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Trip Route</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>#{booking._id.slice(-6).toUpperCase()}</td>
                <td>{booking.user ? booking.user.name : "N/A"}</td>
                <td>
                  {booking.tripInfo
                    ? `${booking.tripInfo.placeName || booking.tripInfo.title || 'N/A'} - ${booking.tripInfo.destination || (booking.tripInfo.attractions && booking.tripInfo.attractions[0]?.name) || 'N/A'}`
                    : (booking.trip ? `${booking.trip.placeName} - ${booking.trip.destination}` : "N/A")}
                </td>
                <td>{booking.fromLocation || (booking.tripInfo && (booking.tripInfo.placeName || booking.tripInfo.title)) || 'N/A'}</td>
                <td>{(booking.tripInfo && (booking.tripInfo.destination || (booking.tripInfo.attractions && booking.tripInfo.attractions[0]?.name))) || (booking.trip && booking.trip.destination) || 'N/A'}</td>
                <td>{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : booking.tripInfo && booking.tripInfo.date ? new Date(booking.tripInfo.date).toLocaleDateString() : booking.trip ? new Date(booking.trip.date).toLocaleDateString() : 'N/A'}</td>
                <td>{booking.seats.join(", ")}</td>
                <td>{formatCurrency(booking.totalAmount || 0)}</td>
                <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : (booking.bookingDate === undefined && booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A')}</td>
                <td>
                  <button className={styles.editButton} onClick={() => handleEditBooking(booking)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <AddEditTripModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTrip}
        tripToEdit={editingTrip}
        isSaving={isSaving}
      />

      <TripBookingsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        bookings={selectedTripBookings}
        trip={selectedTrip}
      />

      <EditBookingModal
        isOpen={isEditBookingOpen}
        onClose={handleCloseEditBooking}
        booking={editingBooking}
        onSaved={() => fetchData()}
      />

      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      >
        <div style={{ padding: "20px" }}>
          <h3 style={{ color: "#d32f2f", marginBottom: "10px" }}>{t('failedToSaveTrip')}</h3>
          <p style={{ marginBottom: "20px" }}>{errorMessage}</p>
          <button
            onClick={() => setIsErrorModalOpen(false)}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {t('close') || 'Close'}
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboardPage;



