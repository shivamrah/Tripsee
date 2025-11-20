

import React, { useEffect, useRef, useContext } from "react";
import { LocaleContext } from "../context/LocaleContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import styles from "./ConfirmationPage.module.css";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const { bookingDetails, trip } = state || {};
  const { t } = useContext(LocaleContext);

  useEffect(() => {
    if (!bookingDetails || !trip) {
      navigate("/");
    }
  }, [bookingDetails, trip, navigate]);

  if (!bookingDetails || !trip) {
    return null;
  }

  const routeFrom = bookingDetails.fromLocation || trip.source || "";
  const travelDate = bookingDetails.travelDate ? new Date(bookingDetails.travelDate) : new Date(trip.date);
  const seats = bookingDetails.seats && bookingDetails.seats.length > 0 ? bookingDetails.seats : (bookingDetails.selectedSeats || []);
  const total = typeof bookingDetails.totalAmount === 'number' ? bookingDetails.totalAmount : Number(bookingDetails.totalAmount) || 0;

  const handleDownload = async () => {
    const ticketElement = document.querySelector(`.${styles.ticketCard}`);
    if (!ticketElement) return;


    const canvas = await html2canvas(ticketElement, {
      scale: 3,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");


    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();


    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth * 0.85;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);
    pdf.save(`Ticket_${bookingDetails._id.slice(-6).toUpperCase()}_${routeFrom.replace(/\s+/g, "_")}.pdf`);
  };
  return (
    <div className={styles.pageContainer}>
      <div className={styles.confirmationBox}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>{t('bookingConfirmed')}</h1>
        <p className={styles.subtitle}>
          {t('bookingSuccessSubtitle')}
        </p>


        <div className={styles.ticketCard} ref={ticketRef}>
          <div className={styles.ticketHeader}>
            <p>{t('flightTicket')}</p>
            <p className={styles.bookingId}>
              Booking ID: #{bookingDetails._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <div className={styles.ticketBody}>
            <div className={styles.routeInfo}>
              <div className={styles.location}>
                <h2>{routeFrom.substring(0, 3).toUpperCase()}</h2>
                <p>{trip.time}</p>
              </div>
              <div className={styles.planeIcon}>✈️</div>
              <div className={styles.location}>
                <h2>{trip.destination.substring(0, 3).toUpperCase()}</h2>
              </div>
            </div>
            <div className={styles.detailsGrid}>
              <div>
                <p className={styles.detailLabel}>{t('dateLabel')}</p>
                <p className={styles.detailValue}>
                  {travelDate.toLocaleDateString('en-GB')}
                </p>
              </div>
              <div>
                <p className={styles.detailLabel}>{t('seatsLabel')}</p>
                <p className={styles.detailValue}>
                  {seats.length > 0 ? seats.join(", ") : "N/A"}
                </p>
              </div>
              <div>
                <p className={styles.detailLabel}>{t('totalFarePaid')}</p>
                <p className={`${styles.detailValue} ${styles.price}`}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total)}
                </p>
              </div>
            </div>

            <div className={styles.qrCodeSection}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=BookingID:${bookingDetails._id}|from:${encodeURIComponent(routeFrom)}|date:${travelDate.toISOString()}`}
                alt="Booking QR Code"
                className={styles.qrCodeImage}
              />
              <p className={styles.qrCodeText}>
                {t('scanQr')}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleDownload} className={styles.downloadButton}>
            {t('downloadTicket')}
          </button>
          <Link to="/my-bookings" className={styles.viewBookingsButton}>
            {t('viewAllBookings')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
