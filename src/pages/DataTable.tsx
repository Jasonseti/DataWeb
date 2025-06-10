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

function DataTable() {
  const [selected_index, setSelected] = useState<number>(0);
  const [search_value, setSearch] = useState<string>("");
  const [data_items, setItems] = useState<string[][]>([[]]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [is_updated, setUpdated] = useState<boolean>(false);
  const update = () => setUpdated(!is_updated);
  return (
    <>
      <CategoryHeader
        categories={categories}
        selected_index={selected_index}
        setSelected={setSelected}
        is_updated={is_updated}
      />
      <UtilityBar
        data_items={data_items}
        checked={checked}
        setChecked={setChecked}
        search_value={search_value}
        setSearch={setSearch}
        update={update}
      />
      <Table
        data_headers={data_headers}
        data_items={data_items}
        setItems={setItems}
        checked={checked}
        setChecked={setChecked}
        search_value={search_value}
        is_updated={is_updated}
      />
    </>
  );
}
export default DataTable;
