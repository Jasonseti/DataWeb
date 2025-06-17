import { Suspense, useEffect, useState } from "react";

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

function TableHeader({ data_headers, sorted_head, setSorted }) {
  return (
    <thead className="w-full">
      <tr className="w-full h-[30px] leading-[30px] text-center">
        {data_headers.map((head: string, i: number) => (
          <th
            onClick={
              [1, 2, 4, 5, 7].includes(i)
                ? () => {
                    if (sorted_head[0] === i) {
                      setSorted([i, !sorted_head[1]]);
                    } else {
                      setSorted([i, true]);
                    }
                  }
                : void 0
            }
            className={
              column_widths[i] +
              " " +
              (sorted_head[0] === i && "bg-orange-300") +
              " cursor-pointer first:rounded-tl-[10px] last:rounded-tr-[10px] border-b-[1.8px] border-l-[1.8px] first:border-l-0 bg-accent"
            }
          >
            {head}
            {[1, 2, 4, 5, 7].includes(i) && (
              <img
                className={
                  (sorted_head[0] === i && !sorted_head[1] && "-scale-100") +
                  " float-right mr-[3%] inline-block w-[30px]"
                }
                src="./icons/sort.svg"
                alt="sort"
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
function TableBody({ data_items, checked, setChecked }) {
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
    <>
      <div
        onLoad={(e) => updateScrollbar(e)}
        onScroll={(e) => updateScrollbar(e)}
        className="max-h-[700px] overflow-auto no-scrollbar"
      >
        <table className="w-full">
          <TableItems
            data_items={data_items}
            checked={checked}
            setChecked={setChecked}
          />
        </table>
      </div>
      {/* Custom JS Scrollbar */}
      <div
        id="scroll-bg"
        className={
          (!is_visible && "opacity-0 transition-[opacity] duration-500") +
          " float-right relative bottom-[700px] -mb-[700px] h-[700px] inline-block bg-black/20 w-[16px]"
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
    </>
  );
}

function TableItems({ data_items, checked, setChecked }) {
  const pad0 = (num: string, len = 4) =>
    "#" + Array(len + 1 - num.length).join("0") + num;
  return (
    <tbody>
      {data_items.map((item: string[], i: number) => (
        <tr
          className={
            (item[6] === "" ? "table-decor" : "opacity-80 bg-gray-500") +
            " w-full h-[30px] leading-[20px] font-table"
          }
        >
          {/* Checkbox */}
          <td
            className={
              column_widths[0] +
              " h-[30px] text-center border-t-[1.8px] border-l-[1.8px] first:border-l-0"
            }
          >
            <label className="flex w-full h-full">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() =>
                  setChecked(checked.toSpliced(i, 1, !checked[i]))
                }
                className="scale-[120%] m-auto "
              />
            </label>
          </td>
          {/* Table Row */}
          {item.map((value: string, i: number) => (
            <td
              className={
                column_widths[i + 1] +
                " " +
                (i === 1 || i === 6 ? "px-[1vw]" : "text-center") +
                " overflow-hidden border-t-[1.8px] border-l-[1.8px] first:border-l-0"
              }
            >
              {i === 0
                ? pad0(value)
                : i === 6
                ? value
                  ? value.slice(0, 10)
                  : "in stock"
                : value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function Loader() {
  return (
    <div className="flex text-center leading-[200px] h-[200px]">
      <div className="m-auto spinner text-center scale-150"></div>
    </div>
  );
}
function NoResult() {
  return (
    <div className="text-center leading-[200px] h-[200px]">
      <p className="font-secondary text-[25px] font-bold">
        Oops. Found 0 result.
      </p>
    </div>
  );
}

function Table({
  data_headers,
  data_items,
  checked,
  setChecked,
  is_hide,
  setHide,
  sorted_head,
  setSorted,
}) {
  return (
    <div className="max-w-[1100px] m-auto">
      <div className="flex justify-between h-[20px] mx-[20px] mb-[5px]">
        <p
          className={
            (checked.filter((e: boolean) => e).length ? "" : "opacity-0") +
            " transition-all duration-75"
          }
        >
          {checked.filter((e: boolean) => e).length + " items selected."}
        </p>
        <label className="">
          <input
            className="scale-125"
            onClick={() => setHide(!is_hide)}
            checked={is_hide}
            type="checkbox"
          />{" "}
          Only show available items
        </label>
      </div>
      <div className="mb-[20px] shadow-[5px_10px_10px_5px_#00000024] outline-[1.8px] rounded-t-[10px]">
        <table className="w-full">
          <TableHeader
            data_headers={data_headers}
            sorted_head={sorted_head}
            setSorted={setSorted}
          />
        </table>
        <Suspense fallback={<Loader />}>
          {data_items[0] ? (
            data_items[0][0] ? (
              <TableBody
                data_items={data_items}
                checked={checked}
                setChecked={setChecked}
              />
            ) : (
              <Loader />
            )
          ) : (
            <NoResult />
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Table;
