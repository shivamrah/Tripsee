import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LocaleProvider } from "./context/LocaleContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </AuthProvider>
  </React.StrictMode>
);
