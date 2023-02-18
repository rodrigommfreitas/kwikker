"use client";
import { useSession } from "next-auth/react";
import { SearchBar } from "../shared/SearchBar";
import { Trends } from "../shared/Trends/Trends";
import { Signup } from "./Signup";

export const SecondarySidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="ml-4 hidden w-[300px] lg:flex lg:flex-col xl:ml-8 xl:w-[350px]">
      <div className="sticky top-0 bg-black py-1">
        <SearchBar />
      </div>
      {!session && <Signup />}
      {session && <Trends />}
    </div>
  );
};
