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
    borderRadius: "10%",
    padding: "4%",
    paddingTop: "3%",
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
    <label className="w-auto" htmlFor={name}>
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

function ModalAdd({ is_open, closeModal, update }) {
  const [state, setState] = useState<string[]>(["", "Gold", "", "", ""]);
  const resetState = () => setState(["", "Gold", "", "", ""]);
  const postData = async () => {
    const fetchID = async () => {
      return axios.get("/api/items/id").then((results) => {
        return results.data.ID;
      });
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
        };
        return document;
      })
      .then((document) => axios.post("/api/items", document));
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
      <form className="w-[220px] mt-2 flex flex-col">
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
        <InputText
          name={"stones"}
          index={4}
          state={state}
          setState={setState}
          placeholder={"Stones . . ."}
        />
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
          onClick={() => postData()}
          className="cursor-pointer rounded-[5px] bg-accent p-[7.5px] my-[5px]"
        />
      </form>
    </Modal>
  );
}

function ModalEdit({ is_open, closeModal, data_items, checked, update }) {
  const [state, setState] = useState<string[]>(["", "", "", "", "", ""]);
  useEffect(() => {
    if (is_open) {
      if (checked.indexOf(true) !== -1) {
        let new_state = data_items[checked.indexOf(true)].slice(1);
        new_state[5] = new_state[5].slice(0, 10);
        setState(new_state);
      } else {
        closeModal();
      }
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
          onClick={() => updateData()}
          className="cursor-pointer rounded-[5px] bg-accent p-[7.5px] my-[5px]"
        />
      </form>
    </Modal>
  );
}

function ModalDelete({ is_open, closeModal, data_items, checked, update }) {
  // useEffect(() => {
  //   if (is_open) {
  //     if (checked.indexOf(true) !== -1) {
  //     } else {
  //       closeModal();
  //     }
  //   }
  // }, [is_open]);
  const deleteData = async () => {
    let ids = Array.from(Array(checked.length).keys())
      .filter((i) => checked[i] === true)
      .map((i) => data_items[i][0]);
    for (let id of ids) {
      let url = "/api/items/" + id;
      axios.delete(url);
    }
    await update();
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
          <Button value={"Delete"} bg={"bg-red-400"} onClick={deleteData} />
          <Button value={"Cancel"} bg={"bg-gray-400"} onClick={closeModal} />
        </div>
      </div>
    </Modal>
  );
}
export { ModalAdd, ModalEdit, ModalDelete };
