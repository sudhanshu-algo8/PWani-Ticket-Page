import React from "react";

const Sidebar = () => {
  return (
    <div>
      <div className="w-[333px] h-[663px]  m-5 border border-[#E4E4E4] rounded-xl overflow-hidden">
        <div className="p-3.5 pt-4 text-[13px] font-medium text-[#404040] font-montserrat">
          Settings
        </div>
        <div className="flex flex-col border-t border-gray-400 text-[13px] font-medium text-[#404040] font-montserrat">
          <span className="border-b border-[#cfcece] p-3 bg-[#d8ebfa] hover:bg-[#F8DAB5]">
            Floor Configuration
          </span>
          <span className="border-b border-[#cfcece] p-3 hover:bg-[#F8DAB5]">
            User Management
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
