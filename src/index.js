import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import json_data from "./PlayerIndex_nba_stats.json";
import SideBar from "./components/SideBar";
import DataBase from "./components/DataBase";

const bar_titles = {
  Home: [],
  Session: ["Login", "Logout", "SignUp"],
  Database: ["Ring", "Necklace", "Earring", "Bracelet", "Bangle"],
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="flex">
      <SideBar bar_titles={bar_titles} />
      <DataBase data={json_data.slice(0, 1000)} />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
