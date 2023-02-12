import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { MdClose } from "react-icons/md";
import { BiLeftArrowAlt } from "react-icons/bi";
import Image from "next/image";
import { useSession } from "next-auth/react";
import type { User } from "@prisma/client";
import { api } from "../utils/api";

type Props = {
  setIsEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
};

export const EditProfileModal = ({
  setIsEditProfileModalOpen,
  setUserProfile,
}: Props) => {
  const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [focusedInput, setFocusedInput] = useState<
    "name" | "bio" | "location" | null
  >(null);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsEditProfileModalOpen(false));

  const { data: userData, isLoading } = api.user.getUser.useQuery(
    { id: session?.user.id as string },
    {
      onSuccess(profileUser: User) {
        setUser(profileUser);
      },
    }
  );

  const { mutate: updateProfile } = api.user.updateProfile.useMutation({
    onSuccess(user) {
      setUser(user as User);
      setUserProfile(user as User);
    },
  });

  const handleUpdateProfile = () => {
    if (
      name === user?.name &&
      bio === user?.description &&
      location === user?.location
    ) {
      setIsEditProfileModalOpen(false);
      return;
    }
    if (name?.length > 50) {
      alert("Name must be less than 50 characters");
      return;
    }
    if (bio?.length > 160) {
      alert("Bio must be less than 160 characters");
      return;
    }
    if (location?.length > 30) {
      alert("Location must be less than 30 characters");
      return;
    }

    try {
      if (name && bio && location)
        updateProfile({
          id: session?.user.id as string,
          name,
          bio,
          location,
        });
      else if (name && bio)
        updateProfile({
          id: session?.user.id as string,
          name,
          bio,
          location: "",
        });
      else if (name && location)
        updateProfile({
          id: session?.user.id as string,
          name,
          bio: "",
          location,
        });
      else if (name)
        updateProfile({
          id: session?.user.id as string,
          name,
          bio: "",
          location: "",
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditProfileModalOpen(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setName(user?.name as string);
    setBio(user?.description as string);
    setLocation(user?.location as string);
  }, [user]);

  return (
    <div className="absolute inset-0 z-40 flex h-screen w-screen items-center justify-center bg-black opacity-100 sm:bg-gray-light/30">
      <div
        ref={ref}
        className="h-[99.5vh] w-full bg-black sm:h-fit sm:w-[600px] sm:rounded-xl"
      >
        <header className="flex items-center justify-between py-2 pr-4 pl-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="hidden rounded-full p-2 transition hover:bg-gray-dark active:bg-gray-medium sm:block"
            >
              <MdClose size={"1.5em"} />
            </button>
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="rounded-full p-2 transition hover:bg-gray-dark active:bg-gray-medium sm:hidden"
            >
              <BiLeftArrowAlt size={"1.5em"} />
            </button>
            <h1 className="text-xl font-bold">Edit profile</h1>
          </div>
          <button
            disabled={name === "" || !name}
            onClick={handleUpdateProfile}
            className="rounded-full bg-white py-1 px-4 font-medium text-black transition hover:bg-white/95 active:bg-white/90"
          >
            Save
          </button>
        </header>

        <div className="h-[150px] w-full bg-blue-light/75 sm:h-[200px]"></div>

        <div className="flex w-full flex-col gap-6 p-4 pb-16">
          <div className="flex items-center gap-4">
            <Image
              width={128}
              height={128}
              alt=""
              src={session?.user.image as string}
              className="rounded-full"
            />
            <div className="w-full">
              <div
                className={`${name === "" ? "border-red-500" : ""} ${
                  focusedInput === "name" && name !== ""
                    ? "border-blue-light"
                    : "border-gray-medium"
                } h-fit w-full rounded-md border p-2`}
              >
                <div className="flex justify-between">
                  <div
                    className={`
                  ${name === "" ? "text-red-500" : "text-gray-light"} ${
                      focusedInput === "name" && name !== ""
                        ? "text-blue-light"
                        : "text-gray-light"
                    } 
                    transition`}
                  >
                    Name
                  </div>
                  <div
                    className={`${
                      focusedInput === "name" ? "block" : "hidden"
                    } text-sm text-gray-light`}
                  >
                    {name?.length | 0}/50
                  </div>
                </div>
                <input
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full bg-transparent outline-none outline-0"
                />
              </div>
              {name === "" && (
                <div className="mt-1 pl-2 text-sm text-red-500">
                  The name can{"'"}t be empty{" "}
                </div>
              )}
            </div>
          </div>

          <div
            className={`${
              focusedInput === "bio"
                ? "border-blue-light"
                : "border-gray-medium"
            } h-fit w-full rounded-md border p-2`}
          >
            <div className="flex justify-between">
              <div
                className={`
                  ${
                    focusedInput === "bio"
                      ? "text-blue-light"
                      : "text-gray-light"
                  } 
                    transition`}
              >
                Bio
              </div>
              <div
                className={`${
                  focusedInput === "bio" ? "block" : "hidden"
                } text-sm text-gray-light`}
              >
                {bio?.length | 0}/160
              </div>
            </div>
            <input
              onFocus={() => setFocusedInput("bio")}
              onBlur={() => setFocusedInput(null)}
              maxLength={160}
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
              type="text"
              className="w-full bg-transparent outline-none outline-0"
            />
          </div>

          <div
            className={`${
              focusedInput === "location"
                ? "border-blue-light"
                : "border-gray-medium"
            } h-fit w-full rounded-md border p-2`}
          >
            <div className="flex justify-between">
              <div
                className={`
                  ${
                    focusedInput === "location"
                      ? "text-blue-light"
                      : "text-gray-light"
                  } 
                    transition`}
              >
                Location
              </div>
              <div
                className={`${
                  focusedInput === "location" ? "block" : "hidden"
                } text-sm text-gray-light`}
              >
                {location?.length | 0}/30
              </div>
            </div>
            <input
              onFocus={() => setFocusedInput("location")}
              onBlur={() => setFocusedInput(null)}
              maxLength={30}
              value={location || ""}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              className="w-full bg-transparent outline-none outline-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
