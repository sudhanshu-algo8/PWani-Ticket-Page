import React from "react";

const getAreaClass = (seatId) => {
  const row = seatId?.[0];
  const num = parseInt(seatId?.slice(1), 10);
  if (!row || isNaN(num)) return "";

  if (["A", "B", "C", "D", "E", "F", "G"].includes(row) && num >= 1 && num <= 6)
    return "";
  if (
    (row === "A" && num >= 7 && num <= 20) ||
    (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 7 && num <= 19)
  )
    return "";
  if (
    (row === "A" && num >= 21 && num <= 26) ||
    (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 20 && num <= 26)
  )
    return "";
  if (
    (row === "H" && num >= 1 && num <= 6) ||
    (row === "I" && num >= 1 && num <= 6) ||
    (row === "J" && num >= 5 && num <= 6)
  )
    return "";
  if (["H", "I", "J"].includes(row) && num >= 7 && num <= 19) return "";
  if (["H", "I", "J"].includes(row) && num >= 20 && num <= 26) return "";

  return "";
};

const isBlankSeat = (seatId) => {
  if (!seatId) return false;
  const row = seatId[0];
  const num = parseInt(seatId.slice(1), 10);

  // Specific blanks
  if (row === "A" && [14, 15, 16].includes(num)) return true;
  if (["B", "C", "D", "E", "F", "G", "H", "I", "J"].includes(row)) {
    if ([7, 8, 20, 21].includes(num)) return true;
  }
  if (row === "J" && [1, 2, 3, 4].includes(num)) return true;
  if (row === "B" && [14, 15, 16].includes(num)) return true;

  return false;
};

const buildGlobalVisualIndexMap = (sections) => {
  const visualIndexMap = {};
  let visualIndex = 0;

  sections.forEach((section) => {
    section.seats.forEach((seat) => {
      if (seat.id) {
        visualIndexMap[seat.id] = visualIndex++;
      }
    });
  });

  return visualIndexMap;
};

const SectionGrid = ({
  section,
  sectionIndex,
  onToggle,
  visualIndexMap,
  startSeat,
  endSeat,
}) => {
  const totalCols = 29;
  const seatCount = section.seats.length;

  return (
    <div className="grid grid-cols-29 w-full gap-x-2 gap-y-2">
      {section.seats.map((seat, seatIdx) => {
        const seatId = seat?.id;

        if (isBlankSeat(seatId)) {
          return (
            <div
              key={`blank-${section.label}-${seatIdx}`}
              className="w-8 h-6"
              aria-hidden="true"
            />
          );
        }

        // Check if this seat is start or end seat
        const isStart =
          startSeat?.sectionIndex === sectionIndex &&
          startSeat?.seatIndex === seatIdx;
        const isEnd =
          endSeat?.sectionIndex === sectionIndex &&
          endSeat?.seatIndex === seatIdx;

        // Base styles from your code
        let backgroundColor =
          seat.selected && seat.color ? seat.color : seat.color;
        let borderColor = seat.selected && seat.color ? seat.color : "#d1d5db";
        let textColor = seat.selected ? "text-white" : "text-gray-400";

        // Override styles for start/end seat highlights
        if (isStart) {
          backgroundColor = "#22c55e"; // green background
          borderColor = "#16a34a"; // darker green border
          textColor = "text-white";
        } else if (isEnd) {
          backgroundColor = "#ef4444"; // red background
          borderColor = "#b91c1c"; // darker red border
          textColor = "text-white";
        }

        return (
          <button
            key={seatId}
            className={`border rounded w-8 h-7 text-[13px] font-medium ${getAreaClass(
              seatId
            )} ${textColor}`}
            style={{
              backgroundColor,
              borderColor,
              transition: "all 0.3s ease",
            }}
            onClick={() =>
              onToggle(sectionIndex, seatIdx, visualIndexMap[seatId])
            }
          >
            {seatId}
          </button>
        );
      })}

      {Array.from({ length: totalCols - seatCount }).map((_, i) => (
        <div key={`filler-${section.label}-${i}`} />
      ))}
    </div>
  );
};

const SeatMap = ({ sections, onToggle, startSeat, endSeat }) => {
  const visualIndexMap = React.useMemo(
    () => buildGlobalVisualIndexMap(sections),
    [sections]
  );

  return (
    <div className="p-1 w-full space-y-3 text-[13px]">
      {sections.map((section, idx) => (
        <React.Fragment key={section.label}>
          <SectionGrid
            section={section}
            sectionIndex={idx}
            onToggle={onToggle}
            visualIndexMap={visualIndexMap}
            startSeat={startSeat}
            endSeat={endSeat}
          />
          {section.label === "G" && <div className="h-1" />}
          <div className="text-center -mt-2.5 -mb-1.5" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default SeatMap;
