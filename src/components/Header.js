import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { logout, currentUser } = useAuth();

  return (
    <>
      <div className="top-0 w-full left-0 bg-inherit flex items-center justify-between p-4 border-b border-solid border-white z-99">
        <h1 className="text-3xl select-none sm:text-6xl">Events</h1>
        {/* <i onClick={() => setOpenModal(true)} className="fa-solid fa-user text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"></i> */}
        {currentUser && (
          <>
            <span className="text-xl">
              Hello!{" "}
              {currentUser.displayName && currentUser.displayName !== ""
                ? currentUser.displayName
                : "there"}
            </span>
            <i
              onClick={() => logout()}
              className="fa-solid fa-right-from-bracket text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"
            ></i>
          </>
        )}
      </div>
    </>
  );
}
