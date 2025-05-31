import React from "react";

function SideBar({ banner_names }: { banner_names: string[] }) {
  return (
    <div>
      <ul>
        {banner_names.map((title, i) => (
          <li>{title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
