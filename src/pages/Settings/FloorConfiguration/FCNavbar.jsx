import React from "react";

const FCNavbar = ({
  title,
  handleCancel,
  defineAreaMode,
  setDefineAreaMode,
  handleSaveChangesClick,
}) => {
  return (
    <div>
      <div className="p-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#404040] font-montserrat">
          {title}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (defineAreaMode) {
                handleCancel();
                setDefineAreaMode(false);
              } else {
                setDefineAreaMode(true);
              }
            }}
            className={`py-1 px-3 rounded-2xl ${
              defineAreaMode
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {defineAreaMode ? "Cancel Area Definition" : "Define Area"}
          </button>

          <button
            onClick={handleSaveChangesClick}
            className="bg-green-600 text-white py-1 px-3 rounded-2xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FCNavbar;
