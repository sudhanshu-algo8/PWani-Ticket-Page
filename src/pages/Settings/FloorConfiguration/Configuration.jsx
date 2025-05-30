const Configuration = ({
  customAreaStats,
  sections,
  setSections,
  areas,
  setAreas,
  handleEditArea,
}) => {
  return (
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
                        const updatedSections = sections.map((section) => ({
                          ...section,
                          seats: section.seats.map((seat) => ({
                            ...seat,
                          })),
                        }));
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
                        setAreas((prev) => prev.filter((_, i) => i !== index));
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
  );
};

export default Configuration;