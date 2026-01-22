import React, { useState, useEffect, useCallback, useContext } from "react";
import API from "../api";
import TripCard from "../components/trips/TripCard";
import TripFilter from "../components/trips/TripFilter";
import styles from "./HomePage.module.css";
import STATE_INFO from "../data/stateInfo";
import { LocaleContext } from "../context/LocaleContext";

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useContext(LocaleContext);


  const [filters, setFilters] = useState(() => {
    // If a PlacesPage booked an attraction, it stores desired filters in localStorage
    try {
      const stored = localStorage.getItem("tripSearchFilters");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.removeItem("tripSearchFilters");
        return {
          source: parsed.source || "",
          destination: parsed.destination || "",
          date: parsed.date || "",
        };
      }
    } catch (e) {
      // ignore parse/storage errors
    }

    return {
      source: "",
      destination: "",
      date: "",
    };
  });


  const fetchTrips = async (filtersToUse = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filtersToUse.source) params.append("source", filtersToUse.source);
      if (filtersToUse.destination)
        params.append("destination", filtersToUse.destination);
      if (filtersToUse.date) params.append("date", filtersToUse.date);

      const { data } = await API.get(`/trips?${params.toString()}`);
      setTrips(data);
    } catch (err) {
      setError("Failed to fetch trips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch initial trips on mount only. Subsequent searches must be
    // triggered explicitly by the user pressing Search (handleSearch).
    // If filters were pre-filled (for example from PlacesPage booking intent),
    // perform that search automatically. Otherwise fetch default trips.
    if (filters.source || filters.destination || filters.date) {
      fetchTrips(filters);
    } else {
      fetchTrips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };


  const handleSearch = () => {
    // Trigger a fetch using the current filters state.
    fetchTrips(filters);
  };

  return (
    <div className={styles.homePage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>FIND YOUR DESTINATION</h1>
        <p className={styles.heroSubtitle}>
          {t('searchPlaceholder')}
        </p>
        <TripFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </header>

      <main className={styles.mainContent}>
        {/* Display filtered state cards based on search */}
        <div className={styles.statesSection}>
          <h2 className={styles.statesSectionTitle}>{t('chooseYourDestination') || 'Explore Our States'}</h2>
          <div className={styles.statesGrid}>
            {Object.entries(STATE_INFO)
              .filter(([stateName]) => {
                // Filter states based on search query
                if (!filters.source) return true;
                return stateName.toLowerCase().includes(filters.source.toLowerCase());
              })
              .map(([stateName, meta]) => (
                <div key={stateName} className={styles.stateCard}>
                  <img
                    src={meta.imagePath}
                    alt={stateName}
                    className={styles.stateCardImage}
                  />
                  <div className={styles.stateCardBody}>
                    <h3>{stateName}</h3>
                    <p>{meta.description}</p>
                    <button
                      className={styles.stateCardButton}
                      onClick={() =>
                        window.location.assign(`/places/${encodeURIComponent(stateName)}`)
                      }
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
