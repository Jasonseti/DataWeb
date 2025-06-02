import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa6";
import { useState } from "react";

function ProfileMenu({ is_folded, toggleFold }) {
  return (
    <div>
      <div className="h-[60px]">
        <div
          className={
            (is_folded && "-rotate-90") +
            " transition-all duration-500 cursor-pointer text-secondary h-full w-[50px] float-right flex [&>*:hover]:bg-primary-shade"
          }
          onClick={toggleFold}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
            className="transition-all duration-100 box-content p-[3px] m-auto rounded-md scale-150 fill-accent"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>{" "}
        </div>
      </div>
      <div className="h-[80px] border-1">
        <img src="" alt="profile-picture" />
      </div>
    </div>
  );
}
function SidebarList({ title, link, icon, is_folded }) {
  return (
    <Link to={link}>
      <li
        className="w-full h-[50px] px-[12px] my-[10px]
        flex justify-between cursor-pointer rounded-2xl hover:bg-primary-shade 
        transition-all duration-150 ease-in-out"
      >
        <p
          className={
            (is_folded ? "w-[0px] opacity-0" : "w-full delay-400") +
            " transition-all duration-250 text-secondary font-secondary font-semi text-[2.8vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[22px] leading-[50px]"
          }
        >
          {title}
        </p>
        <div className="h-full flex">
          <div className="scale-150 m-auto">{icon}</div>
        </div>
      </li>
      <hr className="w-full border-[1.5px] border-accent rounded-[100px]" />
    </Link>
  );
}
function SideBar({ nav_titles, nav_links, nav_icons }) {
  const [is_folded, setFolded] = useState<boolean>(true);
  const toggleFold = () => setFolded(!is_folded);

  return (
    <div
      className={
        (is_folded ? "w-[60px]" : "w-[calc(max(min(20%,220px),150px))]") +
        " px-[5px] transition-[width] duration-500 ease h-[111vh] bg-primary rounded-r-[12px]"
      }
    >
      <ProfileMenu is_folded={is_folded} toggleFold={toggleFold} />
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
