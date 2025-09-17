
import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

// -----------------------------
// QR helper - auto-detect dev vs prod
function safeQrValue(id) {
  if (process.env.NODE_ENV === "production") {
    // Use your GitHub Pages URL in production
    return `https://lewis57350.github.io/Oilwell-app/#/well/${id}`;
  } else {
    // Use localhost while developing
    return `http://localhost:3000/#/well/${id}`;
  }
}

// -----------------------------
// Inline Edit Component
// -----------------------------
function InlineEdit({ label, value, onSave, placeholder = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          className="border px-3 py-2 rounded bg-gray-800 text-white border-gray-600 w-full"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(value ?? "");
              setEditing(false);
            }
          }}
        />
        <button
          onClick={save}
          className="px-3 py-2 bg-lime-500 hover:bg-lime-400 text-black font-semibold rounded"
        >
          Save
        </button>
        <button
          onClick={() => {
            setDraft(value ?? "");
            setEditing(false);
          }}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-200">
        <span className="font-semibold text-gray-400">{label}: </span>
        {value || "—"}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="text-cyan-400 hover:text-cyan-300"
        title="Edit"
      >
        ✏️
      </button>
    </div>
  );
}

// -----------------------------
// Pumpjack Icon
// -----------------------------
function PumpjackIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20h16v2H4z" />
      <path d="M16.74 10.63l-3.35-5.8a1 1 0 00-1.74 0L8.3 10.63A7 7 0 005 17h2a5 5 0 015-5h.09A5 5 0 0116.74 15l1.85-.74a7 7 0 00-1.85-3.63z" />
    </svg>
  );
}

