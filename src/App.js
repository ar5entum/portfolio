import React, { PureComponent } from "react";
import "./App.css";
import Mesh from "./components/Mesh/Mesh";
import Archive from "./pages/Archive";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Resume from "./pages/Resume";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import { Leva } from "leva";

export default class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <div className="main">
          <Leva hidden={true} />
          <NavBar />
          <Mesh />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="archive" element={<Archive />} />
            <Route path="resume" element={<Resume />} />
            <Route path="simulator" element={<Simulator />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}
