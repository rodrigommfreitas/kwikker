/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import type { Kweek, User } from "@prisma/client";
import { type NextPage } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "../../../utils/api";
import { KweekPost } from "../../../components/shared/KweekPost";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BiCalendar,
  BiEnvelope,
  BiDotsHorizontalRounded,
  BiLeftArrowAlt,
} from "react-icons/bi";
import { TiLocationOutline } from "react-icons/ti";
import { EditProfileModal } from "../../../components/EditProfileModal";

// May need to review image and banner z index
// Make image and banner responsive
// Add location UI

const Profile: NextPage = () => {
  const userId = usePathname()?.slice(9);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"kweeks" | "replies" | "likes">(
    "kweeks"
  );
  const [kweeksAndRekweeks, setKweeksAndRekweeks] = useState<Kweek[]>([]);
  const [likes, setLikes] = useState<Kweek[]>([]);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUnfollowModalOpen, setIsUnfollowModalOpen] =
    useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);
  const [isUnfollowBtnHovered, setIsUnfollowBtnHovered] =
    useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  const { data: userData, isLoading } = api.user.getUser.useQuery(
    { id: userId as string },
    {
      onSuccess(profileUser: User) {
        setUser(profileUser);
      },
      onError() {
        setUserNotFound(true);
      },
    }
  );

  const { data: stats } = api.user.getStats.useQuery(
    { id: userId as string },
    {
      onSuccess(stats: { followingCount: number; followersCount: number }) {
        setFollowingCount(stats.followingCount);
        setFollowersCount(stats.followersCount);
      },
    }
  );

  const { data } = api.user.getIsFollowedByUser.useQuery(
    { followingId: userId as string, followerId: session?.user.id as string },
    {
      onSuccess(isFollowing: boolean) {
        setIsFollowing(isFollowing);
      },
    }
  );

  const { mutate: follow } = api.user.follow.useMutation({
    onSuccess() {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    },
  });

  const { mutate: unfollow } = api.user.unfollow.useMutation({
    onSuccess() {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    },
  });

  const { data: kweeksData } = api.kweek.getUserKweeksAndRekweeks.useQuery(
    { userId: userId as string },
    {
      onSuccess(kweeksData: Kweek[]) {
        setKweeksAndRekweeks(kweeksData);
      },
    }
  );

  const { data: likesData } = api.kweek.getUserLikedKweeks.useQuery(
    { userId: userId as string },
    {
      onSuccess(likesData: Kweek[]) {
        setLikes(likesData);
      },
    }
  );

  if (userNotFound) return <div>User not found</div>;

  return (
    <>
      {isEditProfileModalOpen && (
        <EditProfileModal
          setIsEditProfileModalOpen={setIsEditProfileModalOpen}
          setUserProfile={setUser}
        />
      )}

      <header className="sticky top-0 z-30 flex h-14 items-center gap-8 bg-black/50 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="ml-2 flex h-fit w-fit items-center justify-center rounded-full p-2 text-xl font-bold transition hover:bg-gray-dark active:bg-gray-medium"
        >
          <BiLeftArrowAlt />
        </button>
        <div>
          <div className="text-xl font-black">
            {!userData || isLoading ? "Loading profile..." : user?.name}
          </div>
          <div className="font-sm text-sm text-gray-light">12 tweets</div>
        </div>
      </header>

      {user && (
        <>
          <div className="relative z-10 h-40 w-full cursor-pointer bg-blue-light/75 sm:h-48"></div>

          <div className="mx-4">
            <div className="relative -top-12 flex max-h-32 justify-between sm:-top-16">
              <Image
                src={user.image as string}
                alt=""
                width={128}
                height={128}
                className="z-20 h-24 w-24 cursor-pointer rounded-full border-2 border-black transition hover:brightness-90 sm:h-32 sm:w-32"
              />
              {session?.user.id === userId ? (
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="h-9 self-end rounded-full border border-gray-light px-4 text-sm font-semibold tracking-wide transition hover:bg-gray-dark sm:mb-3"
                >
                  Edit profile
                </button>
              ) : (
                <div
                  className="
                flex h-9 items-center gap-2 self-end sm:mb-3"
                >
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-light transition hover:bg-gray-dark active:bg-gray-medium">
                    <BiDotsHorizontalRounded size={"1.25em"} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-light transition hover:bg-gray-dark active:bg-gray-medium">
                    <BiEnvelope size={"1.25em"} />
                  </button>
                  {isFollowing ? (
                    <button
                      onMouseEnter={() => setIsUnfollowBtnHovered(true)}
                      onMouseLeave={() => setIsUnfollowBtnHovered(false)}
                      onClick={() =>
                        unfollow({
                          followingId: userId as string,
                          followerId: session?.user.id as string,
                        })
                      }
                      className="h-9 rounded-full border border-gray-light px-4 text-sm font-semibold tracking-wide transition hover:border-red-500 hover:text-red-500 sm:w-36"
                    >
                      {isUnfollowBtnHovered ? "Unfollow" : "Following"}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        follow({
                          followingId: userId as string,
                          followerId: session?.user.id as string,
                        })
                      }
                      className="h-9 rounded-full bg-white px-4 text-sm font-semibold tracking-wide text-black transition hover:bg-white/80 active:bg-white/60"
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative -top-12 flex flex-col gap-3 py-4 sm:-top-16">
              <div>
                <div className="text-xl font-black">{user?.name}</div>
                <div className="text-sm text-gray-light">@{user?.id}</div>
              </div>

              {user.description && <div>{user.description}</div>}

              {user.location && (
                <div className="flex items-center gap-1 text-sm text-gray-light">
                  <TiLocationOutline size={"1.25em"} />
                  <div>{user.location}</div>
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-gray-light">
                <BiCalendar size={"1.25em"} />
                <div>
                  Joined in{" "}
                  {user.createdAt.toLocaleString("default", { month: "long" })}{" "}
                  {user.createdAt.getFullYear()}
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="hover:cursor-pointer hover:underline">
                  <span className="font-bold">{followingCount}</span>
                  <span className="ml-1 text-gray-light">Following</span>
                </div>
                <div className="hover:cursor-pointer hover:underline">
                  <span className="font-bold">{followersCount}</span>
                  <span className="ml-1 text-gray-light">Followers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -top-12 flex h-14 max-h-14 w-full border-b border-gray-medium text-sm text-gray-light sm:-top-16 sm:text-base">
            <button
              onClick={() => setActiveTab("kweeks")}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "kweeks"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Kweeks
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("replies");
              }}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "replies"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Kweeks and replies
              </div>
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className="flex w-full justify-center transition hover:bg-gray-medium/50"
            >
              <div
                className={` ${
                  activeTab === "likes"
                    ? "border-b-2 border-blue-light font-semibold text-white"
                    : "font-gray-light font-normal"
                } flex h-14 w-fit items-center`}
              >
                Likes
              </div>
            </button>
          </div>
          <div className="relative -top-12 sm:-top-16">
            {activeTab === "kweeks"
              ? kweeksAndRekweeks.map((kweek) =>
                  kweek.authorId !== userId ? (
                    <KweekPost
                      key={kweek.id}
                      kweek={kweek}
                      type="feed"
                      rekweekerId={userId}
                      rekweekerUsername={user.name as string}
                    />
                  ) : (
                    <KweekPost key={kweek.id} kweek={kweek} type="feed" />
                  )
                )
              : activeTab === "replies"
              ? null
              : activeTab === "likes"
              ? likes.map((kweek) => (
                  <KweekPost key={kweek.id} kweek={kweek} type="feed" />
                ))
              : null}
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
