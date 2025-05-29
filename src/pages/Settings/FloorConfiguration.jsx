import React, { useState } from "react";
import SeatMap from "./Seatmap";

const FloorConfiguration = () => {
  const initialSections = [
    {
      label: "A",
      seats: Array.from({ length: 26 }, (_, i) => {
        const num = i + 1;
        const isBlank = num >= 14 && num <= 16;
        return {
          id: `A${num.toString().padStart(2, "0")}`,
          selected: false,
          color: "",
          blank: isBlank,
        };
      }),
    },
    {
      label: "B",
      seats: Array.from({ length: 26 }, (_, i) => {
        const num = i + 1;
        const isBlank =
          (num >= 7 && num <= 9) ||
          (num >= 20 && num <= 21) ||
          (num >= 14 && num <= 16);
        return {
          id: `B${num.toString().padStart(2, "0")}`,
          selected: false,
          color: "",
          blank: isBlank,
        };
      }),
    },
    ...["C", "D", "E", "F", "G", "H", "I", "J"].map((label) => ({
      label,
      seats: Array.from({ length: 26 }, (_, i) => {
        const num = i + 1;
        const isBlank =
          (num >= 7 && num <= 9) ||
          (num >= 20 && num <= 21) ||
          (label === "J" && num >= 1 && num <= 4);
        return {
          id: `${label}${num.toString().padStart(2, "0")}`,
          selected: false,
          color: "",
          blank: isBlank,
        };
      }),
    })),
  ];

  const [sections, setSections] = useState(initialSections);
  const [startSeat, setStartSeat] = useState(null);
  const [endSeat, setEndSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [areaColor, setAreaColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [areas, setAreas] = useState([]);
  const [defineAreaMode, setDefineAreaMode] = useState(false);
  const [editingAreaIndex, setEditingAreaIndex] = useState(null);

  const getSeatsInRange = (start, end) => {
    const selected = [];
    const sectionStart = Math.min(start.sectionIndex, end.sectionIndex);
    const sectionEnd = Math.max(start.sectionIndex, end.sectionIndex);
    const seatStart = Math.min(start.seatIndex, end.seatIndex);
    const seatEnd = Math.max(start.seatIndex, end.seatIndex);

    for (let s = sectionStart; s <= sectionEnd; s++) {
      for (let i = seatStart; i <= seatEnd; i++) {
        if (sections[s]?.seats[i]) {
          selected.push({ sectionIndex: s, seatIndex: i });
        }
      }
    }

    return selected;
  };

  const handleDeleteArea = (index) => {
    const areaToDelete = areas[index];
    const updatedSections = [...sections];

    areaToDelete.seats.forEach((seatId) => {
      for (let section of updatedSections) {
        const seat = section.seats.find((s) => s.id === seatId);
        if (seat) {
          seat.selected = false;
          seat.color = "";
        }
      }
    });

    setSections(updatedSections);
    const updatedAreas = [...areas];
    updatedAreas.splice(index, 1);
    setAreas(updatedAreas);
  };

  const handleCancel = () => {
    setStartSeat(null);
    setEndSeat(null);

    // seats to clear: either selectedSeats or the range between start and end seat
    // Using selectedSeats (an array of {sectionIndex, seatIndex}) assuming you track it
    const seatsToClear = selectedSeats.length > 0 ? selectedSeats : [];

    const clearedSections = sections.map((section, sIdx) => {
      return {
        ...section,
        seats: section.seats.map((seat, seatIdx) => {
          // Check if this seat is inside the seatsToClear list
          const isInCurrentSelection = seatsToClear.some(
            (sel) => sel.sectionIndex === sIdx && sel.seatIndex === seatIdx
          );

          if (isInCurrentSelection) {
            return {
              ...seat,
              selected: false,
              color: null,
            };
          }
          return seat;
        }),
      };
    });

    setSections(clearedSections);
    setSelectedSeats([]);
    setPendingAreaSeats([]);
    setDefineAreaMode(false);
  };

  const handleEditArea = (index) => {
    const areaToEdit = areas[index];

    // Do NOT clear old seat selection/colors immediately
    // So old area stays visible until new selection finishes

    // Reset selection for new start/end seat selection
    setStartSeat(null);
    setSelectedSeats([]);

    // Keep old name/color for editing
    setAreaName(areaToEdit.name);
    setAreaColor(areaToEdit.color);

    // Enter define mode for new selection
    setDefineAreaMode(true);

    // Track editing index for replacement after new selection
    setEditingAreaIndex(index);
  };

  const [pendingAreaSeats, setPendingAreaSeats] = useState([]); // new state

  const handleToggle = (sectionIndex, seatIndex, visualIndex) => {
    if (!defineAreaMode) {
      // Normal toggle without define mode
      const updatedSections = [...sections];
      const seat = updatedSections[sectionIndex].seats[seatIndex];
      seat.selected = !seat.selected;
      setSections(updatedSections);
      return;
    }

    if (!startSeat) {
      // First click - set start seat
      setStartSeat({ sectionIndex, seatIndex });
    } else {
      // Second click - finalize area selection (no modal here)
      const end = { sectionIndex, seatIndex };
      const selected = getSeatsInRange(startSeat, end);
      const selectedSeatIds = selected.map(
        ({ sectionIndex, seatIndex }) =>
          sections[sectionIndex].seats[seatIndex].id
      );

      const updatedSections = [...sections];

      // If editing, clear old area's seats first
      if (editingAreaIndex !== null) {
        const oldArea = areas[editingAreaIndex];
        oldArea.seats.forEach((seatId) => {
          for (let section of updatedSections) {
            const seat = section.seats.find((s) => s.id === seatId);
            if (seat) {
              seat.selected = false;
              seat.color = "";
            }
          }
        });
      }

      // Mark new selection visually with a temporary color (maybe a default or areaColor)
      selected.forEach(({ sectionIndex, seatIndex }) => {
        updatedSections[sectionIndex].seats[seatIndex].selected = true;
        updatedSections[sectionIndex].seats[seatIndex].color =
          areaColor || "#22c55e"; // or a default temp color
      });

      setSections(updatedSections);
      setSelectedSeats(selected);
      setPendingAreaSeats(selectedSeatIds); // store pending seats

      // Do NOT open modal yet
    }
  };

  // Save changes button handler — opens modal only if there is a pending selection
  const handleSaveChangesClick = () => {
    if (pendingAreaSeats.length === 0) {
      alert("Please select start and end seats first!");
      return;
    }
    setShowModal(true);
  };

  const handleSaveArea = () => {
    if (!areaName || !areaColor) {
      alert("Please enter area name and color");
      return;
    }

    const updatedSections = [...sections];

    // Update seat colors with chosen areaColor for pending seats
    selectedSeats.forEach(({ sectionIndex, seatIndex }) => {
      updatedSections[sectionIndex].seats[seatIndex].color = areaColor;
    });

    const newArea = {
      name: areaName,
      color: areaColor,
      seats: pendingAreaSeats, // use pending seat ids
    };

    const updatedAreas = [...areas];

    if (editingAreaIndex !== null) {
      // Replace existing area
      updatedAreas[editingAreaIndex] = newArea;
      setEditingAreaIndex(null);
    } else {
      // Add new area
      updatedAreas.push(newArea);
    }

    setAreas(updatedAreas);
    setSections(updatedSections);

    // Reset states
    setStartSeat(null);
    setSelectedSeats([]);
    setPendingAreaSeats([]);
    setAreaName("");
    setAreaColor("");
    setShowModal(false);
    setDefineAreaMode(false);
  };

  const getSeatArea = (seatId) => {
    const row = seatId?.[0];
    const num = parseInt(seatId?.slice(1), 10);
    if (!row || isNaN(num)) return null;
    if (
      ["A", "B", "C", "D", "E", "F", "G"].includes(row) &&
      num >= 1 &&
      num <= 6
    )
      return "";
    if (
      (row === "A" && num >= 7 && num <= 20) ||
      (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 7 && num <= 19)
    )
      return "";
    if (
      (row === "A" && num >= 21 && num <= 26) ||
      (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 20 && num <= 25)
    )
      return "";
    if (
      (row === "H" && num >= 1 && num <= 6) ||
      (row === "I" && num >= 1 && num <= 6) ||
      (row === "J" && num >= 5 && num <= 6)
    )
      return "";
    if (["H", "I", "J"].includes(row) && num >= 7 && num <= 19) return "";
    if (["H", "I", "J"].includes(row) && num >= 20 && num <= 25) return "";
    return null;
  };

  const isSeatAssignedToCustomArea = (seatId) => {
    return areas.some((area) => area.seats.includes(seatId));
  };

  const areaStats = {};
  sections.forEach((section) => {
    section.seats.forEach((seat) => {
      if (seat.blank) return;
      const area = getSeatArea(seat.id);
      if (area && !isSeatAssignedToCustomArea(seat.id)) {
        areaStats[area] = areaStats[area] || { total: 0, selected: 0 };
        areaStats[area].total++;
        if (seat.selected) areaStats[area].selected++;
      }
    });
  });

  const handleCancelDefineArea = () => {
    setStartSeat(null);
    setSelectedSeats([]);
    setPendingAreaSeats([]);
    setAreaName("");
    setDefineAreaMode(false); // If you want to exit define mode on cancel
  };

  const customAreaStats = areas.map((area) => {
    let selectedCount = 0;
    let validSeatCount = 0;
    area.seats.forEach((seatId) => {
      for (let sec of sections) {
        const seat = sec.seats.find((s) => s.id === seatId);
        if (seat && !seat.blank) {
          validSeatCount++;
          if (seat.selected) selectedCount++;
          break;
        }
      }
    });
    return {
      ...area,
      selected: selectedCount,
      remaining: validSeatCount - selectedCount,
    };
  });
  return (
    <div>
      <div className="w-[1090px] m-5 border border-[#E4E4E4] rounded-xl overflow-hidden">
        <div className="p-2 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#404040] font-montserrat">
            Floor Configuration
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (defineAreaMode) {
                  handleCancel(); // clear current selection
                  setDefineAreaMode(false); // keep define mode enabled
                } else {
                  setDefineAreaMode(true); // toggle on define mode
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
        <div className="flex flex-col border-t border-gray-400">
          <div className="p-2">
            <span className="text-[13px] font-medium text-[#404040] font-montserrat">
              Floor
            </span>
            <SeatMap
              sections={sections}
              onToggle={handleToggle}
              startSeat={startSeat}
              endSeat={endSeat}
            />
          </div>
          <div className="px-2 pb-2">
            <span className="text-[13px] font-medium text-[#404040] font-montserrat">
              Configuration
            </span>
            <div className="border border-[#E4E4E4] rounded-xl overflow-hidden m-2">
              <table className="w-full rounded-md border-collapse">
                <thead className="bg-[#4040401A] text-[13px]">
                  <tr>
                    <th className="px-2 py-1 border border-[#E4E4E4] text-left font-normal">
                      Area Name
                    </th>
                    <th className="px-2 py-1 border border-[#E4E4E4] text-left font-normal">
                      Item (Total)
                    </th>
                    <th className="px-2 py-1 border border-[#E4E4E4] text-left font-normal">
                      Blocks (Remaining)
                    </th>
                    <th className="px-2 py-1 border border-[#E4E4E4] text-left font-normal">
                      Capacity (Selected)
                    </th>
                    <th className="px-2 py-1 border border-[#E4E4E4] text-left font-normal">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#404040] text-[13px]">
                  {customAreaStats.map((area, index) => (
                    <tr key={`custom-${index}`}>
                      <td className="px-2 py-1 border border-[#E4E4E4] ">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: area.color }}
                        ></span>
                        {area.name}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {area.selected + area.remaining}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {area.selected}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {area.remaining}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Reset seat states
                              const updatedSections = [...sections];
                              area.seats.forEach((seatId) => {
                                for (let s of updatedSections) {
                                  const seat = s.seats.find(
                                    (seat) => seat.id === seatId
                                  );
                                  if (seat) {
                                    seat.selected = false;
                                    seat.color = "";
                                  }
                                }
                              });
                              setSections(updatedSections);
                              setAreas((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleEditArea(index)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Name and Color Area</h2>
            <input
              type="text"
              placeholder="Area Name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded mb-4"
            />
            <input
              type="color"
              value={areaColor}
              onChange={(e) => setAreaColor(e.target.value)}
              className="w-full h-10 mb-4 cursor-pointer"
            />
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
      )}
    </div>
  );
};

export default FloorConfiguration;
