import React from "react";
import SideBar from "../components/SideBar.tsx";
import TopBar from "../components/TopBar.tsx";
import { Outlet } from "react-router-dom";

const nav_titles: string[] = ["Dashboard", "Database"];
const nav_links: string[] = ["/", "/database"];
const nav_icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    className="fill-accent"
  >
    <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    className="fill-accent"
  >
    <path d="M320-80q-33 0-56.5-23.5T240-160v-480q0-33 23.5-56.5T320-720h480q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h200v-120H320v120Zm280 0h200v-120H600v120ZM80-240v-560q0-33 23.5-56.5T160-880h560v80H160v560H80Zm240-120h200v-120H320v120Zm280 0h200v-120H600v120ZM320-560h480v-80H320v80Z" />
  </svg>,
];

function Layout() {
  return (
    <div className="bg-background">
      <TopBar />

      <div className="flex flex-nowrap">
        <SideBar
          nav_titles={nav_titles}
          nav_links={nav_links}
          nav_icons={nav_icons}
        />
        <div className="flex-auto px-[18px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
