import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Settings from "./pages/Settings/Settings";
import DashLayout from "./layout/DashLayout";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<DashLayout/>}>
          <Route path="/" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
