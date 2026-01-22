import React, { useEffect, useRef, useState, useContext } from "react";
import styles from "./TripFilter.module.css";
import { LocaleContext } from "../../context/LocaleContext";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const TripFilter = ({ filters = {}, onFilterChange, onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(INDIAN_STATES);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const { t } = useContext(LocaleContext);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openAllStates = () => {
    setSuggestions(INDIAN_STATES);
    setOpen(true);
    setActiveIndex(0);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const normalized = val.trim().toLowerCase();

    // When the field is empty, show the full state list immediately.
    if (!normalized) {
      openAllStates();
      if (onFilterChange) onFilterChange("source", "");
      return;
    }

    // When the user types, show matching states prioritized by relevance
    // First: states that start with the search term
    const startsWithMatch = INDIAN_STATES.filter((s) => s.toLowerCase().startsWith(normalized));
    // Then: states that contain the search term but don't start with it
    const containsMatch = INDIAN_STATES.filter(
      (s) => s.toLowerCase().includes(normalized) && !s.toLowerCase().startsWith(normalized)
    );
    // Combine with startsWith matches first (higher priority)
    const filtered = [...startsWithMatch, ...containsMatch];

    setSuggestions(filtered);
    setOpen(filtered.length > 0);
    setActiveIndex(filtered.length > 0 ? 0 : -1);

    // Update filters in real-time so state cards filter immediately
    if (onFilterChange) onFilterChange("source", val);
  };

  const clear = () => {
    setQuery("");
    setSuggestions(INDIAN_STATES);
    setOpen(true);
    setActiveIndex(0);
    if (onFilterChange) onFilterChange("source", "");
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      } else {
        // fall back to submit behavior
        handleSubmit(e);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (state) => {
    setQuery(state);
    setSuggestions(INDIAN_STATES);
    setOpen(false);
    if (onFilterChange) onFilterChange("source", state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On submit, try to resolve the typed query to a specific state.
    const q = query.trim();
    if (q.length >= 2) {
      // prefer exact (case-insensitive) match; otherwise pick first prefix match
      const exact = INDIAN_STATES.find((s) => s.toLowerCase() === q.toLowerCase());
      const prefixMatches = INDIAN_STATES.filter((s) => s.toLowerCase().startsWith(q.toLowerCase()));
      const chosen = exact || (prefixMatches.length > 0 ? prefixMatches[0] : null);
      if (chosen) {
        setQuery(chosen);
        setSuggestions(INDIAN_STATES);
        setOpen(false);
        if (onFilterChange) onFilterChange("source", chosen);
        if (onSearch) onSearch();
        return;
      }
    }
    // Fallback: send raw query to filters (may not match a state exactly)
    if (onFilterChange) onFilterChange("source", query);
    if (onSearch) onSearch();
  };

  return (
    <div className={styles.filterCard}>
      <form onSubmit={handleSubmit} className={styles.filterForm} ref={wrapperRef}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchField}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              id="stateSearch"
              className={`${styles.searchInput} ${styles.withIcon}`}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (!query) {
                  setSuggestions(INDIAN_STATES);
                }
                setOpen(true);
              }}
              autoComplete="off"
            />
            {query && (
              <button type="button" aria-label="Clear" onClick={clear} className={styles.clearBtn}>
                ✕
              </button>
            )}

            {open && (
              <ul className={styles.suggestions} role="listbox">
                {suggestions.length === 0 ? (
                  <li className={styles.noMatch}>{t('noMatchingStates')}</li>
                ) : (
                  suggestions.map((s, idx) => (
                    <li
                      key={s}
                      role="option"
                      tabIndex={0}
                      className={`${styles.suggestionItem} ${idx === activeIndex ? styles.active : ""}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSelect(s)}
                    >
                      {s}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className={styles.inlineLabel}>
            <strong>{t('chooseYourDestination')}</strong>
          </div>
        </div>

        <button type="submit" className={styles.searchButton}>
          {t('search')}
        </button>
      </form>
    </div>
  );
};

export default TripFilter;
