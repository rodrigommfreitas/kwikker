import { useRef, useState } from "react";
import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";

export const SearchBar = () => {
  const [isFocus, setIsFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const inputEl = useRef<HTMLInputElement>(null);

  const handleFocus = (x: boolean) => {
    setIsFocus(x);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value != "" || e.target.value != null || e.target.value != 0)
      setIsEmpty(false);
    else setIsEmpty(true);
  };

  const handleClick = () => {
    if (inputEl.current) {
      inputEl.current.value = "";
      setIsEmpty(true);
      inputEl.current.focus();
      setIsFocus(true);
    }
  };

  return (
    <div
      className={`sticky top-1 my-1 flex w-full gap-4 rounded-full bg-gray-medium px-4 py-3 outline-none outline-offset-0 ${
        isFocus ? "outline-1 outline-blue-500" : ""
      }`}
    >
      <div className={`my-auto ${isFocus ? "text-blue-500" : "text-gray-400"}`}>
        <AiOutlineSearch size={"1.25em"} />
      </div>
      <input
        ref={inputEl}
        type="text"
        id="search"
        autoComplete="off"
        placeholder="Search Kwikker"
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        onChange={handleChange}
        className="w-full bg-gray-medium outline-none outline-offset-0"
      />
      {!isEmpty && isFocus && (
        <button onClick={handleClick} className="my-auto text-blue-500">
          <AiFillCloseCircle size={"1.5em"} />
        </button>
      )}
    </div>
  );
};
