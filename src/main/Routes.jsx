/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Switch, Route, Redirect } from "react-router";
import PacienteCrud from "../components/pacientes/PacienteCrud";

export default (props) => (
  <Switch>
    <Route exact path="/" component={PacienteCrud} />
    <Redirect from="*" to="/" />
  </Switch>
);
