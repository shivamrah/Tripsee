

import React, { useState, useEffect, useContext } from "react";
import styles from "./AddEditTripModal.module.css";
import { LocaleContext } from "../../context/LocaleContext";
import STATE_INFO from "../../data/stateInfo.js";

const AddEditTripModal = ({
  isOpen,
  onClose,
  onSave,
  tripToEdit,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    placeName: "",
    destination: "",
    state: "",
    description: "",
    tripCost: "",
    imageUrl: "",
    date: "",
    time: "",
    totalSeats: "",
  });

  const [stateInfo, setStateInfo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (tripToEdit) {
      setFormData({
        placeName: tripToEdit.placeName || "",
        destination: tripToEdit.destination || "",
        state: tripToEdit.state || "",
        description: tripToEdit.description || "",
        tripCost: tripToEdit.tripCost || "",
        imageUrl: tripToEdit.imageUrl || "",
        date: new Date(tripToEdit.date).toISOString().split("T")[0],
        time: tripToEdit.time || "",
        totalSeats: tripToEdit.totalSeats || "",
      });
      setPreviewImage(tripToEdit.imageUrl || null);
    } else {
      setFormData({
        placeName: "",
        destination: "",
        state: "",
        description: "",
        tripCost: "",
        imageUrl: "",
        date: "",
        time: "",
        totalSeats: "",
      });
      setPreviewImage(null);
    }
    setStateInfo(null);
  }, [tripToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageUrl") {
      setFormData((prev) => ({ ...prev, imageUrl: value }));
      if (value) {
        setPreviewImage(value);
      }
    } else if (name === "state") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Auto-populate state info when state is selected
      if (STATE_INFO[value]) {
        setStateInfo(STATE_INFO[value]);
      } else {
        setStateInfo(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const { t } = useContext(LocaleContext);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{tripToEdit ? t("editTrip") : t("addNewTrip")}</h2>
        <form onSubmit={handleSubmit}>
          {/* 1. TRIP IDENTIFICATION SECTION */}
          <div style={{ marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>Trip Details</h3>

            {/* Place Name */}
            <div className={styles.formGroup}>
              <label>{t("placeName") || "Place Name"} *</label>
              <input
                name="placeName"
                value={formData.placeName}
                onChange={handleChange}
                placeholder="e.g., Taj Mahal Sunset Tour, Mountain Adventure"
                required
              />
            </div>

            {/* Destination */}
            <div className={styles.formGroup}>
              <label>{t("destination") || "Destination City"} *</label>
              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Agra, Mumbai, Jaipur"
                required
              />
            </div>

            {/* Select State */}
            <div className={styles.formGroup}>
              <label>{t("state") || "Select State"} *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a State --</option>
                {Object.keys(STATE_INFO).map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
            </div>

            {/* Display state description when selected */}
            {stateInfo && (
              <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "5px", borderLeft: "4px solid #3b82f6" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.875rem" }}>
                  <strong>📍 {formData.state}</strong>
                </p>
                <p style={{ margin: "0", fontSize: "0.875rem", color: "#4b5563" }}>{stateInfo.description}</p>
              </div>
            )}
          </div>

          {/* 2. DESCRIPTION SECTION */}
          <div style={{ marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>Description & Content</h3>

            <div className={styles.formGroup}>
              <label>{t("description") || "Place Description"} *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the place, attractions, highlights, what visitors can experience, local specialties, etc."
                rows="4"
                required
              />
            </div>
          </div>

          {/* 3. SCHEDULE & CAPACITY SECTION */}
          <div style={{ marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>Schedule & Capacity</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {/* Date */}
              <div className={styles.formGroup}>
                <label>{t("date") || "Trip Date"} *</label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time */}
              <div className={styles.formGroup}>
                <label>{t("time") || "Departure Time"} *</label>
                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Total Seats */}
            <div className={styles.formGroup}>
              <label>{t("totalSeats") || "Total Available Seats"} *</label>
              <input
                name="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="1"
                required
              />
            </div>
          </div>

          {/* 4. PRICING SECTION */}
          <div style={{ marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>Pricing</h3>

            <div className={styles.formGroup}>
              <label>{t("tripCost") || "Cost Per Person (₹)"} *</label>
              <input
                name="tripCost"
                type="number"
                value={formData.tripCost}
                onChange={handleChange}
                placeholder="e.g., 5000"
                step="100"
                min="0"
                required
              />
            </div>
          </div>

          {/* 5. IMAGE SECTION */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>Trip Image</h3>

            <div className={styles.formGroup}>
              <label>{t("tripImage") || "Image Link"} {!tripToEdit && "*"}</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                required={!tripToEdit}
              />
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "6px" }}>
                Paste a direct image link (JPG/PNG). This image will be visible to all clients.
              </p>
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div style={{ marginTop: "15px" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>
                  📸 <strong>Image Preview (as clients will see):</strong>
                </p>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    borderRadius: "8px",
                    border: "2px solid #3b82f6",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}

            {tripToEdit && tripToEdit.imageUrl && !previewImage && (
              <div style={{ marginTop: "15px" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>
                  📸 <strong>Current Image:</strong>
                </p>
                <img
                  src={tripToEdit.imageUrl}
                  alt="Current"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    borderRadius: "8px",
                    border: "2px solid #10b981",
                    objectFit: "cover"
                  }}
                />
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px" }}>
                  Upload a new image to replace it
                </p>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTripModal;







// import React, { useState, useEffect } from "react";
// import styles from "./AddEditTripModal.module.css";

// const AddEditTripModal = ({
//   isOpen,
//   onClose,
//   onSave,
//   tripToEdit,
//   isSaving,
// }) => {
//   const [formData, setFormData] = useState({
//     source: "",
//     destination: "",
//     date: "",
//     time: "",
//     price: "",
//     totalSeats: "",
//     imageUrl: null, // can be File or String
//   });

//   useEffect(() => {
//     if (tripToEdit) {
//       setFormData({
//         source: tripToEdit.source,
//         destination: tripToEdit.destination,
//         date: new Date(tripToEdit.date).toISOString().split("T")[0],
//         time: tripToEdit.time,
//         price: tripToEdit.price,
//         totalSeats: tripToEdit.totalSeats,
//         imageUrl: tripToEdit.imageUrl, // string (existing URL)
//       });
//     } else {
//       setFormData({
//         source: "",
//         destination: "",
//         date: "",
//         time: "",
//         price: "",
//         totalSeats: "",
//         imageUrl: null,
//       });
//     }
//   }, [tripToEdit, isOpen]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "imageUrl") {
//       setFormData((prev) => ({ ...prev, imageUrl: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     fd.append("source", formData.source);
//     fd.append("destination", formData.destination);
//     fd.append("date", formData.date);
//     fd.append("time", formData.time);
//     fd.append("price", formData.price);
//     fd.append("totalSeats", formData.totalSeats);

//     // Only append file if new one selected
//     if (formData.imageUrl instanceof File) {
//       fd.append("imageUrl", formData.imageUrl);
//     }

//     // Pass FormData + edit ID if editing
//     onSave(fd, tripToEdit?._id);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h2>{tripToEdit ? "Edit Trip" : "Add New Trip"}</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             name="source"
//             value={formData.source}
//             onChange={handleChange}
//             placeholder="Source"
//             required
//           />
//           <input
//             name="destination"
//             value={formData.destination}
//             onChange={handleChange}
//             placeholder="Destination"
//             required
//           />
//           <input
//             name="date"
//             type="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="time"
//             type="time"
//             value={formData.time}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="price"
//             type="number"
//             value={formData.price}
//             onChange={handleChange}
//             placeholder="Price"
//             required
//           />
//           <input
//             name="totalSeats"
//             type="number"
//             value={formData.totalSeats}
//             onChange={handleChange}
//             placeholder="Total Seats"
//             required
//           />

//           <label>Trip Image</label>
//           <input
//             name="imageUrl"
//             type="file"
//             onChange={handleChange}
//             required={!tripToEdit} // required only when adding
//           />

//           {/* Show current image if editing */}
//           {tripToEdit &&
//             typeof formData.imageUrl === "string" &&
//             formData.imageUrl && (
//               <p>
//                 Current Image:{" "}
//                 <a href={formData.imageUrl} target="_blank" rel="noreferrer">
//                   View
//                 </a>
//               </p>
//             )}

//           <div className={styles.buttonGroup}>
//             <button
//               type="button"
//               onClick={onClose}
//               className={styles.cancelButton}
//               disabled={isSaving}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={styles.saveButton}
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEditTripModal;
