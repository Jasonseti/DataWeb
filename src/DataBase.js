import React from "react";
import { useState } from "react";

function Table({ data }) {
  return (
    <table>
      <thead>
        <tr>
          {Object.entries(data[0])
            .slice(0, 5)
            .map(([key, value]) => (
              <th className="border-2">{key}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((data_row) => (
          <tr>
            {Object.entries(data_row)
              .slice(0, 5)
              .map(([key, value]) => (
                <td className="border-1">{value}</td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UtilityBar() {
  return (
    <input
      className="border-2 rounded-sm px-2"
      type="text"
      placeholder="Search..."
    ></input>
  );
}

function DataBase({ data }) {
  return (
    <div class="m-auto">
      <UtilityBar />
      <Table data={data} />
    </div>
  );
}

export default DataBase;
