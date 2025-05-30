// src/components/AreaModal.js
import React from 'react';

const AreaModal = ({
  showModal,
  areaName,
  areaColor,
  setAreaName,
  setAreaColor,
  setShowModal,
  setSelectedSeats,
  handleSaveArea,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Name and Color Area</h2>
        <input
          type="text"
          placeholder="Area Name"
          value={areaName}
          required
          onChange={(e) => setAreaName(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />
        <span className="flex my-auto items-center justify-between mb-10">
          Choose Color:
          <input
            type="color"
            value={areaColor}
            onChange={(e) => setAreaColor(e.target.value)}
            className="w-20 h-10 cursor-pointer"
          />
        </span>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedSeats([]);
              setAreaName("");
              setAreaColor("");
            }}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveArea}
            disabled={!areaName.trim() || !areaColor}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaModal;