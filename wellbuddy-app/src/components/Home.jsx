import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import PumpjackIcon from "./PumpjackIcon";

const GH_USERNAME = "lewis57350";
const GH_REPO = "Oilwell-app";

function safeQrValue(id) {
  if (import.meta.env.MODE === "production") {
    return `https://${GH_USERNAME}.github.io/${GH_REPO}/#/well/${id}`;
  } else {
    return `${window.location.origin}/#/well/${id}`;
  }
}

export default function Home({ wells, addWell, user }) {
  const [formOpen, setFormOpen] = useState(false);
  const [newWell, setNewWell] = useState({
    name: "",
    location: "",
    rodInfo: "",
    tubingInfo: "",
    pumpInfo: "",
    polishRodLiner: "",
    packing: "",
  });

  const handleAddWell = async () => {
    if (!newWell.name || !newWell.location) return;
    await addWell(newWell);
    setNewWell({
      name: "",
      location: "",
      rodInfo: "",
      tubingInfo: "",
      pumpInfo: "",
      polishRodLiner: "",
      packing: "",
    });
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 p-6">
      <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-8 text-cyan-700 drop-shadow-sm">
        <PumpjackIcon className="w-10 h-10 text-cyan-600" /> WellBuddyApp
      </h1>

      {user && (!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-lime-400 hover:from-cyan-600 hover:to-lime-500 text-white font-bold shadow"
        >
          ➕ Add New Well
        </button>
      ) : (
        <div className="mb-6 p-6 rounded-2xl bg-white border border-cyan-200 shadow">
          <h3 className="text-xl font-bold mb-4 text-cyan-700">Add Well</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Well Name"
              value={newWell.name}
              onChange={(e) => setNewWell({ ...newWell, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Location"
              value={newWell.location}
              onChange={(e) => setNewWell({ ...newWell, location: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Rod Size/Count"
              value={newWell.rodInfo}
              onChange={(e) => setNewWell({ ...newWell, rodInfo: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Tubing Size/Count"
              value={newWell.tubingInfo}
              onChange={(e) => setNewWell({ ...newWell, tubingInfo: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Pump Type/Size"
              value={newWell.pumpInfo}
              onChange={(e) => setNewWell({ ...newWell, pumpInfo: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Polish Rod Liner Size"
              value={newWell.polishRodLiner}
              onChange={(e) => setNewWell({ ...newWell, polishRodLiner: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Packing Size/Style"
              value={newWell.packing}
              onChange={(e) => setNewWell({ ...newWell, packing: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddWell}
              className="flex-1 px-4 py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg shadow"
            >
              Save
            </button>
            <button
              onClick={() => setFormOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wells.map((well) => (
          <motion.div key={well.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl shadow-lg p-6 bg-white border border-gray-200 hover:border-cyan-400 hover:shadow-cyan-200/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-2">{well.name}</h2>
              <p className="text-gray-500">📍 {well.location}</p>
              <div className="mt-6 flex justify-center">
                <QRCodeCanvas value={safeQrValue(well.id)} size={120} />
              </div>
              <Link
                to={`/well/${well.id}`}
                className="block mt-6 text-center px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-lime-400 hover:from-cyan-600 hover:to-lime-500 text-white font-bold shadow"
              >
                🚀 View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
