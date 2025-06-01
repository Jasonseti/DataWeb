function SearchBar({ search_value, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="px-5 border-[1.5px] border-black/80 rounded-[5px] h-full w-1/3 m-auto max-w-[400px] bg-secondary"
      value={search_value}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

function UtilityBar({ search_value, setSearch }) {
  return (
    <div className="m-[20px] mt-[50px]">
      <div className="h-[40px] flex flex-row m-auto max-w-[1000px]">
        <SearchBar search_value={search_value} setSearch={setSearch} />
        <div className="utility-list">Reload</div>
        <div className="utility-list">Add</div>
        <div className="utility-list">Edit</div>
        <div className="utility-list">Remove</div>
        <div className="utility-list">View</div>
      </div>
    </div>
  );
}

export default UtilityBar;
