import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { LocaleContext } from "../../context/LocaleContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const { locale, setLang, t } = React.useContext(LocaleContext);

  const getCartCount = () => {
    try {
      const raw = localStorage.getItem("tripCart");
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      return arr.reduce((s, it) => s + (it.qty || 0), 0);
    } catch (e) {
      return 0;
    }
  };

  useEffect(() => {
    // initialize
    setCartCount(getCartCount());

    const onStorage = (e) => {
      if (e.key === "tripCart") setCartCount(getCartCount());
    };

    const onCustom = () => setCartCount(getCartCount());

    window.addEventListener("storage", onStorage);
    window.addEventListener("tripCartUpdated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("tripCartUpdated", onCustom);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const handleAdminClick = () => {

    navigate("/login", { state: { defaultRole: "admin" } });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          TripSee
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            {t('home')}
          </Link>

          {/* My Trips removed per request; cart indicator now shows on My Bookings */}


          {user && user.role === "admin" ? (

            <Link to="/admin" className={styles.navLink}>
              {t('admin')}
            </Link>
          ) : (

            <button onClick={handleAdminClick} className={styles.navLinkButton}>
              {t('admin')}
            </button>
          )}

          {user ? (
            <>

              <Link to="/my-bookings" className={styles.navLink} title={t('myBookings')}>
                <span className={styles.myBookingsContent}>
                  {cartCount > 0 && (
                    <svg
                      className={styles.bookIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path d="M21 7H3v10h18V7zm0-2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l1-2h8l1 2h4zM8 11h8v2H8v-2z" />
                    </svg>
                  )}
                  {t('myBookings')}
                  {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                </span>
              </Link>
              <Link to="/profile" className={styles.navLink}>
                {t('profile')}
              </Link>
              {/* Language selector next to logout */}
              <select
                value={locale}
                onChange={(e) => setLang(e.target.value)}
                className={styles.langSelect}
                aria-label="Choose language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="bn">বাংলা</option>
              </select>
              <button onClick={handleLogout} className={styles.logoutButton}>
                {t('logout')}
              </button>
            </>
          ) : (
            <>

              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/signup" className={styles.navLink}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




