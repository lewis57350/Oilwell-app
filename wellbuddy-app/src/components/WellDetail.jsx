import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  orderBy,
  addDoc,
  query,
} from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import InlineEdit from "./InlineEdit";
import { useAuth } from "../AuthContext";

const GH_USERNAME = "lewis57350";
const GH_REPO = "wellbuddy-app";

function safeQrValue(id) {
  if (import.meta.env.MODE === "production") {
    return `https://${GH_USERNAME}.github.io/${GH_REPO}/#/well/${id}`;
  } else {
    return `${window.location.origin}/#/well/${id}`;
  }
}

export default function WellDetail() {
  const { id } = useParams(); // well id is the document id
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

  if (!well) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <p className="mb-4 text-gray-700">❌ Well not found</p>
        <Link to="/" className="text-cyan-700 underline">⬅ Back to Home</Link>
      </div>
    );
  }

  const canEdit = user && user.uid === well.owner;

  const updateWell = async (updates) => {
    await updateDoc(doc(db, "wells", id), updates);
    setWell((prev) => ({ ...prev, ...updates }));
  };

  const addRecord = async () => {
    if (!date || !operator) return;
    const record = { type, date, operator, notes };
    const ref = await addDoc(collection(db, "wells", id, "records"), record);
    setRecords((prev) => [{ id: ref.id, ...record }, ...prev]);
    setDate("");
    setOperator("");
    setNotes("");
    setType("service");
    setFormOpen(false);
  };

  const updateRecord = async (recId, updates) => {
    await updateDoc(doc(db, "wells", id, "records", recId), updates);
    setRecords((prev) => prev.map((r) => (r.id === recId ? { ...r, ...updates } : r)));
  };

  const serviceRecords = records.filter((r) => r.type === "service");
  const maintenanceRecords = records.filter((r) => r.type === "maintenance");

  return (
    <div className="min-h-screen text-gray-900 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Well Details</h1>

      {/* Well Info */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow">
        <div className="grid md:grid-cols-2 gap-4">
          <InlineEdit label="Name" value={well.name} onSave={(val) => updateWell({ name: val })} canEdit={canEdit} />
          <InlineEdit label="Location" value={well.location} onSave={(val) => updateWell({ location: val })} canEdit={canEdit} />
          <InlineEdit label="Rod Size/Count" value={well.rodInfo || ""} onSave={(val) => updateWell({ rodInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Tubing Size/Count" value={well.tubingInfo || ""} onSave={(val) => updateWell({ tubingInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Pump Type/Size" value={well.pumpInfo || ""} onSave={(val) => updateWell({ pumpInfo: val })} canEdit={canEdit} />
          <InlineEdit label="Polish Rod Liner Size" value={well.polishRodLiner || ""} onSave={(val) => updateWell({ polishRodLiner: val })} canEdit={canEdit} />
          <InlineEdit label="Packing Size/Style" value={well.packing || ""} onSave={(val) => updateWell({ packing: val })} canEdit={canEdit} />
        </div>

        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={safeQrValue(id)} size={150} />
        </div>
      </div>

      {/* Records */}
      <h2 className="text-2xl font-semibold mt-8 text-lime-700">🛠 Service Records</h2>
      {serviceRecords.length === 0 && <p className="text-gray-500 mt-2">No service records yet.</p>}
      {serviceRecords.map((record) => (
        <div key={record.id} className="my-2 p-4 rounded-xl bg-white border border-lime-200 shadow">
          <InlineEdit label="Date" value={record.date} onSave={(val) => updateRecord(record.id, { date: val })} canEdit={canEdit} />
          <InlineEdit label="Operator/Pumper" value={record.operator} onSave={(val) => updateRecord(record.id, { operator: val })} canEdit={canEdit} />
          <InlineEdit label="Notes" value={record.notes} onSave={(val) => updateRecord(record.id, { notes: val })} canEdit={canEdit} />
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-8 text-orange-700">⚙️ Maintenance Records</h2>
      {maintenanceRecords.length === 0 && <p className="text-gray-500 mt-2">No maintenance records yet.</p>}
      {maintenanceRecords.map((record) => (
        <div key={record.id} className="my-2 p-4 rounded-xl bg-white border border-orange-200 shadow">
          <InlineEdit label="Date" value={record.date} onSave={(val) => updateRecord(record.id, { date: val })} canEdit={canEdit} />
          <InlineEdit label="Operator/Pumper" value={record.operator} onSave={(val) => updateRecord(record.id, { operator: val })} canEdit={canEdit} />
          <InlineEdit label="Notes" value={record.notes} onSave={(val) => updateRecord(record.id, { notes: val })} canEdit={canEdit} />
        </div>
      ))}

      {/* Add Record Form */}
      <div className="mt-6">
        {canEdit && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow"
          >
            ➕ Add New Record
          </button>
        )}

        {canEdit && formOpen && (
          <div className="p-4 rounded-xl bg-white border border-cyan-200 shadow">
            <h3 className="text-lg font-bold mb-2">Add Record</h3>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mb-2 w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300"
            >
              <option value="service">Service Record</option>
              <option value="maintenance">Maintenance Record</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mb-2 w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300"
            />
            <input
              type="text"
              placeholder="Operator/Pumper"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="mb-2 w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300"
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-2 w-full p-2 rounded bg-gray-50 text-gray-900 border border-gray-300"
            />
            <div className="flex gap-2">
              <button
                onClick={addRecord}
                className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl"
              >
                Save
              </button>
              <button
                onClick={() => setFormOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link to="/" className="text-cyan-700 underline">⬅ Back to Home</Link>
      </div>
    </div>
  );
}
