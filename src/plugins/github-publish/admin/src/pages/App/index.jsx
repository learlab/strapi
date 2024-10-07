import React from "react";

import {Route, Routes } from "react-router-dom";

import pluginId from "../../pluginId";
import HomePage from "../HomePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
      </Routes>
    </div>
  );
};

export default App;
