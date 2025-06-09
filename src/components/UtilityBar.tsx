import { ModalAdd, ModalEdit, ModalDelete } from "./ModalForms.tsx";
import { useState } from "react";

function SearchBar({ search_value, setSearch }) {
  return (
    <div
      className="h-full w-full lg:w-1/4 lg:focus-within:w-1/3 max-w-[800px] 
      transition-[width] duration-400 ease 
      flex place-items-center-safe"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="30px"
        viewBox="0 -960 960 960"
        width="40px"
        className="pl-[10px] absolute fill-text-black opacity-80"
      >
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>

      <input
        type="text"
        placeholder="Search..."
        className="shadow-[5px_10px_10px_5px_#00000024] font-secondary bg-white w-full h-full pl-[50px] border-[1.5px] border-black rounded-[8px] focus:outline-[1px]"
        value={search_value}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function FunctionBar({ title, icon, func }) {
  return (
    <div
      onClick={func}
      className="px-[1vw] sm:flex h-full bg-accent hover:bg-accent-shade active:bg-gray-500 transition duration-75 ease border-l-[1.5px] first:border-l-0 first:rounded-l-[10px] last:rounded-r-[10px] place-items-center"
    >
      <div className="mr-[2px] fill-text-black">{icon}</div>
      <p className="font-secondary text-text-black">{title}</p>
    </div>
  );
}

const icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
  >
    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
  >
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
  >
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
  </svg>,

  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
  >
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
  >
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
  </svg>,
];
function useToggle(value: boolean) {
  const [state, setState] = useState(value);
  const toggleState = () => setState(!state);
  return [state, toggleState];
}
function UtilityBar({
  data_items,
  checked,
  setChecked,
  search_value,
  setSearch,
  update,
}) {
  const [is_openAdd, toggleModalAdd] = useToggle(false);
  const [is_openEdit, toggleModalEdit] = useToggle(false);
  const [is_openDelete, toggleModalDelete] = useToggle(false);

  return (
    <div className="mb-[67px] lg:mb-[17px] mt-[30px]">
      <div className="h-[40px] lg:flex lg:flex-row max-w-[1000px] m-auto">
        <SearchBar search_value={search_value} setSearch={setSearch} />
        <div className="my-[15px] lg:my-[2.5px] h-[48px] sm:h-[35px] lg:flex-auto flex justify-evenly">
          <div className="bar-group">
            <FunctionBar
              title={"Reload"}
              icon={icons[0]}
              func={() => update()}
            />
          </div>
          <div className="bar-group">
            <ModalAdd
              is_open={is_openAdd}
              closeModal={toggleModalAdd}
              update={update}
            />
            <FunctionBar title={"Add"} icon={icons[1]} func={toggleModalAdd} />
            <ModalEdit
              is_open={is_openEdit}
              closeModal={toggleModalEdit}
              data_items={data_items}
              checked={checked}
              update={update}
            />
            <FunctionBar
              title={"Edit"}
              icon={icons[2]}
              func={toggleModalEdit}
            />
          </div>
          <div className="bar-group">
            <ModalDelete
              is_open={is_openDelete}
              closeModal={toggleModalDelete}
              data_items={data_items}
              checked={checked}
              update={update}
            />
            <FunctionBar
              title={"Delete"}
              icon={icons[3]}
              func={toggleModalDelete}
            />
            <FunctionBar
              title={"Select All"}
              icon={icons[4]}
              func={() => {
                if (checked.indexOf(false) === -1) {
                  setChecked(Array(checked.length).fill(false));
                } else {
                  setChecked(Array(checked.length).fill(true));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
