import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from '../src/components/Dashboard'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router basename="/covid-india">
      <Route exact path="/" component={Dashboard}></Route>
    </Router>
  );
}

export default App;
