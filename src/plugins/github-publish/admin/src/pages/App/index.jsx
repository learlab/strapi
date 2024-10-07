import React from "react";

import {Route } from "react-router-dom";

import pluginId from "../../pluginId";
import HomePage from "../HomePage";

const App = () => {
  return (
    <div>
      <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
    </div>
  );
};

export default App;
