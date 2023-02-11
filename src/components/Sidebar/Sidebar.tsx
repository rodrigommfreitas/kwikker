"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BiPencil } from "react-icons/bi";
import { Nav } from "./Nav";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export const Sidebar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 mx-1 flex h-screen flex-col items-center xl:mx-6 xl:items-baseline">
      <Nav />
      {session && (
        <>
          <button className="mt-4 rounded-full bg-blue-light p-3 font-bold transition hover:bg-blue-light/90 xl:px-24 xl:py-[14px]">
            <i className="flex h-fit w-fit xl:hidden">
              <BiPencil size={"1.5em"} />
            </i>
            <span className="hidden xl:flex">Kweek</span>
          </button>

          {showUserMenu && <UserMenu setShowUserMenu={setShowUserMenu} />}
          <button
            disabled={showUserMenu}
            onClick={
              showUserMenu
                ? () => setShowUserMenu(false)
                : () => setShowUserMenu(true)
            }
            className="absolute bottom-4 flex shrink-0 items-center justify-between gap-0 rounded-full p-1 text-lg transition hover:bg-gray-dark xl:w-full xl:p-3"
          >
            <div className="flex gap-2">
              <Image
                width={40}
                height={40}
                src={session.user.image as string}
                alt="user img"
                className="h-10 min-h-[10px] w-10 min-w-[10px] rounded-full"
              />
              <div className="hidden text-left text-sm xl:block">
                <div className="font-bold">{session.user.name}</div>
                <div className="font-light text-gray-light">
                  @{session.user.id.substring(0, 12)}...
                </div>
              </div>
            </div>
            <BiDotsHorizontalRounded
              size={"1.125em"}
              className="hidden xl:block"
            />
          </button>
        </>
      )}
    </div>
  );
};
