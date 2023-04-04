import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteField, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import useFetchEvents from "../hooks/fetchEvents";
import Modal from "./Modal";
import EditModal from "./EditModal";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edittedValue, setEdittedValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setEditOpenModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const { events, basePrice, setEvents, loading, error } = useFetchEvents();

  function handleDelete(id) {
    return async () => {
      await deleteDoc(doc(db, "events", id));
    };
  }

  return (
    <>
      {openModal && <Modal setOpenModal={setOpenModal} />}
      {openEditModal && (
        <EditModal setOpenModal={setEditOpenModal} editEvent={editEvent} />
      )}
      <div className="w-full text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
        <div className="w-full flex justify-center items-center">
          <p className="text-xl">
            Do you want to list an event?{" "}
            <span
              onClick={() => setOpenModal(true)}
              className="w-full px-2 py-1 cursor-pointer bg-amber-400 text-white font-medium text-sm duration-300 hover:opacity-40"
            >
              Add New Event
            </span>
          </p>
        </div>
        {loading && (
          <div className="flex-1  place-items-center">
            <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
          </div>
        )}
        {!loading && (
          <>
            <span className="px-5 text-lg">Total Base Price: {basePrice}</span>
            <div className="px-5 my-10 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap justify-center">
              {events && events.length
                ? events.map((v, key) => {
                    return (
                      <div
                        key={key}
                        className="justify-center cursor-pointer transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50 m-2 "
                      >
                        <div className="block max-w-sm rounded-lg bg-white text-center shadow-lg dark:bg-neutral-700">
                          {v.type !== "normal" && (
                            <div className="border-b-2 rounded-b-2 py-3  px-6 bg-red-600 dark:border-neutral-600 text-yellow-500 text-lg dark:text-zinc-800">
                              Premium{" "}
                              <i className="fa-solid fa-crown text-red"></i>
                            </div>
                          )}
                          <div className="p-6">
                            <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                              {v.name}
                            </h5>
                            <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                              {v.description}
                            </p>
                            <button
                              type="button"
                              className="inline-block rounded bg-blue-400 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                            >
                              Price: {v.price}
                            </button>
                          </div>
                          <div className="border-t-2 border-neutral-100 py-3 px-6 dark:border-neutral-600 text-zinc-800 dark:text-zinc-800">
                            {new Date(v.date).toDateString()}
                          </div>
                          {currentUser.uid === v.createdBy && (
                            <div className="border-t-2 border-neutral-100 py-3 px-6 dark:border-neutral-600 text-zinc-800 dark:text-zinc-800">
                              <i
                                onClick={() => {
                                  setEditEvent(v);
                                  setEditOpenModal(true);
                                }}
                                className="fa-solid fa-pencil px-2 text-zinc-600 duration-300 hover:rotate-45 cursor-pointer"
                              ></i>
                              <i
                                onClick={handleDelete(v.id)}
                                className="fa-solid fa-trash-can px-2 text-zinc-600 duration-300 hover:scale-125 cursor-pointer"
                              ></i>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </>
        )}
      </div>
      z
    </>
  );
}
