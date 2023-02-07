/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { type User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "../../../utils/api";
import {
  BiCalendar,
  BiEnvelope,
  BiDotsHorizontalRounded,
  BiLeftArrowAlt,
} from "react-icons/bi";

// May need to review image and banner z index
// Make image and banner responsive
// Add location UI

const Profile: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"kweeks" | "replies" | "likes">(
    "kweeks"
  );
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const userId = usePathname()?.slice(9);
  const { data: session } = useSession();

  const { data: userData, isLoading } = api.user.getUser.useQuery(
    { id: userId as string },
    {
      onSuccess(profileUser: User) {
        setUser(profileUser);
      },
      onError() {
        setUserNotFound(true);
      },
    }
  );

  if (userNotFound) return <div>User not found</div>;

  return (
    <>
      <header className="sticky top-0 flex h-14 items-center gap-8 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="ml-2 flex h-fit w-fit items-center justify-center rounded-full p-2 text-xl font-bold transition hover:bg-gray-dark active:bg-gray-medium"
        >
          <BiLeftArrowAlt />
        </button>
        <div>
          <div className="text-xl font-black">
            {!userData || isLoading ? "Loading profile..." : user?.name}
          </div>
          <div className="font-sm text-sm text-gray-light">12 tweets</div>
        </div>
      </header>

      {user && (
        <>
          <div className="relative z-10 h-48 w-full cursor-pointer bg-blue-light"></div>

          <div className="mx-4">
            <div className="relative -top-16 flex max-h-32 justify-between">
              <Image
                src={user.image as string}
                alt="user image"
                width={128}
                height={128}
                className="z-20 cursor-pointer rounded-full border-2 border-black transition hover:brightness-90"
              />
              {session?.user.id === userId ? (
                <button className="mb-3 h-9 self-end rounded-full border border-gray-light px-4 text-sm font-semibold tracking-wide transition hover:bg-gray-dark">
                  Edit profile
                </button>
              ) : (
                <div className="mb-3 flex h-9 items-center gap-2 self-end">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-light transition hover:bg-gray-dark active:bg-gray-medium">
                    <BiDotsHorizontalRounded size={"1.25em"} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-light transition hover:bg-gray-dark active:bg-gray-medium">
                    <BiEnvelope size={"1.25em"} />
                  </button>
                  <button className="h-9 rounded-full bg-white px-4 text-sm font-semibold tracking-wide text-black transition hover:bg-white/80 active:bg-white/60">
                    Follow
                  </button>
                </div>
              )}
            </div>

            <div className="relative -top-16 flex flex-col gap-3 py-4">
              <div>
                <div className="text-xl font-black">{user?.name}</div>
                <div className="text-sm text-gray-light">@{user?.id}</div>
              </div>

              {user.description && <div>{user.description}</div>}

              <div className="flex items-center gap-1 text-sm text-gray-light">
                <BiCalendar size={"1.25em"} />
                <div>
                  Joined in{" "}
                  {user.createdAt.toLocaleString("default", { month: "long" })}{" "}
                  {user.createdAt.getFullYear()}
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="hover:cursor-pointer hover:underline">
                  <span className="font-bold">759</span>
                  <span className="ml-1 text-gray-light">Following</span>
                </div>
                <div className="hover:cursor-pointer hover:underline">
                  <span className="font-bold">243</span>
                  <span className="ml-1 text-gray-light">Followers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -top-14 flex h-14 max-h-14 w-full border-b border-gray-medium text-sm text-gray-light sm:text-base">
            <button
              onClick={() => setActiveTab("kweeks")}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "kweeks"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Kweeks
              </div>
            </button>
            <button
              onClick={() => setActiveTab("replies")}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "replies"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Kweeks and replies
              </div>
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "likes"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Likes
              </div>
            </button>
          </div>
          <div className="relative -top-14">hey</div>
        </>
      )}
    </>
  );
};

export default Profile;
