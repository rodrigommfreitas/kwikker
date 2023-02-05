"use client";
import { useSession } from "next-auth/react";
import { BiPencil } from "react-icons/bi";
import { Nav } from "./Nav";

export const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 mx-1 flex h-screen flex-col items-center xl:mx-6 xl:items-baseline">
      <Nav />
      {session && (
        <button className="mt-4 rounded-full bg-blue-light p-3 font-bold transition hover:bg-blue-light/90 xl:px-24 xl:py-[14px]">
          <i className="flex h-fit w-fit xl:hidden">
            <BiPencil size={"1.5em"} />
          </i>
          <span className="hidden xl:flex">Kweek</span>
        </button>
      )}
    </div>
  );
};
