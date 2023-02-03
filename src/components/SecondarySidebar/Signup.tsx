/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { signIn } from "next-auth/react";
import { AiOutlineGoogle, AiFillApple } from "react-icons/ai";

export const Signup = () => {
  return (
    <div className="mt-3 flex flex-col rounded-2xl border border-gray-medium px-3">
      <span className="py-3 text-xl font-bold">New To Kwikker?</span>
      <span className="text-sm text-gray-light">
        Sign up now to get your own personalized timeline!
      </span>

      <div className="my-3 flex flex-col gap-3">
        <button
          onClick={() => signIn("google")}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full border-0 bg-white"
        >
          <AiOutlineGoogle size={"1.25em"} color="black" />
          <span className="font-medium tracking-wide text-black">
            Sign up with Google
          </span>
        </button>
        <button className="flex h-10 w-full items-center justify-center gap-2 rounded-full border-0 bg-white">
          <AiFillApple size={"1.25em"} color="black" />
          <span className="font-medium tracking-wide text-black">
            Sign up with Apple
          </span>
        </button>
        <button className="flex h-10 items-center justify-center rounded-full border-0 bg-white font-medium tracking-wide text-black">
          Create account
        </button>
      </div>

      <span className="mb-3 text-sm">
        By signing up, you agree to the
        <a className="cursor-pointer text-blue-500 hover:underline">
          {" "}
          Terms of Service{" "}
        </a>
        and
        <a className="cursor-pointer text-blue-500 hover:underline">
          {" "}
          Privacy Policy
        </a>
        , including
        <a className="cursor-pointer text-blue-500 hover:underline">
          {" "}
          Cookie Use
        </a>
        .
      </span>
    </div>
  );
};
