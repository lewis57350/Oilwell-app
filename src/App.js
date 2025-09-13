import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export default function OilWellApp() {
  const [wells, setWells] = useState([
    { id: 1, name: "Well A", location: "Texas", records: [] },
    { id: 2, name: "Well B", location: "Oklahoma", records: [] },
  ]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [newRecord, setNewRecord] = useState("");

  // Add a service record to a well
  const addRecord = (wellId) => {
    if (!newRecord.trim()) return;
    setWells((prev) =>
      prev.map((well) =>
        well.id === wellId
          ? {
              ...well,
              records: [...well.records, { text: newRecord, date: new Date() }],
            }
          : well
      )
    );
    setNewRecord("");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Oil Well Service Records</h1>

      {/* Well list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wells.map((well) => (
          <motion.div
            key={well.id}
            className="bg-gray-900 p-4 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold">{well.name}</h2>
            <p className="text-gray-400">📍 {well.location}</p>

            {/* QR Code links to your app (replace with your live URL when hosted) */}
            <div className="mt-2">
              <QRCodeCanvas value={`https://your-app-url.com/well/${well.id}`} />
            </div>

            <button
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl"
              onClick={() => setSelectedWell(well)}
            >
              View Records
            </button>
          </motion.div>
        ))}
      </div>

      {/* Record details */}
      {selectedWell && (
        <motion.div
          className="mt-6 p-4 bg-gray-800 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-3">{selectedWell.name} Records</h2>
          <ul className="mb-4">
            {selectedWell.records.length > 0 ? (
              selectedWell.records.map((record, idx) => (
                <li key={idx} className="border-b border-gray-700 py-2">
                  {record.text}{" "}
                  <span className="text-sm text-gray-400">
                    ({record.date.toLocaleString()})
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No records yet.</p>
            )}
          </ul>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRecord}
              onChange={(e) => setNewRecord(e.target.value)}
              placeholder="Add a service record"
              className="flex-1 px-3 py-2 rounded-lg text-black"
            />
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              onClick={() => addRecord(selectedWell.id)}
            >
              Add
            </button>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
            onClick={() => setSelectedWell(null)}
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}
