import React from "react";
import Sidebar from "./Sidebar";
import FloorConfiguration from "./FloorConfiguration";

const Settings = () => {
  return (
    <div className="flex bg-[#FAFAFA] h-screen gap-2">
      <Sidebar />
      <FloorConfiguration />
    </div>
  );
};

export default Settings;
