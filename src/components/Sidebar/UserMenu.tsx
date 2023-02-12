/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRef } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";

type Props = {
  setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserMenu = ({ setShowUserMenu }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useOnClickOutside(ref, () => setShowUserMenu(false));

  return (
    <div
      ref={ref}
      className="absolute bottom-[72px] items-center rounded-xl font-semibold xl:bottom-24 xl:border xl:border-gray-medium xl:bg-black xl:py-3 xl:shadow-sm xl:shadow-white/25"
    >
      <div className="flex flex-col gap-2 xl:hidden">
        <button className="rounded-full bg-gray-dark p-2">
          <AiOutlineUserAdd size={"1.5em"} />
        </button>
        <button
          onClick={() => signOut()}
          className="rounded-full bg-gray-dark p-2"
        >
          <FiLogOut size={"1.5em"} />
        </button>
      </div>

      <div className="hidden text-white/80 xl:block">
        <button className="w-full border-t border-gray-medium py-2 pl-4 text-left transition hover:bg-gray-dark">
          Add an existing account
        </button>
        <button
          onClick={() => signOut()}
          className="w-full py-2 pl-4 text-left transition hover:bg-gray-dark"
        >
          Leave {session?.user.name}
        </button>
      </div>
    </div>
  );
};
