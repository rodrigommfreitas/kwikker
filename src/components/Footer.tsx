"use client";
import { useSession } from "next-auth/react";

export const Footer = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <footer className="fixed bottom-0 flex h-[72px] w-full items-center bg-blue-light ">
        <div className="m-auto flex items-center justify-between gap-4 sm:gap-8 md:gap-32 lg:gap-64">
          <div className="flex flex-col text-white">
            <span className="hidden font-bold sm:flex md:text-2xl">
              Don{"'"}t miss what{"'"}s happening
            </span>
            <span className="hidden text-sm sm:flex">
              People on Kwikker are the first to know.
            </span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <button className="w-max rounded-full border-[1px] border-gray-300 px-8 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:px-4 md:text-sm">
              Log in
            </button>
            <button className="w-max rounded-full border-[1px] bg-white px-8 py-2 text-xs font-bold text-black transition hover:bg-gray-200 sm:px-4 md:text-sm">
              Sign up
            </button>
          </div>
        </div>
      </footer>
    );
  }
  return <footer className="hidden"></footer>;
};
