import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa6";
import { useState } from "react";

function SidebarList({ title, link, icon, is_folded }) {
  return (
    <Link to={link}>
      <li className="sidebar-list">
        <div className="flex flex-auto">
          <p
            className={
              (is_folded && "hidden") +
              "  font-main font-medium text-[1.15em] m-auto"
            }
          >
            {title}
          </p>
        </div>
        <div className="float-right h-full w-[50px] flex">
          <div className="scale-150 m-auto">{icon}</div>
        </div>
      </li>
    </Link>
  );
}
function SideBar({ nav_titles, nav_links, nav_icons }) {
  const [is_folded, setFolded] = useState<boolean>(true);
  const toggleFold = () => setFolded(!is_folded);

  return (
    <div
      className={
        (is_folded ? "w-[60px]" : "w-[calc(max(min(20%,240px),150px))]") +
        " transition-[width] duration-500 ease h-screen bg-primary"
      }
    >
      <div className="border-b-2 border-accent h-[75px] px-[10px]">
        <div
          className={
            (is_folded && "-rotate-90") +
            " transition-all duration-500 cursor-pointer text-secondary h-full w-[50px] float-right flex [&>*:hover]:bg-primary-shade"
          }
          onClick={toggleFold}
        >
          <FaGripLines className="transition-all duration-100 box-content p-[3px] m-auto rounded-md scale-200" />
        </div>
      </div>
      <ul>
        {nav_titles.map((title: string, i: number) => (
          <SidebarList
            title={title}
            link={nav_links[i]}
            icon={nav_icons[i]}
            is_folded={is_folded}
          />
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
