import { AiOutlineCalendar, AiOutlineFileGif } from "react-icons/ai";
import { BiImage, BiPoll, BiSmile } from "react-icons/bi";
import { TiLocationOutline } from "react-icons/ti";

export const KweekUtils = () => {
  return (
    <div className="ml-1 flex h-fit items-center gap-1 text-blue-light">
      <button className="rounded-full p-2 transition hover:bg-blue-light/10 active:bg-blue-light/20">
        <BiImage size={"1.25em"} />
      </button>
      <button className="rounded-full p-2 transition hover:bg-blue-light/10 active:bg-blue-light/20">
        <AiOutlineFileGif size={"1.25em"} />
      </button>
      <button className="hidden rounded-full p-2 transition hover:bg-blue-light/10 active:bg-blue-light/20 sm:flex">
        <BiPoll size={"1.25em"} />
      </button>
      <button className="rounded-full p-2 transition hover:bg-blue-light/10 active:bg-blue-light/20">
        <BiSmile size={"1.25em"} />
      </button>
      <button className="hidden rounded-full p-2 transition hover:bg-blue-light/10 active:bg-blue-light/20 sm:flex">
        <AiOutlineCalendar size={"1.25em"} />
      </button>
      <button
        className="hidden rounded-full p-1 transition disabled:text-blue-light/50 sm:flex"
        disabled
      >
        <TiLocationOutline size={"1.25em"} />
      </button>
    </div>
  );
};
