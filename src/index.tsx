import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals.js";

import Layout from "./pages/Layout.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import DataTable from "./pages/DataTable.tsx";

export default function DataWeb() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="database" element={<DataTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);
root.render(<DataWeb />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
