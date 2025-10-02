import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { DemoApp } from "./DemoApp";

let elem = document.getElementById("root") as HTMLElement;
if (!elem) {
  elem = document.createElement("div");
  elem.id = "root";
  document.body.appendChild(elem);
}

const root = ReactDOM.createRoot(elem);
root.render(<DemoApp />);
