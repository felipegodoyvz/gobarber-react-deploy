import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import GlobalStyle from "./styles/global";

import AppProvider from "./hooks/";

import Routes from "./routes";

/*import AppProvider from "./hooks/index";*/

/*const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </BrowserRouter>
  );
};*/

const App: React.FC = () => (
    <Router>
    <AppProvider>
    <Routes />
    </AppProvider>

    <GlobalStyle />
    </Router>
  );


export default App;
