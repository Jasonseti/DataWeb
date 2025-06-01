const column_widths: string[] = [
  "w-[10%]",
  "w-[30%]",
  "w-[10%]",
  "w-[10%]",
  "w-[10%]",
  "w-[20%]",
  "w-[10%]",
];

function TableHeader({ data_headers }) {
  return (
    <div className="flex flex-row w-full pr-[10px]">
      {data_headers.map((head: string, i: number) => (
        <div
          className={
            column_widths[i] + " h-[30px] leading-[30px] text-center outline-1"
          }
        >
          {head}
        </div>
      ))}
    </div>
  );
}

function TableItems({ data_items }) {
  return (
    <div className="outline-1 h-[400px] no-scrollbar">
      {data_items.map((item: string[]) => (
        <TableRows item={item} />
      ))}
    </div>
  );
}

function TableRows({ item }) {
  return (
    <div className="flex flex-row outline-1">
      {item.map((value: string, i: number) => (
        <div
          className={
            column_widths[i] +
            " h-[30px] leading-[30px] " +
            (i === 1 ? "pl-1" : "text-center") +
            " outline-1"
          }
        >
          {value}
        </div>
      ))}
    </div>
  );
}

function Table({ data_headers, data_items }) {
  return (
    <div className="max-w-[1200px] m-auto px-[20px]">
      <TableHeader data_headers={data_headers} />
      <TableItems data_items={data_items} />
    </div>
  );
}

export default Table;
