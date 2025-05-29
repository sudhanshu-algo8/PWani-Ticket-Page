import React from "react";

const getAreaClass = (seatId) => {
  const row = seatId?.[0];
  const num = parseInt(seatId?.slice(1), 10);
  if (!row || isNaN(num)) return "";

  if (["A", "B", "C", "D", "E", "F", "G"].includes(row) && num >= 1 && num <= 6)
    return "bg-red-100";
  if (
    (row === "A" && num >= 7 && num <= 20) ||
    (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 7 && num <= 19)
  )
    return "bg-blue-100";
  if (
    (row === "A" && num >= 21 && num <= 26) ||
    (["B", "C", "D", "E", "F", "G"].includes(row) && num >= 20 && num <= 25)
  )
    return "bg-yellow-100";
  if (
    (row === "H" && num >= 1 && num <= 6) ||
    (row === "I" && num >= 1 && num <= 6) ||
    (row === "J" && num >= 5 && num <= 6)
  )
    return "bg-green-100";
  if (["H", "I", "J"].includes(row) && num >= 7 && num <= 19)
    return "bg-purple-100";
  if (["H", "I", "J"].includes(row) && num >= 20 && num <= 25)
    return "bg-pink-100";

  return "";
};

const SectionGrid = ({ section, sectionIndex, onToggle }) => {
  // ... same as before including getAreaClass

  const totalCols = 29;
  const isRowA = section.label === "A";
  const seatCount = section.seats.length;

  // (You can keep your getAreaClass from before here)

  return (
    <div className="grid grid-cols-29 w-full gap-x-2 gap-y-2">
      {section.seats.map((seat, seatIdx) => {
        const seatId = seat?.id;
        const isAfterA13 = isRowA && seatId === "A13";
        const isAfter6 = !isRowA && seatId?.endsWith("06");
        const isAfter19 = !isRowA && seatId?.endsWith("19");

        const isBlankSeat =
          (section.label === "J" &&
            ["J01", "J02", "J03", "J04"].includes(seatId)) ||
          (section.label === "B" && ["B12", "B13", "B14"].includes(seatId));

        return (
          <React.Fragment key={seatId}>
            {isBlankSeat ? (
              <div className="w-8 h-6" />
            ) : (
              <button
                className={`border rounded w-8 h-7 text-[13px] font-medium ${getAreaClass(
                  seatId
                )} ${
                  seat.selected
                    ? "border-green-500 text-green-600"
                    : "border-gray-300 text-gray-400"
                }`}
                onClick={() => onToggle(sectionIndex, seatIdx)}
              >
                {seatId}
              </button>
            )}

            {isAfterA13 &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`gap-A13-${i}`} />
              ))}

            {isAfter6 &&
              Array.from({ length: 2 }).map((_, i) => (
                <div key={`gap-06-${seatId}-${i}`} />
              ))}

            {isAfter19 &&
              Array.from({ length: 2 }).map((_, i) => (
                <div key={`gap-19-${seatId}-${i}`} />
              ))}
          </React.Fragment>
        );
      })}

      {Array.from({
        length: totalCols - seatCount - (isRowA ? 3 : 4),
      }).map((_, i) => (
        <div key={`filler-${section.label}-${i}`} />
      ))}
    </div>
  );
};

const SeatMap = ({ sections, onToggle }) => {
  return (
    <div className="p-1 w-full space-y-3 text-[13px]">
      {sections.map((section, idx) => (
        <React.Fragment key={section.label}>
          <SectionGrid
            section={section}
            sectionIndex={idx}
            onToggle={onToggle}
          />

          {/* Add a vertical spacer after row G */}
          {section.label === "G" && <div className="h-1" />}

          <div className="text-center -mt-2.5 -mb-1.5">
            {/* Empty but preserved if you later want labels */}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SeatMap;
