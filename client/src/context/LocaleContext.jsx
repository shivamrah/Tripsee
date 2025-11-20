import React, { createContext, useState, useEffect } from "react";

export const LocaleContext = createContext(null);

const TRANSLATIONS = {
    en: {
        home: "Home",
        admin: "Admin",
        myBookings: "My Bookings",
        profile: "Profile",
        logout: "Logout",
        login: "Login",
        signup: "Sign Up",
        savedTrips: "Saved Trips",
        upcomingBookings: "Upcoming Bookings",
        // common
        search: "Search",
        searchPlaceholder: "Search for your destination",
        addToMyTrips: "Added to My Trips",
        addToMyTripsBtn: "+ My Trips",
        bookNow: "Book Now",
        bookTickets: "Book Tickets",
        proceedToPayment: "Proceed to Payment",
        confirmBooking: "Confirm Booking",
        cancel: "Cancel",
        remove: "Remove",
        total: "Total",
        selectedSeats: "Selected Seats",
        perPerson: "per person",
        loading: "Loading...",
        noData: "No data found for",
        myTripsTitle: "My Trips",
        chooseYourDestination: "choose your destination",
        noMatchingStates: "No matching states",
        bookingFailed: "Booking failed. Please try again later.",
        pleaseSelectSeat: "Please select at least one seat.",
        bookingConfirmed: "Booking Confirmed!",
        bookingSuccessSubtitle: "Your trip is successfully booked. Enjoy your journey!",
        downloadTicket: "Download Ticket",
        viewAllBookings: "View All Bookings",
        dateLabel: "Date",
        seatsLabel: "Seats",
        totalFarePaid: "Total Fare Paid",
        scanQr: "Scan this QR code at the boarding gate.",
        flightTicket: "Flight Ticket",
        processing: "Processing...",
        sendUpiAndBook: "Send UPI Request & Book",
        completePayment: "Complete Payment",
    },
    hi: {
        home: "होम",
        admin: "एडमिन",
        myBookings: "मेरी बुकिंग्स",
        profile: "प्रोफ़ाइल",
        logout: "लॉगआउट",
        login: "लॉगिन",
        signup: "साइन अप",
        savedTrips: "सहेजे गए यात्रा",
        upcomingBookings: "आगामी बुकिंग्स",
        // common
        search: "खोजें",
        searchPlaceholder: "अपना गंतव्य खोजें",
        addToMyTrips: "मेरी यात्राओं में जोड़ा गया",
        addToMyTripsBtn: "+ मेरी यात्राएँ",
        bookNow: "अभी बुक करें",
        bookTickets: "टिकट बुक करें",
        proceedToPayment: "भुगतान पर जाएं",
        confirmBooking: "बुकिंग की पुष्टि करें",
        cancel: "रद्द करें",
        remove: "हटाएँ",
        total: "कुल",
        selectedSeats: "चयनित सीटें",
        perPerson: "प्रति व्यक्ति",
        loading: "लोड हो रहा है...",
        noData: "के लिए कोई डेटा नहीं मिला",
        myTripsTitle: "मेरी यात्राएँ",
        bookingFailed: "बुकिंग विफल। कृपया बाद में पुनः प्रयास करें।",
        pleaseSelectSeat: "कृपया कम से कम एक सीट चुनें।",
        bookingConfirmed: "बुकिंग की पुष्टि हुई!",
        bookingSuccessSubtitle: "आपकी यात्रा सफलतापूर्वक बुक हो गई है। यात्रा का आनंद लें!",
        downloadTicket: "टिकट डाउनलोड करें",
        viewAllBookings: "सभी बुकिंग देखें",
        dateLabel: "तारीख",
        seatsLabel: "सीटें",
        totalFarePaid: "कुल भुगतान",
        scanQr: "बोर्डिंग गेट पर इस क्यूआर कोड को स्कैन करें।",
        flightTicket: "फ्लाइट टिकट",
        processing: "प्रसंस्करण...",
        sendUpiAndBook: "UPI अनुरोध भेजें और बुक करें",
        completePayment: "भुगतान पूरा करें",
        chooseYourDestination: "अपना गंतव्य चुनें",
        noMatchingStates: "कोई मेल খाता राज्य नहीं",
    },
    bn: {
        home: "হোম",
        admin: "অ্যাডমিন",
        myBookings: "আমার বুকিং",
        profile: "প্রোফাইল",
        logout: "লগআউট",
        login: "লগইন",
        signup: "সাইন আপ",
        savedTrips: "সংরক্ষিত ভ্রমণ",
        upcomingBookings: "আসন্ন বুকিং",
        // common
        search: "খোঁজ",
        searchPlaceholder: "আপনার গন্তব্য খুঁজুন",
        addToMyTrips: "আমার ট্রিপে যোগ করা হয়েছে",
        addToMyTripsBtn: "+ আমার ট্রিপস",
        bookNow: "এখন বুক করুন",
        bookTickets: "টিকিট বুক করুন",
        proceedToPayment: "পেমেন্ট করুন",
        confirmBooking: "বুকিং নিশ্চিত করুন",
        cancel: "বাতিল করুন",
        remove: "অপসারণ",
        total: "মোট",
        selectedSeats: "নির্বাচিত সীট",
        perPerson: "প্রতি ব্যক্তি",
        loading: "লোড করা হচ্ছে...",
        noData: "যাতে ডেটা পাওয়া যায়নি",
        myTripsTitle: "আমার ট্রিপস",
        bookingFailed: "বুকিং ব্যর্থ। অনুগ্রহ করে পরে চেষ্টা করুন.",
        pleaseSelectSeat: "অনুগ্রহ করে অন্তত একটি সীট নির্বাচন করুন।",
        bookingConfirmed: "বুকিং নিশ্চিত!",
        bookingSuccessSubtitle: "আপনার ট্রিপ সফলভাবে বুক করা হয়েছে। আপনার যাত্রার আনন্দ নিন!",
        downloadTicket: "টিকিট ডাউনলোড করুন",
        viewAllBookings: "সমস্ত বুকিং দেখুন",
        dateLabel: "তারিখ",
        seatsLabel: "সীট",
        totalFarePaid: "মোট পরিশোধিত",
        scanQr: "বোর্ডিং গেটে এই কিউআর কোড স্ক্যান করুন।",
        flightTicket: "ফ্লাইট টিকিট",
        processing: "প্রসেসিং...",
        sendUpiAndBook: "UPI অনুরোধ পাঠান এবং বুক করুন",
        completePayment: "পেমেন্ট সম্পন্ন করুন",
        chooseYourDestination: "আপনার গন্তব্য নির্বাচন করুন",
        noMatchingStates: "কোন মিলকারী রাজ্য নেই",
    },
};

export const LocaleProvider = ({ children }) => {
    const [locale, setLocale] = useState("en");

    useEffect(() => {
        try {
            const raw = localStorage.getItem("locale");
            if (raw) setLocale(raw);
        } catch (e) { }
    }, []);

    const setLang = (lang) => {
        setLocale(lang);
        try {
            localStorage.setItem("locale", lang);
        } catch (e) { }
        // dispatch event so other components can react
        window.dispatchEvent(new Event("localeChanged"));
    };

    const t = (key) => {
        return (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) || TRANSLATIONS.en[key] || key;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLang, t }}>
            {children}
        </LocaleContext.Provider>
    );
};

export default LocaleContext;
