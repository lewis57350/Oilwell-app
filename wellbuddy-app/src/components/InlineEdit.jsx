import React, { useState } from "react";

export default function InlineEdit({ label, value, onSave, canEdit, placeholder = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (!canEdit) {
    return (
      <div className="text-gray-200">
        <span className="font-semibold text-gray-400">{label}: </span>
        {value || "—"}
      </div>
    );
  }

  const save = async () => {
    await onSave(draft);
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
