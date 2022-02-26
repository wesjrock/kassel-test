import "./Nav.css";
import React from "react";
import { Link } from "react-router-dom";

export default props =>
  <aside className="menu-area">
    <nav className="menu">
      <Link to="/">
        <i className="fa fa-home"></i> Início
      </Link>
      <Link to="/clients">
        <i className="fa fa-users"></i> Clientes
      </Link>
      <Link to="/videos">
        <i className="fa fa-video-camera"></i> Videos
      </Link>
    </nav>
  </aside>
