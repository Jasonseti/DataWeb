function CategoryStatistics({ selected_index }) {
  return (
    <div className="border-2 border-l-0 h-[200px] w-1/2 px-[5%] py-[10px]">
      <p>Quantity:</p>
      <p>Sold:</p>
      <p>Gold:</p>
      {selected_index}
    </div>
  );
}

function CategoryTitle({ categories, selected_index, setSelected }) {
  return (
    <div className="w-1/2 max-w-[600px]">
      <img src={"./img/bg-clouds.webp"} alt="" className="h-[200px] w-full" />
      <select
        name="categories"
        id="categories"
        className="bg-secondary/50 rounded-[10px] py-[1px] px-[10px] cursor-pointer text-[1.5rem] relative bottom-[60px] left-[20px] text-center z-10 active:outline-0"
        onChange={(e) => setSelected(e.target.value)}
      >
        {categories.map((category: string, i: number) => (
          <option value={i}>{category}</option>
        ))}
      </select>
    </div>
  );
}

function CategoryHeader({ categories, selected_index, setSelected }) {
  return (
    <div className="p-[20px] m-auto max-w-[1000px] h-[200px] w-full flex">
      <CategoryTitle
        categories={categories}
        selected_index={selected_index}
        setSelected={setSelected}
      />
      <CategoryStatistics selected_index={selected_index} />
    </div>
  );
}

export default CategoryHeader;
