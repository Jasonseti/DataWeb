import React from "react";
import { useState } from "react";

function SideBar({ bar_titles }) {
  const [focused_index, setFocus] = useState(2);

  function onTitleClick(i) {
    setFocus(i);
  }

  return (
    <div className="sm:w-30 lg:w-50 h-full bg-blue-400">
      <ul>
        {Object.entries(bar_titles).map(([title, subtitle], i) => (
          <li>
            <button
              className={
                "cursor-pointer w-full p-3 " +
                (i === focused_index && "bg-white")
              }
              onClick={() => onTitleClick(i)}
            >
              {title}
            </button>
            <ul className="bg-blue-300">
              {subtitle.map((subtitle) => (
                <li
                  className={
                    "transition delay-150 duration-300 ease-in-out " +
                    (i === focused_index ? "" : "hidden")
                  }
                >
                  <button className="cursor-pointer w-full p-3 ">
                    {subtitle}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
