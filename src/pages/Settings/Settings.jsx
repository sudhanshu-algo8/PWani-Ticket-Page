import React from "react";
import Sidebar from "./Sidebar";
import FloorConfiguration from "./FloorConfiguration";

const Settings = () => {
  return (
    <div className="flex bg-[#FAFAFA] h-screen gap-1">
      <Sidebar />
      <FloorConfiguration />
    </div>
  );
};

export default Settings;
