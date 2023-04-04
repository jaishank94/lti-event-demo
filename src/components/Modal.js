import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
// import DatePicker from "react-date-picker";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "@/context/AuthContext";

export default function Modal(props) {
  const { setOpenModal } = props;
  const [_document, set_document] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [type, setType] = useState("normal");
  const [tncChecked, setTncChecked] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo, currentUser } = useAuth();

  useEffect(() => {
    set_document(document);
  }, []);

  if (!_document) {
    return null;
  }

  async function handleAddEvent() {
    setError(null);

    if (!name || !description) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!price || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!tncChecked) {
      toast.error(
        "Please read and agree to our terms and conditions and privacy policy"
      );
      return;
    }

    const eventRef = collection(db, "events");
    const res = await addDoc(eventRef, {
      name,
      description,
      date: date.toString(),
      price,
      type,
      tncAgreed: tncChecked,
      createdBy: currentUser.uid,
      timestamp: serverTimestamp(),
    });

    toast.success("Successfully! Added the event");
    setOpenModal(false);
  }

  return ReactDom.createPortal(
    <div className="fixed inset-0 bg-white text-slate-900 text-lg sm:text-xl flex flex-col">
      <div className="flex items-center justify-between border-b border-solid border-slate-900 p-4">
        <h1 className="font-extrabold text-2xl sm:text-5xl select-none">
          Add New Event
        </h1>
        <i
          onClick={() => setOpenModal(false)}
          className="fa-solid fa-xmark duration-300 hover:rotate-90 text-lg sm:text-3xl cursor-pointer"
        ></i>
      </div>
      <div className="w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
        {error && (
          <div className="w-full max-w-[65ch] border-rose-400 border text-center border-solid text-rose-400 py-2">
            {error}
          </div>
        )}
        <div className="flex items-stretch mt-6">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxlength="50"
            className="border-b-2 border-zinc-200 p-3 text-base sm:text-lg text-slate-900 flex-1"
          />
        </div>
        <div className="flex items-stretch">
          <DatePicker
            onChange={(val) => setDate(val)}
            value={date}
            minDate={new Date()}
            className="border-b-2 border-zinc-200 p-3 bg-white text-base sm:text-lg text-slate-900 flex-1"
          />
        </div>
        <div className="flex items-stretch">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxlength="300"
            className="border-b-2 border-zinc-200 p-3 text-base sm:text-lg text-slate-900 flex-1"
            rows="2"
            cols="50"
          />
        </div>
        <div className="flex items-stretch">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border-b-2 border-zinc-200 p-3 text-base sm:text-lg text-slate-900 flex-1"
          />
        </div>
        <div className="flex items-stretch p-2 pb-0">
          <span className="text-lg">Booking Type</span>
        </div>
        <div className="flex items-stretch justify-center px-2">
          <label>Premium</label>
          <input
            type="radio"
            name="type"
            value={type}
            onClick={() => setType("premium")}
            className="p-0 text-base sm:text-lg text-slate-900 flex-1"
            checked={type === "premium" ? true : false}
          />

          <label>Normal</label>
          <input
            type="radio"
            name="type"
            value={type}
            onClick={() => setType("normal")}
            className="p-0 text-base sm:text-lg text-slate-900 flex-1"
            checked={type === "normal" ? true : false}
          />
        </div>
        <div className="flex items-stretch">
          <input
            type="checkbox"
            placeholder="T & C"
            value={tncChecked}
            onChange={() => setTncChecked(!tncChecked)}
            className="border-b-2 border-zinc-200 p-3 text-base sm:text-lg text-slate-900 flex-1"
          />
          <p>
            By continuing, you agree to our{" "}
            <a
              href="https://www.lipsum.com/"
              target="_blank"
              className="underline"
            >
              Terms of Service
            </a>{" "}
            and acknowledge our{" "}
            <a
              href="https://www.lipsum.com/"
              target="_blank"
              className="underline"
            >
              Privacy Policy{" "}
            </a>
          </p>
        </div>
        <div className="flex items-stretch">
          <button
            onClick={handleAddEvent}
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-70"
          >
            ADD
          </button>
        </div>
      </div>
    </div>,
    _document.getElementById("portal")
  );
}
