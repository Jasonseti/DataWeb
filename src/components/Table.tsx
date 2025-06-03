import { useEffect, useState } from "react";

const column_widths: string[] = [
  "w-[40px]",
  "w-[10%]",
  "w-auto",
  "w-[10%]",
  "w-[10%]",
  "w-[10%]",
  "w-[10%]",
  "w-[20%]",
];

function TableHeader({ data_headers }) {
  return (
    <thead className="w-full">
      <tr className="w-full h-[30px] leading-[30px] text-center">
        {data_headers.map((head: string, i: number) => (
          <th
            className={
              column_widths[i] +
              " first:rounded-tl-[10px] last:rounded-tr-[10px] border-b-[1.8px] border-l-[1.8px] first:border-l-0 bg-accent"
            }
          >
            {head}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableItems({ data_items }) {
  return (
    <tbody>
      {data_items.map((item: string[]) => (
        <TableRows item={item} />
      ))}
    </tbody>
  );
}

function TableRows({ item }) {
  return (
    <tr className="w-full h-[30px] leading-[30px] font-table table-decor">
      {item.map((value: string, i: number) => (
        <td
          className={
            column_widths[i] +
            " " +
            (i === 2 || i === 7 ? "pl-[1vw]" : "text-center") +
            " border-t-[1.8px] border-l-[1.8px] first:border-l-0"
          }
        >
          {i === 0 ? (
            <label className="inline-block w-full h-[30px]">
              <input type="checkbox" className="scale-[120%]" />
            </label>
          ) : (
            value
          )}
        </td>
      ))}
    </tr>
  );
}

function Table({ data_headers, data_items }) {
  const [is_visible, setVisible] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [is_visible]);

  const updateScrollbar = (e) => {
    setVisible(true);
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const bar_height = (clientHeight / scrollHeight) * clientHeight;
    const position =
      (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - bar_height);
    document.getElementById("scrollbar")!.style.height = bar_height + 1 + "px";
    document.getElementById("scrollbar")!.style.top = position + 1 + "px";
  };

  return (
    <div className="mb-[20px] shadow-[5px_10px_10px_5px_#00000024] max-w-[1100px] m-auto outline-[1.8px] rounded-t-[10px]">
      <table className="w-full">
        <TableHeader data_headers={data_headers} />
      </table>
      <div
        onLoad={(e) => updateScrollbar(e)}
        onScroll={(e) => updateScrollbar(e)}
        className="h-[700px] overflow-auto no-scrollbar"
      >
        <table className="w-full">
          <TableItems data_items={data_items} />
        </table>
      </div>
      <div
        className={
          (!is_visible && "opacity-0 transition-[opacity] duration-500") +
          " float-right relative bottom-[700px] -mb-[700px] inline-block bg-black/20 w-[16px] h-[700px]"
        }
      >
        <div
          id="scrollbar"
          className={
            (!is_visible && "opacity-0 transition-[opacity] duration-500") +
            " relative left-[3px] top-[10px] w-[10px] rounded-[100px] bg-gray-500"
          }
        ></div>
      </div>
    </div>
  );
}

export default Table;