// -----------------------------
// Home Page
// -----------------------------
function Home({ wells, addWell }) {
  const [formOpen, setFormOpen] = useState(false);
  const [newWell, setNewWell] = useState({ id: Date.now(), name: "", location: "" });

  const handleAddWell = () => {
    if (!newWell.name || !newWell.location) return;
    addWell(newWell);
    setNewWell({ id: Date.now(), name: "", location: "" });
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen text-gray-100 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-8 text-cyan-400 drop-shadow-lg">
        <PumpjackIcon className="w-10 h-10 text-cyan-400" /> Oil Well Service Records
      </h1>

      {/* Add New Well */}
      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 text-black font-bold shadow-lg hover:scale-105 transform transition"
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
      )}

      {/* Wells List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wells.map((well) => (
          <motion.div key={well.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl shadow-xl p-6 bg-gray-900 border border-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/40 hover:scale-[1.03] transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-2">{well.name}</h2>
              <p className="text-gray-400">📍 {well.location}</p>
              <div className="mt-6 flex justify-center">
                <QRCodeCanvas value={safeQrValue(well.id)} size={120} />
              </div>
              <div className="mt-6 flex justify-center">
                <Link
                  to={`/well/${well.id}`}
                  className="w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 hover:scale-105 transform text-black font-bold shadow-lg tracking-wide transition"
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

// -----------------------------
// Well Detail Page
// -----------------------------
function WellDetail({ wells, records, addRecord, updateWell, updateRecord }) {
  const { id } = useParams();
  const wellId = Number(id);
  const well = wells.find((w) => w.id === wellId);
  const relatedRecords = records.filter((r) => r.wellId === wellId);

  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState("service");
  const [date, setDate] = useState("");
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");

  if (!well) {
    return (
      <div className="min-h-screen text-gray-100 p-6 bg-slate-950">
        <p className="mb-4">❌ Well not found</p>
        <Link to="/" className="text-cyan-400 underline">⬅ Back to Home</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!date || !operator) return;
    const newId = records.length ? Math.max(...records.map((r) => r.id || 0)) + 1 : 1;
    addRecord({ id: newId, wellId, type, date, operator, notes });
    setDate("");
    setOperator("");
    setNotes("");
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen text-gray-100 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <PumpjackIcon className="w-8 h-8 text-cyan-400" /> Well Details
      </h1>

      {/* Well Info */}
      <div className="rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-4">
          <InlineEdit label="Name" value={well.name} onSave={(val) => updateWell(wellId, { name: val })} />
          <InlineEdit label="Location" value={well.location} onSave={(val) => updateWell(wellId, { location: val })} />
          <InlineEdit label="Rod Size/Count" value={well.rodInfo || ""} onSave={(val) => updateWell(wellId, { rodInfo: val })} />
          <InlineEdit label="Tubing Size/Count" value={well.tubingInfo || ""} onSave={(val) => updateWell(wellId, { tubingInfo: val })} />
          <InlineEdit label="Pump Type/Size" value={well.pumpInfo || ""} onSave={(val) => updateWell(wellId, { pumpInfo: val })} />
          <InlineEdit label="Polish Rod Liner Size" value={well.polishRodLiner || ""} onSave={(val) => updateWell(wellId, { polishRodLiner: val })} />
          <InlineEdit label="Packing Size/Style" value={well.packing || ""} onSave={(val) => updateWell(wellId, { packing: val })} />
        </div>

        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={safeQrValue(wellId)} size={150} />
        </div>
      </div>

      {/* Records */}
      <h2 className="text-2xl font-semibold mt-8 text-lime-400">🛠 Service Records</h2>
      {relatedRecords.filter((r) => r.type === "service").length === 0 && (
        <p className="text-gray-400 mt-2">No service records yet.</p>
      )}
      {relatedRecords.filter((r) => r.type === "service").map((record) => (
        <div key={record.id} className="my-2 p-4 rounded-xl bg-gray-900 border border-lime-500">
          <InlineEdit label="Date" value={record.date} onSave={(val) => updateRecord(record.id, { date: val })} />
          <InlineEdit label="Operator/Pumper" value={record.operator} onSave={(val) => updateRecord(record.id, { operator: val })} />
          <InlineEdit label="Notes" value={record.notes} onSave={(val) => updateRecord(record.id, { notes: val })} />
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-8 text-orange-400">⚙️ Maintenance Records</h2>
      {relatedRecords.filter((r) => r.type === "maintenance").length === 0 && (
        <p className="text-gray-400 mt-2">No maintenance records yet.</p>
      )}
      {relatedRecords.filter((r) => r.type === "maintenance").map((record) => (
        <div key={record.id} className="my-2 p-4 rounded-xl bg-gray-900 border border-orange-500">
          <InlineEdit label="Date" value={record.date} onSave={(val) => updateRecord(record.id, { date: val })} />
          <InlineEdit label="Operator/Pumper" value={record.operator} onSave={(val) => updateRecord(record.id, { operator: val })} />
          <InlineEdit label="Notes" value={record.notes} onSave={(val) => updateRecord(record.id, { notes: val })} />
        </div>
      ))}

      {/* Add Record Form */}
      <div className="mt-6">
        {!formOpen ? (
          <button
            onClick={() => setFormOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow-lg"
          >
            ➕ Add New Record
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-gray-900 border border-cyan-400 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Add Record</h3>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mb-2 w-full p-2 rounded bg-gray-800 text-white border border-gray-600">
              <option value="service">Service Record</option>
              <option value="maintenance">Maintenance Record</option>
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2 w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
            <input type="text" placeholder="Operator/Pumper" value={operator} onChange={(e) => setOperator(e.target.value)} className="mb-2 w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
            <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mb-2 w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl">Save</button>
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link to="/" className="text-cyan-400 underline">⬅ Back to Home</Link>
      </div>
    </div>
  );
}

// -----------------------------
// App Root
// -----------------------------
export default function OilWellApp() {
  const [wells, setWells] = useState([]);
  const [records, setRecords] = useState([]);

  // Load saved data on startup
  useEffect(() => {
    const savedWells = JSON.parse(localStorage.getItem("wells") || "null");
    const savedRecords = JSON.parse(localStorage.getItem("records") || "null");

    if (savedWells) {
      setWells(savedWells);
    } else {
      setWells([
        { id: 1, name: "Well A", location: "Texas" },
        { id: 2, name: "Well B", location: "North Dakota" },
      ]);
    }

    if (savedRecords) {
      setRecords(savedRecords);
    } else {
      setRecords([
        { id: 1, wellId: 1, type: "service", date: "2025-09-05", operator: "John Doe", notes: "Routine check" },
        { id: 2, wellId: 2, type: "maintenance", date: "2025-09-06", operator: "Jane Smith", notes: "Changed belts" },
      ]);
    }
  }, []);

  // Save to localStorage whenever wells or records change
  useEffect(() => {
    localStorage.setItem("wells", JSON.stringify(wells));
  }, [wells]);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  // CRUD functions
  const addWell = (well) => setWells((prev) => [...prev, well]);
  const updateWell = (id, updates) =>
    setWells((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));

  const addRecord = (record) => setRecords((prev) => [...prev, record]);
  const updateRecord = (id, updates) =>
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home wells={wells} addWell={addWell} />} />
        <Route
          path="/well/:id"
          element={
            <WellDetail
              wells={wells}
              records={records}
              addRecord={addRecord}
              updateWell={updateWell}
              updateRecord={updateRecord}
            />
          }
        />
      </Routes>
    </Router>
  );
}