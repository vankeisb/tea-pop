import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { DemoApp } from "./DemoApp";

console.log("yalla");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<DemoApp />);
