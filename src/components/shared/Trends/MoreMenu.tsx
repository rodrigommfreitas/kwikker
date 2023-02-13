"use client";
import { useRef } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { ImSad } from "react-icons/im";

type Props = {
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MoreMenu = ({ setShowMore }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    setShowMore(false);
  });

  return (
    <div
      ref={ref}
      className="absolute rounded-lg border border-gray-medium bg-black font-medium shadow-lg shadow-gray-light/30 md:-translate-x-6 xl:translate-x-6"
    >
      <button className="flex w-max items-center gap-4 px-4 py-2">
        <ImSad size={"1em"} />
        <span>Not interested in this</span>
      </button>
      <button className="flex w-max items-center gap-4 px-4 py-2">
        <ImSad size={"1em"} />
        <span>This trend is harmful or spammy</span>
      </button>
    </div>
  );
};
