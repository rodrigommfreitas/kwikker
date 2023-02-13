"use client";
import { useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MoreMenu } from "./MoreMenu";

type Props = {
  location: string;
  trend: string;
  kweeks: string;
  last?: boolean;
};

export const Trend = ({ location, trend, kweeks, last }: Props) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <button
      className={`${
        last ? "rounded-b-3xl pb-4" : "rounded-none"
      } flex w-full justify-between overflow-hidden py-2 pl-4 pr-3 text-left transition-all duration-200 hover:bg-gray-medium`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-light">Trending in {location}</span>
        <span className="font-bold">{trend}</span>
        <span className="text-sm text-gray-light">{kweeks} Kweeks</span>
      </div>

      {showMore ? (
        <MoreMenu setShowMore={setShowMore} />
      ) : (
        <button
          onClick={() => {
            setShowMore(true);
          }}
          className="h-fit w-fit rounded-full p-2 text-gray-light transition hover:bg-blue-light/20 hover:text-blue-light active:bg-blue-light/30"
        >
          <BiDotsHorizontalRounded size={"1.125em"} />
        </button>
      )}
    </button>
  );
};
