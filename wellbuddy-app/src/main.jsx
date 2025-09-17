import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./AuthContext";
import WellBuddyApp from "./WellBuddyApp";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
<AuthProvider>
<WellBuddyApp />
</AuthProvider>
</React.StrictMode>
);
