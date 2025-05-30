import { useMemo, useState } from "react";
import { initialSectionsConfig } from "../../constants/seatConfig";
import {
  getSeatArea,
  getSeatsInRange,
  isSeatAssignedToCustomArea,
} from "../../utils/seatUtils";
import AreaModal from "./FloorConfiguration/AreaModal";
import Configuration from "./FloorConfiguration/Configuration";
import FCNavbar from "./FloorConfiguration/FCNavbar";
import Floor from "./FloorConfiguration/Floor";

const FloorConfiguration = () => {
  const initialSections = useMemo(() => initialSectionsConfig, []);

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
  const [pendingAreaSeats, setPendingAreaSeats] = useState([]);

  const handleCancel = () => {
    setStartSeat(null);
    setEndSeat(null);

    const seatsToClear = selectedSeats.length > 0 ? selectedSeats : [];

    const clearedSections = sections.map((section, sIdx) => {
      return {
        ...section,
        seats: section.seats.map((seat, seatIdx) => {
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
    setStartSeat(null);
    setSelectedSeats([]);
    setAreaName(areaToEdit.name);
    setAreaColor(areaToEdit.color);
    setDefineAreaMode(true);
    setEditingAreaIndex(index);
  };

  const handleToggle = (sectionIndex, seatIndex, visualIndex) => {
    if (!defineAreaMode) {
      const updatedSections = sections.map((section) => ({
        ...section,
        seats: section.seats.map((seat) => ({ ...seat })),
      }));
      const seat = updatedSections[sectionIndex].seats[seatIndex];
      seat.selected = !seat.selected;
      setSections(updatedSections);
      return;
    }

    if (!startSeat) {
      setStartSeat({ sectionIndex, seatIndex });
    } else {
      const end = { sectionIndex, seatIndex };
      const selected = getSeatsInRange(startSeat, end, sections);
      const selectedSeatIds = selected.map(
        ({ sectionIndex, seatIndex }) =>
          sections[sectionIndex].seats[seatIndex].id
      );

      const updatedSections = sections.map((section) => ({
        ...section,
        seats: section.seats.map((seat) => ({ ...seat })),
      }));

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

      selected.forEach(({ sectionIndex, seatIndex }) => {
        updatedSections[sectionIndex].seats[seatIndex].selected = true;
        updatedSections[sectionIndex].seats[seatIndex].color =
          areaColor || "#22c55e";
      });

      setSections(updatedSections);
      setSelectedSeats(selected);
      setPendingAreaSeats(selectedSeatIds);
    }
  };

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

    const updatedSections = sections.map((section) => ({
      ...section,
      seats: section.seats.map((seat) => ({ ...seat })),
    }));

    selectedSeats.forEach(({ sectionIndex, seatIndex }) => {
      updatedSections[sectionIndex].seats[seatIndex].color = areaColor;
    });

    const newArea = {
      name: areaName,
      color: areaColor,
      seats: pendingAreaSeats,
    };

    const updatedAreas = [...areas];

    if (editingAreaIndex !== null) {
      updatedAreas[editingAreaIndex] = newArea;
      setEditingAreaIndex(null);
    } else {
      updatedAreas.push(newArea);
    }

    setAreas(updatedAreas);
    setSections(updatedSections);
    setStartSeat(null);
    setSelectedSeats([]);
    setPendingAreaSeats([]);
    setAreaName("");
    setAreaColor("");
    setShowModal(false);
    setDefineAreaMode(false);
  };

  const areaStats = {};
  sections.forEach((section) => {
    section.seats.forEach((seat) => {
      if (seat.blank) return;
      const area = getSeatArea(seat.id);
      if (area && !isSeatAssignedToCustomArea(seat.id, areas)) {
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
    setDefineAreaMode(false);
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
        <FCNavbar
          title={"Floor Configuration"}
          handleCancel={handleCancel}
          defineAreaMode={defineAreaMode}
          setDefineAreaMode={setDefineAreaMode}
          handleSaveChangesClick={handleSaveChangesClick}
        />
        <div className="flex flex-col border-t border-gray-400">
          <Floor
            sections={sections}
            onToggle={handleToggle}
            defineAreaMode={defineAreaMode}
            startSeat={startSeat}
            endSeat={endSeat}
          />
          <Configuration
            customAreaStats={customAreaStats}
            sections={sections}
            setSections={setSections}
            areas={areas}
            setAreas={setAreas}
            handleEditArea={handleEditArea}
          />
        </div>
      </div>

      <AreaModal
        showModal={showModal}
        areaName={areaName}
        areaColor={areaColor}
        setAreaName={setAreaName}
        setAreaColor={setAreaColor}
        setShowModal={setShowModal}
        setSelectedSeats={setSelectedSeats}
        handleSaveArea={handleSaveArea}
      />
    </div>
  );
};

export default FloorConfiguration;
