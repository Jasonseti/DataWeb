import { useState, useEffect } from "react";
import axios from "axios";

function CategoryStatistics({ categories, selected_category }) {
  const [statistics, setStatistics] = useState<string[][]>([[]]);
  useEffect(() => {
    axios
      .get("/api/statistics")
      .then((results) => results.data)
      .then((results) => {
        results = results.map((result: string[][]) =>
          Object.values(result)
            .slice(1)
            .toString()
            .split(",")
            .map((value) => Number(value))
        );
        results = [
          results.reduce((a, b) => a.map((_, i) => a[i] + b[i])),
          ...results,
        ];
        setStatistics(results);
      });
  }, [categories]);

  return (
    <div className="font-main font-semibold text-[1.2rem] text-text-white border-[2px] border-l-0 border-primary rounded-r-[12px] flex-auto px-[3%] py-[20px] bg-primary">
      <p>
        In Stock:{" "}
        {Number(statistics[selected_category][0]) -
          Number(statistics[selected_category][2])}
      </p>
      <p>Sold: {statistics[selected_category][2]}</p>
      <p>Total Gold: {statistics[selected_category][1]} grams</p>
    </div>
  );
}

function CategoryTitle({ categories, selected_category, setCategory, update }) {
  const [is_folded, setFolded] = useState<boolean>(true);
  const toggleFolded = () => setFolded(!is_folded);

  return (
    <div className="w-[55%]">
      <div className="h-[200px] w-full bg-[url(images/wallpaper.png)] bg-cover bg-center rounded-l-[12px]" />
      <div className="relative left-[20px] bottom-[55px] text-text-main font-secondary font-semibold text-[1.2rem] w-[40%] min-w-[150px]">
        <div
          className="bg-white/90 bg rounded-md pl-[20px] py-[3px] cursor-pointer flex justify-between place-items-center-safe"
          onClick={toggleFolded}
        >
          {categories[selected_category]}
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
                  setCategory(i);
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

function CategoryHeader({
  categories,
  selected_category,
  setCategory,
  update,
}) {
  return (
    <div className="shadow-[10px_20px_20px_10px_#00000040] rounded-[12px] m-auto max-w-[1000px] h-[200px] flex">
      <CategoryTitle
        categories={categories}
        selected_category={selected_category}
        setCategory={setCategory}
        update={update}
      />
      <CategoryStatistics
        categories={categories}
        selected_category={selected_category}
      />
    </div>
  );
}

export default CategoryHeader;
