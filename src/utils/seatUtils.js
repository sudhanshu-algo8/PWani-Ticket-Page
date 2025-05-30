export const getSeatsInRange = (start, end, sections) => {
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

export const getSeatArea = (seatId) => {
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

export const isSeatAssignedToCustomArea = (seatId, areas) => {
  return areas.some((area) => area.seats.includes(seatId));
};