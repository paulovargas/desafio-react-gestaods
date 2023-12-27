/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Switch, Route, Redirect } from "react-router";
import MyComponent from "../components/utils/MyComponent";
import PacienteCrud from "../components/pacientes/PacienteCrud";

export default (props) => (
  <Switch>
    <Route exact path="/" component={PacienteCrud} />

    {/* <Route path="/modal" component={MyComponent} /> */}


    <Redirect from="*" to="/" />
  </Switch>
);
