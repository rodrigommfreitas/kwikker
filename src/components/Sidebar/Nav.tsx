import { useSession } from "next-auth/react";
import {
  BiHomeCircle,
  BiBell,
  BiEnvelope,
  BiHash,
  BiBookmark,
  BiUser,
  BiDotsHorizontalRounded,
} from "react-icons/bi";
import { BsFileText } from "react-icons/bs";
import { GiFluffyWing } from "react-icons/gi";
import { FiSettings } from "react-icons/fi";

export const Nav = () => {
  const { data: session } = useSession();

  const btnStyle =
    "rounded-full flex text-lg p-3 xl:pr-6 gap-0 xl:gap-4 transition hover:bg-gray-dark";
  const txtStyle = "hidden xl:flex tracking-wide text-xl";
  return (
    <nav className="mt-1 flex w-full flex-col items-center gap-1 xl:items-baseline">
      <button className="rounded-full p-3 text-lg transition hover:bg-gray-dark">
        <GiFluffyWing size={"1.5em"} />
      </button>
      {!session ? (
        <>
          <button className={btnStyle}>
            <BiHomeCircle size={"1.5em"} />
            <span className={txtStyle}>Home</span>
          </button>
          <button className={btnStyle}>
            <BiHash size={"1.5em"} />
            <span className={txtStyle}>Explore</span>
          </button>
          <button className={btnStyle}>
            <BiBell size={"1.5em"} />
            <span className={txtStyle}>Notifications</span>
          </button>
          <button className={btnStyle}>
            <BiEnvelope size={"1.5em"} />
            <span className={txtStyle}>Messages</span>
          </button>
          <button className={btnStyle}>
            <BiBookmark size={"1.5em"} />
            <span className={txtStyle}>Bookmarks</span>
          </button>
          <button className={btnStyle}>
            <BsFileText size={"1.5em"} />
            <span className={txtStyle}>Lists</span>
          </button>
          <button className={btnStyle}>
            <BiUser size={"1.5em"} />
            <span className={txtStyle}>Profile</span>
          </button>
          <button className={btnStyle}>
            <BiDotsHorizontalRounded size={"1.5em"} />
            <span className={txtStyle}>More</span>
          </button>
        </>
      ) : (
        <>
          <button className={btnStyle}>
            <BiHash size={"1.5em"} />
            <span className={txtStyle}>Explore</span>
          </button>
          <button className={btnStyle}>
            <FiSettings size={"1.5em"} />
            <span className={txtStyle}>Settings</span>
          </button>
        </>
      )}
    </nav>
  );
};
