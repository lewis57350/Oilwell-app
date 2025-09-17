import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Home from "./components/Home";
import WellDetail from "./components/WellDetail";

export default function WellBuddyApp() {
  const { user, logout } = useAuth();
  const [wells, setWells] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load all wells owned by current user for the dashboard
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setWells([]);
        setLoaded(true);
        return;
      }
      const q = query(collection(db, "wells"), where("owner", "==", user.uid));
      const snap = await getDocs(q);
      setWells(snap.docs.map((d) => d.data()));
      setLoaded(true);
    };
    load();
  }, [user]);

  const addWell = async (well) => {
    if (!user) return;
    const id = crypto.randomUUID();
    const newWell = {
      id,
      owner: user.uid,
      name: well.name,
      location: well.location,
      rodInfo: well.rodInfo || "",
      tubingInfo: well.tubingInfo || "",
      pumpInfo: well.pumpInfo || "",
      polishRodLiner: well.polishRodLiner || "",
      packing: well.packing || "",
    };
    await setDoc(doc(db, "wells", id), newWell);
    setWells((prev) => [...prev, newWell]);
  };

  return (
    <Router>
      <header className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h1 className="font-bold text-xl text-cyan-700">WellBuddyApp</h1>
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-cyan-700 underline">Dashboard</Link>
          {user ? (
            <button
              onClick={logout}
              className="bg-gray-800 text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-cyan-500 to-lime-400 hover:from-cyan-600 hover:to-lime-500 text-white px-3 py-1 rounded-lg font-semibold shadow"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home wells={wells} addWell={addWell} user={user} />} />
        <Route path="/well/:id" element={<WellDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {!loaded && <div className="p-4 text-gray-500">Loading…</div>}
    </Router>
  );
}
