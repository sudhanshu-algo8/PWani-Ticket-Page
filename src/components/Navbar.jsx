import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { MdHelp, MdKeyboardArrowDown } from "react-icons/md";
import { PiSignOutFill } from "react-icons/pi";
import { TbSettingsFilled } from "react-icons/tb";
import {FaSearch} from 'react-icons/fa'
import { IoIosSearch } from "react-icons/io";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="shadow-md bg-white">
      <div className="flex items-center justify-between border-b p-2 border-[#E4E4E4]">
        <div className="flex items-center gap-x-1 my-auto">
          <img src="/PwaniLogo.png" alt="Logo" width={30}/>{" "}
          <span className="text-[25px] font-medium text-[#ED1D23] font-montserrat">
            Pwani
          </span>
          <span className="text-[26px] text-[#404040] font-montserrat">
            {" "}
            |
          </span>{" "}
          <span className="text-[25px] font-medium text-[#404040] font-montserrat">
            FG Warehousing
          </span>
        </div>

        <div className="">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-100 rounded-full border border-gray-300 px-2 py-2 pl-10 text-sm"
            />
            <span className="absolute left-3 text-2xl text-gray-400 flex items-center justify-center">
              <IoIosSearch />
            </span>
          </div></div>
        <div className="flex gap-3">
          <span className="texl-[16px]">Good Afternoon!</span>
          <span>
            <IoSettingsSharp className="text-2xl" />
          </span>
          <div className="relative">
            <span
              className="text-2xl hover:text-orange-400 flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <FaCircleUser />
              <MdKeyboardArrowDown
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>

            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-45 bg-white border border-gray-200 rounded shadow-md z-10">
                <ul className="text-sm text-gray-700 p-2">
                 
                  <li className="px-4 py-2 hover:bg-orange-200 cursor-pointer">
                    <span className="flex self-start items-center gap-2 ">
                      <PiSignOutFill />
                      Sign out
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 pl-10 gap-10 flex text-[13px] font-medium text-[#404040] font-montserrat">
        <span className="hover:cursor-pointer">Inventory </span>
        <span className="hover:cursor-pointer">Logs </span>
        <span className="hover:cursor-pointer">2D Map</span>
      </div>
    </div>
  );
};

export default Navbar;
