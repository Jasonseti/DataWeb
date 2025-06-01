function TopBar() {
  return (
    <div className="px-[40px] bg-accent flex justify-between items-center-safe w-full h-[75px]">
      <div className="text-[2rem] font-bold">MATAHARI JEWELLRY</div>
      <div className="font-main font-bold">
        <button className="cursor-pointer bg-secondary rounded-md px-4 py-2">
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopBar;
