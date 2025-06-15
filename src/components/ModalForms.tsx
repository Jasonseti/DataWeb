import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const modal_styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "2rem",
    padding: "3rem",
    paddingTop: "2.2rem",
  },
};

function InputText({ name, index, state, setState, placeholder }) {
  return (
    <label className="w-auto" htmlFor={name}>
      <input
        name={name}
        id={name}
        className="w-full border-[1.5px] border-black/70 p-[5px] pl-[12px] my-[5px] rounded-[5px]"
        type="text"
        value={state[index]}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) =>
          setState(state.slice().toSpliced(index, 1, e.target.value))
        }
      />
    </label>
  );
}

function InputSelect({ name, index, state, setState, selections }) {
  return (
    <label className="flex-auto" htmlFor={name}>
      <select
        name={name}
        id={name}
        className="w-full border-[1.5px] border-black/70 p-[5px] pl-[12px] my-[5px] rounded-[5px]"
        onChange={(e) =>
          setState(state.slice().toSpliced(index, 1, e.target.value))
        }
      >
        {selections.map((value: string) => (
          <option selected={state[index] === value.toLowerCase()} value={value}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputDate({ name, index, state, setState }) {
  return (
    <label className="w-auto" htmlFor={name}>
      <input
        name={name}
        id={name}
        className="w-full border-[1.5px] border-black/70 p-[5px] pl-[12px] my-[5px] rounded-[5px]"
        type="date"
        value={state[index]}
        onChange={(e) =>
          setState(state.slice().toSpliced(index, 1, e.target.value))
        }
      />
    </label>
  );
}

// function validateInput(state) {}

function FormHeader({ title, closeModal }) {
  return (
    <div className="flex justify-between -m-[2px]">
      <h2 className="font-main font-bold text-[24px]">{title}</h2>
      <button
        className="fill-black cursor-pointer hover:bg-accent-shade p-[1vw] rounded-[1vw]"
        onClick={closeModal}
      >
        <img src="./icons/close.svg" alt="close" />
      </button>
    </div>
  );
}

function ModalAdd({
  is_open,
  closeModal,
  categories,
  selected_category,
  setTranscript,
  update,
}) {
  const [selected_image, setImage] = useState<any>(null);
  const postImage = () => {
    var document = new FormData();
    document.append("image", selected_image);
    axios
      .post("http://localhost:8000/api/read_image", document)
      .then((result) => result.data.transcript)
      .then((transcript) => alert(transcript));
  };
  const initial_state = [
    "",
    "Gold",
    "",
    "",
    "",
    selected_category ? categories[selected_category] : "",
  ];
  const [state, setState] = useState<string[]>(initial_state);
  const postData = () => {
    const fetchID = async () => {
      return axios.get("/api/items/id").then((results) => results.data.ID);
    };
    fetchID()
      .then((nextID: number) => {
        let document = {
          ID: Number(nextID + 1),
          name: state[0],
          color: state[1].toLowerCase(),
          weight: Number(state[2]),
          purity: Number(state[3]),
          stones: state[4].toLowerCase(),
          date_sold: null,
          category: selected_category
            ? categories[selected_category].toLowerCase()
            : null,
        };
        return document;
      })
      .then((document) => axios.post("/api/items", document))
      .then(() => update());
  };
  const resetState = () => {
    setState(initial_state);
    setImage(null);
  };

  return (
    <Modal
      isOpen={is_open}
      onRequestClose={closeModal}
      contentLabel="Add Form"
      style={modal_styles}
    >
      <FormHeader title={"Add Item"} closeModal={closeModal} />
      {/* Add Form */}
      <form className="w-[220px] relative">
        <h3 className="text-main font-semibold text-[1.2rem]">Upload Image</h3>
        <div className="flex flex-col justify-center p-[5px] mt-[5px] w-full h-[100px] border-1 border-dashed rounded-[2px] cursor-pointer bg-gray-300">
          <img
            className={
              (!selected_image && "opacity-50 scale-75 h-[100%]") +
              " object-contain h-[80%]"
            }
            alt=""
            src={
              selected_image
                ? URL.createObjectURL(selected_image)
                : "/icons/photo.svg"
            }
          />
          <p className="h-[20%] mb-[3px] text-center">
            {selected_image && selected_image.name}
          </p>
        </div>
        <input
          type="file"
          name="image_file"
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
          className="absolute top-[28px] left-[0px] mt-[5px] opacity-0 w-full h-[100px] cursor-pointer bg-accent"
        />
        <input
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            postImage();
            closeModal();
            resetState();
          }}
          className="w-full cursor-pointer rounded-[5px] bg-accent p-[7.5px] my-[5px]"
        />
      </form>
      <form className="w-[220px] mt-2 flex flex-col">
        <h3 className="text-main font-semibold text-[1.2rem]">
          Input Manually
        </h3>
        {selected_category === 0 && (
          <div className="flex justify-between">
            <div className="m-auto text-center text-[18px] w-[90px]">
              Category:
            </div>
            <InputSelect
              name="category"
              index={5}
              state={state}
              setState={setState}
              selections={categories}
            />
          </div>
        )}
        <InputText
          name={"name"}
          index={0}
          state={state}
          setState={setState}
          placeholder={"Item Name . . ."}
        />
        <div className="flex justify-between">
          <div className="text-center m-auto text-[18px] w-[100px]">Color:</div>
          <InputSelect
            name="color"
            index={1}
            state={state}
            setState={setState}
            selections={["Gold", "Whitegold", "Rosegold", "Silver"]}
          />
        </div>
        <div className="flex justify-between">
          <InputText
            name={"weight"}
            index={2}
            state={state}
            setState={setState}
            placeholder={"Weight . . ."}
          />
          <div className="text-center m-auto text-[18px] w-[100px]">grams</div>
        </div>
        <div className="flex justify-between">
          <InputText
            name={"purity"}
            index={3}
            state={state}
            setState={setState}
            placeholder={"Purity . . ."}
          />
          <div className="text-center m-auto text-[18px] w-[100px]">%</div>
        </div>
        <div className="flex justify-between">
          <div className="m-auto text-center text-[18px] w-[100px]">
            Stones:{" "}
          </div>
          <InputText
            name={"stones"}
            index={4}
            state={state}
            setState={setState}
            placeholder={"Stones . . ."}
          />
        </div>
        <input
          type="submit"
          value="Reset"
          onClick={(e) => {
            e.preventDefault();
            resetState();
          }}
          className="cursor-pointer rounded-[5px] bg-accent-shade p-[4px] my-[5px]"
        />
        <input
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            postData();
            closeModal();
            resetState();
          }}
          className="cursor-pointer rounded-[5px] bg-accent p-[7.5px] my-[5px]"
        />
      </form>
    </Modal>
  );
}

function ModalEdit({
  is_open,
  closeModal,
  data_items,
  categories,
  selected_category,
  checked,
  update,
}) {
  const [state, setState] = useState<string[]>(["", "", "", "", "", "", ""]);
  useEffect(() => {
    if (checked.indexOf(true) !== -1) {
      let new_state = data_items[checked.indexOf(true)].slice(1);
      new_state[5] = new_state[5].slice(0, 10);
      new_state[6] = categories[selected_category];
      setState(new_state);
    }
  }, [is_open]);
  const updateData = async () => {
    let document = {
      ID: Number(data_items[checked.indexOf(true)][0]),
      name: state[0],
      color: state[1].toLowerCase(),
      weight: Number(state[2]),
      purity: Number(state[3]),
      stones: state[4].toLowerCase(),
      date_sold: new Date(state[5]),
      category: state[6].toLowerCase(),
    };
    axios.put("/api/items", document).then(() => update());
  };
  return (
    <Modal
      isOpen={is_open}
      onRequestClose={closeModal}
      contentLabel="Edit Form"
      style={modal_styles}
    >
      <FormHeader title={"Edit Item"} closeModal={closeModal} />
      {/* Edit Form */}
      <form className="w-[220px] mt-2 flex flex-col">
        {selected_category === 0 && (
          <div className="flex justify-between">
            <div className="m-auto text-center text-[18px] w-[90px]">
              Category:
            </div>
            <InputSelect
              name="category"
              index={6}
              state={state}
              setState={setState}
              selections={categories}
            />
          </div>
        )}
        <InputText
          name={"name"}
          index={0}
          state={state}
          setState={setState}
          placeholder={"Item Name . . ."}
        />
        <div className="flex justify-between">
          <div className="text-center m-auto text-[18px] w-[100px]">Color:</div>
          <InputSelect
            name="color"
            index={1}
            state={state}
            setState={setState}
            selections={["Gold", "Whitegold", "Rosegold", "Silver"]}
          />
        </div>
        <div className="flex justify-between">
          <InputText
            name={"weight"}
            index={2}
            state={state}
            setState={setState}
            placeholder={"Weight . . ."}
          />{" "}
          <div className="text-center m-auto text-[18px] w-[100px]">grams</div>
        </div>
        <div className="flex justify-between">
          <InputText
            name={"purity"}
            index={3}
            state={state}
            setState={setState}
            placeholder={"Purity . . ."}
          />{" "}
          <div className="text-center m-auto text-[18px] w-[100px]">%</div>
        </div>
        <InputText
          name={"stones"}
          index={4}
          state={state}
          setState={setState}
          placeholder={"Stones . . ."}
        />
        <InputDate
          name={"date_sold"}
          index={5}
          state={state}
          setState={setState}
        />
        <input
          type="submit"
          value="Cancel"
          onClick={closeModal}
          className="cursor-pointer rounded-[5px] bg-accent-shade p-[4px] my-[5px]"
        />
        <input
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            updateData();
            closeModal();
          }}
          className="cursor-pointer rounded-[5px] bg-accent p-[7.5px] my-[5px]"
        />
      </form>
    </Modal>
  );
}

function ModalDelete({ is_open, closeModal, data_items, checked, update }) {
  const deleteData = async () => {
    let ids = Array.from(Array(checked.length).keys())
      .filter((i) => checked[i] === true)
      .map((i) => data_items[i][0]);
    for await (let id of ids) {
      let url = "/api/items/" + id;
      axios.delete(url);
    }
    update();
  };

  const Button = ({ value, bg, onClick }) => (
    <button
      onClick={onClick}
      className={`${bg} cursor-pointer w-[150px] h-[60px] rounded-[20px] mx-[20px]`}
    >
      {value}
    </button>
  );

  return (
    <Modal
      isOpen={is_open}
      onRequestClose={closeModal}
      contentLabel="Delete Confirmation"
      style={modal_styles}
    >
      <div>
        <h2 className="font-main font-bold text-[25px] text-center">{`Are you sure you want to delete?`}</h2>
        <div className="flex justify-around mt-[20px]">
          <Button
            value={"Delete"}
            bg={"bg-red-400"}
            onClick={() => {
              deleteData();
              closeModal();
            }}
          />
          <Button value={"Cancel"} bg={"bg-gray-400"} onClick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}
export { ModalAdd, ModalEdit, ModalDelete };
