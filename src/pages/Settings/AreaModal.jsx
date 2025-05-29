import React, { useState } from "react";

const AreaModal = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00FF00");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Add Area Info</h2>
        <input
          type="text"
          placeholder="Area Name"
          className="border p-2 mb-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          className="border p-2 mb-2 w-full"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              onSave(name, color);
              setName("");
              setColor("#00FF00");
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaModal;
