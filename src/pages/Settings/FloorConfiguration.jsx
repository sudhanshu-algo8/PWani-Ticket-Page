import React, { useState } from "react";
import SeatMap from "./Seatmap";

const FloorConfiguration = () => {
  const initialSections = [
    {
      label: "A",
      seats: Array.from({ length: 26 }, (_, i) => ({
        id: `A${(i + 1).toString().padStart(2, "0")}`,
        selected: false,
      })),
    },
    {
      label: "B",
      seats: Array.from({ length: 25 }, (_, i) => ({
        id: `B${(i + 1).toString().padStart(2, "0")}`,
        selected: false,
      })),
    },
    ...["C", "D", "E", "F", "G", "H", "I"].map((label) => ({
      label,
      seats: Array.from({ length: 25 }, (_, i) => ({
        id: `${label}${(i + 1).toString().padStart(2, "0")}`,
        selected: false,
      })),
    })),
    {
      label: "J",
      seats: Array.from({ length: 25 }, (_, i) => ({
        id: `J${(i + 1).toString().padStart(2, "0")}`,
        selected: false,
      })),
    },
  ];

  const [sections, setSections] = useState(initialSections);

  const handleToggle = (sectionIndex, seatIndex) => {
    setSections((prev) =>
      prev.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
              ...section,
              seats: section.seats.map((seat, idx) =>
                idx === seatIndex ? { ...seat, selected: !seat.selected } : seat
              ),
            }
          : section
      )
    );
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
      return "Area 1";
    if (
      (row === "A" && num >= 7 && num <= 20) ||
      (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 7 && num <= 19)
    )
      return "Area 2";
    if (
      (row === "A" && num >= 21 && num <= 26) ||
      (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 20 && num <= 25)
    )
      return "Area 3";
    if (
      (row === "H" && num >= 1 && num <= 6) ||
      (row === "I" && num >= 1 && num <= 6) ||
      (row === "J" && num >= 5 && num <= 6)
    )
      return "Area 4";
    if (["H", "I", "J"].includes(row) && num >= 7 && num <= 19) return "Area 5";
    if (["H", "I", "J"].includes(row) && num >= 20 && num <= 25)
      return "Area 6";

    return null;
  };

  const areaStats = {
    "Area 1": { total: 0, selected: 0 },
    "Area 2": { total: 0, selected: 0 },
    "Area 3": { total: 0, selected: 0 },
    "Area 4": { total: 0, selected: 0 },
    "Area 5": { total: 0, selected: 0 },
    "Area 6": { total: 0, selected: 0 },
  };

  sections.forEach((section) => {
    section.seats.forEach((seat) => {
      const area = getSeatArea(seat.id);
      if (area) {
        areaStats[area].total++;
        if (seat.selected) areaStats[area].selected++;
      }
    });
  });

  return (
    <div>
      <div className="w-[1090px] m-5 border border-[#E4E4E4] rounded-xl overflow-hidden">
        <div className="p-2 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#404040] font-montserrat">
            Floor Configuration
          </span>
          <button className="bg-green-600 text-white py-1 px-3 rounded-2xl">
            Save Changes
          </button>
        </div>
        <div className="flex flex-col border-t border-gray-400">
          <div className="p-2">
            <span className="text-[13px] font-medium text-[#404040] font-montserrat">
              Floor
            </span>
            <SeatMap sections={sections} onToggle={handleToggle} />
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
                  </tr>
                </thead>
                <tbody className="text-[#404040] text-[13px]">
                  {Object.entries(areaStats).map(([area, stats], index) => (
                    <tr key={area}>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {area}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {stats.total}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {stats.total - stats.selected}
                      </td>
                      <td className="px-2 py-1 border border-[#E4E4E4]">
                        {stats.selected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorConfiguration;
