import React from "react";
import SideBar from "../components/SideBar.tsx";
import TopBar from "../components/TopBar.tsx";
import { Outlet } from "react-router-dom";

import { TiHome } from "react-icons/ti";
import { FaTableList } from "react-icons/fa6";
const nav_titles: string[] = ["Home", "Database"];
const nav_links: string[] = ["/", "/database"];
const nav_icons = [<TiHome />, <FaTableList />];

function Layout() {
  return (
    <div className="bg-secondary flex flex-wrap">
      <SideBar
        nav_titles={nav_titles}
        nav_links={nav_links}
        nav_icons={nav_icons}
      />
      <div className="flex-auto">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
