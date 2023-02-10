"use client";
import { Kweek } from "@prisma/client";
import { type NextPage } from "next";
import { useState } from "react";
import { CreateKweek } from "../components/shared/CreateKweek/CreateKweek";
import { KweekPost } from "../components/shared/KweekPost";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [kweeks, setKweeks] = useState<Kweek[]>([]);

  const { data: kweeksData, isLoading } = api.kweek.getAllKweeks.useQuery(
    {},
    {
      onSuccess(kweeksData: Kweek[]) {
        setKweeks(kweeksData);
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

      <CreateKweek setKweeks={setKweeks} />

      {kweeks.map((kweek) => (
        <KweekPost key={kweek.id} kweek={kweek} type={"feed"} />
      ))}
    </>
  );
};

export default Home;
