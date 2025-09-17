import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc, orderBy, addDoc, query } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import InlineEdit from "./InlineEdit";
import PumpjackIcon from "./PumpjackIcon";
import { useAuth } from "../AuthContext";

function safeQrValue(id) {
  if (import.meta.env.MODE === "production") {
    return `https://YOUR_GITHUB_USERNAME.github.io/wellbuddy-app/#/well/${id}`;
  } else {
    return `${window.location.origin}/#/well/${id}`;
  }
}

export default function WellDetail({ updateWell }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [well, setWell] = useState(null);
  const [records, setRecords] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState("service");
  const [date, setDate] = useState("");
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      const docRef = doc(db, "wells", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setWell(snap.data());

      const q = query(collection(db, "wells", id, "records"), orderBy("date", "desc"));
      const rsnap = await getDocs(q);
      setRecords(rsnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [id]);

  const addRecord = async () => {
    if (!date || !operator) return;
    const newRecord = { type, date, operator, notes };
    const ref = await addDoc(collection(db, "wells", id, "records"), newRecord);
    setRecords((prev) => [...prev, { id: ref.id, ...newRecord }]);
    setFormOpen(false);
    setDate(""); setOperator(""); setNotes("");
  };

  const updateRecord = async (recId, updates) => {
    await updateDoc(doc(db, "wells", id, "records", recId), updates);
    setRecords((prev) => prev.map((r) => (r.id === recId ? { ...r, ...updates } : r)));
  };

  if (!well) return <div className="p-6 text-white">Loading…</div>;
  const canEdit = user && user.uid === well.owner;

  return (
    <div className="min-h-screen text-gray-100 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <PumpjackIcon className="w-8 h-8 text-cyan-400" /> Well Details
      </h1>

      {/* Well Info */}
      <div className="rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-4">
          <InlineEdit label="Name" value={well.name} onSave={(val) => updateWell(id, { name: val })} canEdit={canEdit} />
          <InlineEdit label="Location" value={well.location} onSave={(val) => updateWell(id, { location: val })} canEdit={canEdit} />
          <InlineEdit label="Rod Size/Count" value={well.rodInfo || ""} onSave={(val) => updateWell(id, { rodInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Tubing Size/Count" value={well.tubingInfo || ""} onSave={(val) => updateWell(id, { tubingInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Pump Type/Size" value={well.pumpInfo || ""} onSave={(val) => updateWell(id, { pumpInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Polish Rod Liner Size" value={well.polishRodLiner || ""} onSave={(val) => updateWell(id, { polishRodLiner: val })} canEdit={canEdit} />
          <InlineEdit label="Packing Size/Style" value={well.packing || ""} onSave={(val) => updateWell(id, { packing: val })} canEdit={canEdit} />
        </div>
        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={safeQrValue(well.id)} size={150} />
        </div>
      </div>

      {/* Records */}
      <h2 className="text-2xl font-semibold mt-8 text-lime-400">🛠 Service Records</h2>
      {records.filter((r) => r.type === "service").map((r) => (
        <div key={r.id} className="my-2 p-4 rounded-xl bg-gray-900 border border-lime-500">
          <InlineEdit label="Date" value={r.date} onSave={(val) => updateRecord(r.id, { date: val })} canEdit={canEdit} />
          <InlineEdit label="Operator/Pumper" value={r.operator} onSave={(val) => updateRecord(r.id, { operator: val })} canEdit={canEdit} />
          <InlineEdit label="Notes" value={r.notes} onSave={(val) => updateRecord(r.id, { notes: val })} canEdit={canEdit} />
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-8 text-orange-400">⚙️ Maintenance Records</h2>
      {records.filter((r) => r.type === "maintenance").map((r) => (
        <div key={r.id} className="my-2 p-4 rounded-xl bg-gray-900 border border-orange-500">
          <InlineEdit label="Date" value={r.date} onSave={(val) => updateRecord(r.id, { date: val })} canEdit={canEdit} />
          <InlineEdit label="Operator/Pumper" value={r.operator} onSave={(val) => updateRecord(r.id, { operator: val })} canEdit={canEdit} />
          <InlineEdit label="Notes" value={r.notes} onSave={(val) => updateRecord(r.id, { notes: val })} canEdit={canEdit} />
        </div>
      ))}

      {/* Add Record */}
      {canEdit && (
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
                <button onClick={addRecord} className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl">Save</button>
                <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Link to="/" className="text-cyan-400 underline">⬅ Back to Home</Link>
      </div>
    </div>
  );
}
