import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import PumpjackIcon from "./PumpjackIcon";

// Generate QR links (local in dev, GitHub Pages in prod)
function safeQrValue(id) {
  if (import.meta.env.MODE === "production") {
    return `https://YOUR_GITHUB_USERNAME.github.io/wellbuddy-app/#/well/${id}`;
  } else {
    return `${window.location.origin}/#/well/${id}`;
  }
}

export default function Home({ wells, addWell, user }) {
  const [formOpen, setFormOpen] = useState(false);
  const [newWell, setNewWell] = useState({ name: "", location: "" });

  const handleAddWell = async () => {
    if (!newWell.name || !newWell.location) return;
    await addWell(newWell);
    setNewWell({ name: "", location: "" });
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen text-gray-100 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-8 text-cyan-400 drop-shadow-lg">
        <PumpjackIcon className="w-10 h-10 text-cyan-400" /> WellBuddyApp
      </h1>

      {/* Add Well Form */}
      {user && (!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 
                     hover:from-lime-300 hover:to-cyan-300 text-black font-bold shadow-lg 
                     hover:scale-105 transform transition"
        >
          ➕ Add New Well
        </button>
      ) : (
        <div className="mb-6 p-6 rounded-xl bg-gray-900 border border-cyan-400 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Add Well</h3>
          <input
            type="text"
            placeholder="Well Name"
            value={newWell.name}
            onChange={(e) => setNewWell({ ...newWell, name: e.target.value })}
            className="mb-3 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
          <input
            type="text"
            placeholder="Location"
            value={newWell.location}
            onChange={(e) => setNewWell({ ...newWell, location: e.target.value })}
            className="mb-3 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddWell}
              className="flex-1 px-4 py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg shadow"
            >
              Save
            </button>
            <button
              onClick={() => setFormOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}

      {/* Wells List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wells.map((well) => (
          <motion.div key={well.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl shadow-xl p-6 bg-gray-900 border border-gray-700 
                            hover:border-cyan-400 hover:shadow-cyan-400/40 hover:scale-[1.03] 
                            transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-2">{well.name}</h2>
              <p className="text-gray-400">📍 {well.location}</p>
              <div className="mt-6 flex justify-center">
                <QRCodeCanvas value={safeQrValue(well.id)} size={120} />
              </div>
              <div className="mt-6 flex justify-center">
                <Link
                  to={`/well/${well.id}`}
                  className="w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r 
                             from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 
                             hover:scale-105 transform text-black font-bold shadow-lg 
                             tracking-wide transition"
                >
                  🚀 View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
