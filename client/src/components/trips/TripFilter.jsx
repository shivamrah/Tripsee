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
  const [suggestions, setSuggestions] = useState([]);
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

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 2) {
      // Show states whose names start with the typed letters first,
      // then show all other states below (so the matched state is prominent).
      const normalized = val.trim().toLowerCase();
      const prefixMatches = INDIAN_STATES.filter((s) => s.toLowerCase().startsWith(normalized));
      const otherStates = INDIAN_STATES.filter((s) => !prefixMatches.includes(s));
      const ordered = [...prefixMatches, ...otherStates];
      setSuggestions(ordered);
      // Keep the dropdown open so the user can see matches + the rest.
      setOpen(ordered.length > 0);
      setActiveIndex(ordered.length > 0 ? 0 : -1);
    } else {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const clear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
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
    setSuggestions([]);
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
        setSuggestions([]);
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
