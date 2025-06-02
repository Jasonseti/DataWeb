import { useState } from "react";
import CategoryHeader from "../components/CategoryHeader.tsx";
import UtilityBar from "../components/UtilityBar.tsx";
import Table from "../components/Table.tsx";

const categories: string[] = ["Mix", "Necklace", "Ring"];

const data_headers: string[] = [
  "",
  "ID",
  "Name",
  "Color",
  "Weight",
  "Purity",
  "Stones",
  "Date Sold",
];
const data_items: string[][] = Array(120).fill(
  Array(data_headers.length).fill("dummy")
);

function DataTable() {
  const [selected_index, setSelected] = useState<number>(0);
  const [search_value, setSearch] = useState<string>("");

  return (
    <>
      <CategoryHeader
        categories={categories}
        selected_index={selected_index}
        setSelected={setSelected}
      />
      <UtilityBar search_value={search_value} setSearch={setSearch} />
      <Table data_headers={data_headers} data_items={data_items} />
    </>
  );
}
export default DataTable;
