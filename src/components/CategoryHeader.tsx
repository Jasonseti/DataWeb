import { useState } from "react";

function CategoryStatistics({ selected_index }) {
  return (
    <div className="font-main font-semibold text-[1.2rem] text-text-white border-[2px] border-l-0 border-primary rounded-r-[12px] flex-auto px-[3%] py-[20px] bg-primary-shade">
      <p>Quantity: 856</p>
      <p>In Stock: 704</p>
      <p>Sold: 152</p>
      <p>Total Gold: 3829.33 g</p>
    </div>
  );
}

function CategoryTitle({ categories, selected_index, setSelected }) {
  const [is_folded, setFolded] = useState<boolean>(true);
  const toggleFolded = () => setFolded(!is_folded);

  return (
    <div className="w-[55%]">
      <div className="h-[200px] w-full bg-[url(img/bg-clouds.webp)] bg-cover bg-center rounded-l-[12px]" />
      <div className="relative left-[20px] bottom-[55px] text-text-main font-secondary font-semibold text-[1.2rem] w-[40%] min-w-[150px]">
        <div
          className="bg-white/90 bg rounded-md pl-[20px] py-[3px] cursor-pointer flex justify-between place-items-center-safe"
          onClick={toggleFolded}
        >
          {categories[selected_index]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            className="color-text-black"
          >
            <path d="M480-360 280-560h400L480-360Z" />
          </svg>
        </div>
        <div className="z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="white"
            className={
              (is_folded ? "hidden" : "") +
              " absolute right-[0px] bottom-[94px] rotate-180"
            }
          >
            <path d="M480-360 280-560h400L480-360Z" />
          </svg>
          <ul className="cursor-pointer rounded-md mt-[10px]">
            {categories.map((category: string, i: number) => (
              <li
                className={
                  (is_folded ? "hidden" : "") +
                  " relative z-50 pl-[20px] py-[3px] bg-white hover:bg-secondary-shade first:rounded-t-md last:rounded-b-md border-b-[1.5px] last:border-b-0"
                }
                onClick={() => {
                  setSelected(i);
                  toggleFolded();
                }}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CategoryHeader({ categories, selected_index, setSelected }) {
  return (
    <div className="shadow-[10px_20px_20px_10px_#00000040] rounded-[12px] m-auto max-w-[1000px] h-[200px] flex">
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
