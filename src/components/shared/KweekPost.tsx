import type { User, Kweek } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { api } from "../../utils/api";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { RiShareForward2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  kweek: Kweek;
  type: "feed" | "reply" | "page";
  rekweekerId?: string;
  rekweekerUsername?: string;
};

// Make this component responsive
// Make UI adapt to different types of kweeks

export const KweekPost = ({ kweek, rekweekerId, rekweekerUsername }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isRekweeked, setIsRekweeked] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [rekweekCount, setRekweekCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hoveredBtn, setHoveredBtn] = useState<
    "reply" | "rekweek" | "like" | null
  >(null);
  const { data: session } = useSession();
  const router = useRouter();

  const { data: userData, isLoading } = api.user.getUser.useQuery(
    { id: kweek.authorId },
    {
      onSuccess(userData: User) {
        setUser(userData);
      },
    }
  );

  const { data: stats } = api.kweek.getStats.useQuery(
    { id: kweek.id },
    {
      onSuccess(stats: {
        replyCount: number;
        rekweekCount: number;
        likeCount: number;
      }) {
        setReplyCount(stats.replyCount);
        setRekweekCount(stats.rekweekCount);
        setLikeCount(stats.likeCount);
      },
    }
  );

  const { data: isRekweekedByUser } = api.kweek.getIsRekweekedByUser.useQuery(
    { kweekId: kweek.id, userId: session?.user.id as string },
    {
      onSuccess(isRekweekedByUser: boolean) {
        setIsRekweeked(isRekweekedByUser);
      },
    }
  );

  const { data: isLikedByUser } = api.kweek.getIsLikedByUser.useQuery(
    { kweekId: kweek.id, userId: session?.user.id as string },
    {
      onSuccess(isLikedByUser: boolean) {
        setIsLiked(isLikedByUser);
      },
    }
  );

  const { mutate: rekweekKweek } = api.kweek.rekweekKweek.useMutation({
    onSuccess() {
      setRekweekCount(rekweekCount + 1);
      setIsRekweeked(true);
    },
  });

  const { mutate: unRekweekKweek } = api.kweek.unRekweekKweek.useMutation({
    onSuccess() {
      setRekweekCount(rekweekCount - 1);
      setIsRekweeked(false);
    },
  });

  const { mutate: likeKweek } = api.kweek.likeKweek.useMutation({
    onSuccess() {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    },
  });

  const { mutate: unLikeKweek } = api.kweek.unLikeKweek.useMutation({
    onSuccess() {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    },
  });

  if (!userData && isLoading)
    return (
      <div className="flex w-full items-center justify-center border-b border-gray-medium py-4 text-xl text-gray-light">
        Loading kweek...
      </div>
    );

  return (
    <button
      className={`${
        rekweekerId && rekweekerUsername ? "pt-[6px]" : "pt-3"
      } flex h-fit w-full flex-col border-b border-gray-medium px-4 pb-3 text-left`}
    >
      {rekweekerId && rekweekerUsername && (
        <div className="mb-[6px] flex w-full gap-3 text-sm font-semibold text-gray-light">
          <div className="flex w-12 items-center justify-end">
            <AiOutlineRetweet size={"1.125em"} />
          </div>
          {session?.user.name == rekweekerUsername ? "You" : rekweekerUsername}{" "}
          rekweeked
        </div>
      )}
      <div className="flex gap-3">
        <Image
          src={user?.image as string}
          alt=""
          width={48}
          height={48}
          className="max-h-[48px] max-w-[48px] rounded-full bg-black"
          onClick={() => router.push(`/profile/${user?.id as string}`)}
        />
        <div className="h-fit w-full">
          <div className="flex justify-between">
            <div>
              <a
                onClick={() => router.push(`/profile/${user?.id as string}`)}
                className="font-bold hover:underline"
              >
                {user?.name}
              </a>
              <span className="text-gray-light"> · </span>
              <a href="#" className="text-gray-500 hover:underline">
                {kweek.createdAt.toLocaleString("default", { day: "numeric" })}{" "}
                {kweek.createdAt.toLocaleString("default", { month: "short" })}{" "}
                {kweek.createdAt.getFullYear()}
              </a>
            </div>
            <button className="h-fit w-fit rounded-full p-1 text-gray-light transition hover:bg-blue-light/20 hover:text-blue-light active:bg-blue-light/30">
              <BiDotsHorizontalRounded size={"1.25em"} />
            </button>
          </div>

          <span>{kweek.content}</span>

          <div className="mt-3 flex w-11/12 max-w-md items-center justify-between text-gray-light sm:w-5/6 ">
            <button
              onMouseEnter={() => setHoveredBtn("reply")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 transition hover:text-blue-primary"
            >
              <FaRegComment
                size={"1.75em"}
                className={`rounded-full p-1 transition ${
                  hoveredBtn === "reply" ? "bg-blue-light/20" : "bg-none"
                }`}
              />
              <span className="text-sm">{replyCount}</span>
            </button>
            <button
              onClick={
                isRekweeked
                  ? () =>
                      unRekweekKweek({
                        kweekId: kweek.id,
                        rekweekerId: session?.user.id as string,
                      })
                  : () =>
                      rekweekKweek({
                        kweekId: kweek.id,
                        rekweekerId: session?.user.id as string,
                      })
              }
              onMouseEnter={() => setHoveredBtn("rekweek")}
              onMouseLeave={() => setHoveredBtn(null)}
              className={`${
                isRekweeked ? "text-green-400" : "text-gray-light"
              } flex items-center gap-2 transition hover:text-green-400`}
            >
              <AiOutlineRetweet
                size={"1.75em"}
                className={`rounded-full p-1 transition ${
                  hoveredBtn === "rekweek" ? "bg-green-400/20" : "bg-none"
                }`}
              />
              <span className="text-sm">{rekweekCount}</span>
            </button>
            <button
              onClick={
                isLiked
                  ? () =>
                      unLikeKweek({
                        kweekId: kweek.id,
                        likerId: session?.user.id as string,
                      })
                  : () =>
                      likeKweek({
                        kweekId: kweek.id,
                        likerId: session?.user.id as string,
                      })
              }
              onMouseEnter={() => setHoveredBtn("like")}
              onMouseLeave={() => setHoveredBtn(null)}
              className={`${
                isLiked ? "text-red-500" : "text-gray-light"
              } flex items-center gap-2 transition hover:text-red-500`}
            >
              <AiOutlineHeart
                size={"1.75em"}
                className={`rounded-full p-1 transition ${
                  hoveredBtn === "like" ? "bg-red-500/20" : "bg-none"
                }`}
              />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button className="flex h-fit w-fit items-center rounded-full transition hover:bg-blue-light/20 hover:text-blue-primary">
              <RiShareForward2Fill size={"1.75em"} className="p-1" />
            </button>
          </div>
        </div>
      </div>
    </button>
  );
};
