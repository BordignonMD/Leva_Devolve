import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AddBook from "./pages/AddBook";
import CreateLibrary from "./pages/CreateLibrary";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/register" component={CreateLibrary} />
        <Route path="/add-book" component={AddBook} />
      </Switch>
    </BrowserRouter>
  );
}
