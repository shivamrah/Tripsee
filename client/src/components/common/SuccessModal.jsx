import React from "react";
import styles from "./SuccessModal.module.css";

const SuccessModal = ({ isOpen, onClose, message, title }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconContainer}>
                    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className={styles.title}>{title || "Success!"}</h3>
                <p className={styles.message}>{message}</p>
                <button className={styles.okButton} onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
