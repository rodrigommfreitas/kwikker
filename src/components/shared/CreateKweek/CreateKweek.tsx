"use client";
import { useState } from "react";
import { KweekUtils } from "./KweekUtils";
import { AiOutlineDown } from "react-icons/ai";
import { BiWorld } from "react-icons/bi";

export const CreateKweek = () => {
  const [hasFocused, setHasFocused] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleFocus = () => {
    setHasFocused(true);
  };

  return (
    <div className="flex gap-4 border-b border-gray-medium px-4 pb-1 pt-2">
      <a href="#">
        <div
          id="img"
          className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] rounded-full bg-white"
        ></div>
      </a>
      <div className="w-full">
        {hasFocused && (
          <button className="mb-2 flex items-center gap-1 rounded-full border border-gray-light px-3 text-sm font-semibold text-blue-primary">
            <span>Everyone</span>
            <AiOutlineDown />
          </button>
        )}
        <textarea
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's happening?"
          onFocus={handleFocus}
          className="min-h-12 h-12 w-full resize-none overflow-hidden bg-black py-3 text-xl tracking-wide outline-none"
        />

        {hasFocused && (
          <button className="mt-1 mb-2 flex items-center gap-1 rounded-full px-3 text-blue-primary hover:bg-blue-light/10 active:bg-blue-light/50">
            <BiWorld height="1.25em" width="1.25em" />
            <span className="text-sm font-semibold">Everyone can reply</span>
          </button>
        )}

        {hasFocused && <div className="h-[1px] w-full bg-gray-medium"></div>}

        <div className="my-2 flex items-center justify-between">
          <KweekUtils />
          <button
            disabled={input === ""}
            onClick={() => null}
            className={`rounded-full bg-blue-light px-5 py-2 text-sm font-bold text-white disabled:bg-blue-light/60 disabled:text-white/60`}
          >
            Kweek
          </button>
        </div>
      </div>
    </div>
  );
};
