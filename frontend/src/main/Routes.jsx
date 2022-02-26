import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../components/home/Home";
import ClientCrud from "../components/client/ClientCrud";
import VideoCrud from "../components/video/VideoCrud";

export default props =>
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route path="/clients" element={<ClientCrud />} />
    <Route path="/videos" element={<VideoCrud />} />
    <Route path="*" element={<Home />} />
  </Routes>
