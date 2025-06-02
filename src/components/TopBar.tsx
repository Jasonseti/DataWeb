function TopBar() {
  return (
    <div className="w-full h-[70px] mb-[12px] px-[40px] bg-primary flex justify-between place-items-center-safe">
      <div className="text-[4vw] lg:text-[40px] text-text-main font-main font-bold">
        MATAHARI JEWELRY
      </div>

      <button className="cursor-pointer bg-accent hover:bg-accent-shade transition-all duration-150 rounded-[100px] px-5 py-2">
        <div className="flex flex-wrap font-secondary font-bold place-items-center-safe">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            className="fill-text-main"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
          </svg>
          <p className="text-[1rem] text-text-main">Logout</p>
        </div>
      </button>
    </div>
  );
}

export default TopBar;
