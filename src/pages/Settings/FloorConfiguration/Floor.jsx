import SeatMap from "./Seats/Seatmap";

const Floor = ({ sections, onToggle, defineAreaMode,startSeat,endSeat }) => {
  return (
    <div className="p-2">
      <span className="text-[13px] font-medium text-[#404040] font-montserrat">
        Floor
      </span>
      <SeatMap
        sections={sections}
        onToggle={onToggle}
        startSeat={startSeat}
        endSeat={endSeat}
      />
    </div>
  );
};

export default Floor;