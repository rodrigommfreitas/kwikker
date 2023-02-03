"use client";
import { useSession } from "next-auth/react";
import { Signup } from "./Signup";

export const SecondarySidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="ml-4 hidden w-[300px] lg:flex lg:flex-col xl:ml-8 xl:w-[350px]">
      {!session && <Signup />}
    </div>
  );
};
