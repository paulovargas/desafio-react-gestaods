import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";
import { ThemeProvider } from "styled-components";

const theme = {

};

export default (props) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <div className="app">
        <Routes />
      </div>
    </ThemeProvider>
  </BrowserRouter>
);
