import { useState, useEffect } from "react";
import CategoryHeader from "../components/CategoryHeader.tsx";
import UtilityBar from "../components/UtilityBar.tsx";
import Table from "../components/Table.tsx";
import axios from "axios";

const categories: string[] = ["Mix", "Foo", "Bar"];
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
const db_fields: string[] = [
  "",
  "ID",
  "name",
  "color",
  "weight",
  "purity",
  "stones",
  "date_sold",
];

function DataTable() {
  const [selected_category, setCategory] = useState<number>(0);
  const [search_value, setSearch] = useState<string>("");
  const [data_items, setItems] = useState<string[][]>([[]]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [is_updated, setUpdated] = useState<boolean>(false);
  const [sorted_head, setSorted] = useState<any>([1, true]);
  const [is_hide, setHide] = useState<boolean>(false);
  // Fetch Table Contents
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setItems([[]]);
      const fetchData = async () => {
        let url =
          `/api/items?search=${search_value}` +
          `&hide_sold=${is_hide}` +
          `&sort=${db_fields[sorted_head[0]]}` +
          `&ascending=${sorted_head[1]}` +
          `&category=${
            selected_category === 0
              ? "mix"
              : categories[selected_category].toLowerCase()
          }`;
        return await axios.get(url).then((results) => results.data);
      };

      fetchData().then((results) => {
        setItems(
          results.map((result: string[][]) =>
            Object.values(result).toString().split(",")
          )
        );
        setChecked(Array(results.length).fill(false));
      });
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search_value, sorted_head, is_updated, is_hide, selected_category]);

  const update = () => setUpdated(!is_updated);
  return (
    <>
      <CategoryHeader
        categories={categories}
        selected_category={selected_category}
        setCategory={setCategory}
        update={update}
      />
      <UtilityBar
        categories={categories}
        selected_category={selected_category}
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
        checked={checked}
        setChecked={setChecked}
        is_hide={is_hide}
        setHide={setHide}
        sorted_head={sorted_head}
        setSorted={setSorted}
      />
    </>
  );
}
export default DataTable;
