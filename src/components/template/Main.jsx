/* eslint-disable import/no-anonymous-default-export */
import "./Main.css";
import React from "react";

export default (props) => (
  <React.Fragment>
    <main className="content">
      <div className="">{props.children}</div>
    </main>
  </React.Fragment>
);
