/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type { Kweek } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CreateKweek } from "../components/shared/CreateKweek/CreateKweek";
import { KweekPost } from "../components/shared/KweekPost";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [forYouKweeks, setForYouKweeks] = useState<Kweek[]>([]);
  const [followingKweeks, setFollowingKweeks] = useState<Kweek[]>([]);
  const { data: session } = useSession();

  const { data: forYouKweeksData, isLoading } = api.kweek.getAllKweeks.useQuery(
    {},
    {
      onSuccess(forYouKweeksData: Kweek[]) {
        setForYouKweeks(forYouKweeksData);
      },
    }
  );

  const { data: followingKweeksData } = api.kweek.getFollowingKweeks.useQuery(
    { userId: session?.user?.id as string },
    {
      onSuccess(followingKweeksData: Kweek[]) {
        setFollowingKweeks(followingKweeksData);
      },
    }
  );

  return (
    <>
      <header className="sticky top-0 h-28 border-b border-gray-medium bg-black/50 backdrop-blur-md">
        <button className="flex h-1/2 w-full items-center pl-4 text-xl font-bold">
          Home
        </button>
        <div className="flex h-1/2 text-gray-light">
          <button
            onClick={() => setActiveTab("forYou")}
            className="flex w-full justify-center transition hover:bg-gray-medium/50"
          >
            <div
              className={` ${
                activeTab === "forYou"
                  ? "border-b-2 border-blue-light font-semibold text-white"
                  : "font-gray-light font-normal"
              } flex h-14 w-fit items-center`}
            >
              For you
            </div>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className="flex w-full justify-center transition hover:bg-gray-medium/50 "
          >
            <div
              className={` ${
                activeTab === "following"
                  ? "border-b-2 border-blue-light font-semibold text-white"
                  : "font-gray-light font-normal"
              } flex h-14 w-fit items-center`}
            >
              Following
            </div>
          </button>
        </div>
      </header>

      {session && (
        <CreateKweek
          setForYouKweeks={setForYouKweeks}
          setFollowingKweeks={setFollowingKweeks}
        />
      )}

      {activeTab === "forYou" ? (
        forYouKweeks.map((kweek) => (
          <KweekPost key={kweek.id} kweek={kweek} type={"feed"} />
        ))
      ) : session ? (
        followingKweeks.map((kweek) => (
          // TODO: Show rekweeked or liked by user
          <KweekPost key={kweek.id} kweek={kweek} type={"feed"} />
        ))
      ) : (
        <div className="text-center text-2xl font-bold">
          Follow some users to see their kweeks
        </div>
      )}
    </>
  );
};

export default Home;
