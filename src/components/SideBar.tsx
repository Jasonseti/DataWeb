import { Link } from "react-router-dom";
import { useState } from "react";

function ProfileMenu({ is_folded, toggleFold }) {
  return (
    <div>
      <div className="px-[5px] h-[60px]">
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
            className="fill-accent transition-all duration-100 box-content p-[3px] m-auto rounded-md scale-150"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>{" "}
        </div>
      </div>
      <div className="px-[5px] mr-[10px] h-[60px] flex justify-around place-items-center border-1 bg-background/90 rounded-r-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="50px"
          viewBox="0 -960 960 960"
          width="50px"
          className={
            (!is_folded && "pl-[calc(min(10px,1vw))]") + " fill-text-black"
          }
        >
          <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
        </svg>
        <div
          className={
            (is_folded ? "w-[0px] opacity-0" : "w-full delay-250") +
            " pl-[5px] transition-all duration-250 text-[1.25vw] lg:text-[13px] font-secondary font-medium"
          }
        >
          <p>User: JasonSeti</p>
          <p>Valid until: 07-03-2026</p>
        </div>
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
            " transition-all duration-250 text-text-white font-secondary font-semi text-[2.8vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[22px] leading-[50px]"
          }
        >
          {title}
        </p>
        <div className="h-full flex">
          <div className="scale-150 m-auto fill-accent">{icon}</div>
        </div>
      </li>
      <hr className="w-full border-[1.5px] border-accent rounded-[100px]" />
    </Link>
  );
}
function SideBar({ nav_titles, nav_links, nav_icons }) {
  const [is_folded, setFolded] = useState<boolean>(false);
  const toggleFold = () => setFolded(!is_folded);

  return (
    <div
      id="sidebar"
      className={
        (is_folded ? "w-[60px]" : "w-[calc(max(min(20%,220px),150px))]") +
        " sticky top-[20px] transition-[width] duration-500 ease h-[780px] bg-primary rounded-r-[12px]"
      }
    >
      <ProfileMenu is_folded={is_folded} toggleFold={toggleFold} />
      <ul className="px-[5px]">
        {nav_titles.map((title: string, i: number) => (
          <SidebarList
            title={title}
            link={nav_links[i]}
            icon={nav_icons[i]}
            is_folded={is_folded}
          />
        ))}
      </ul>
      {/* <script>
        document.getElementById("sidebar")!.style.height =
        document.body.clientHeight;
      </script> */}
    </div>
  );
}

export default SideBar;
