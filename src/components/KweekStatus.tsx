/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type { User, Kweek, Reply } from "@prisma/client";
import Image from "next/image";
import { useRef, useState } from "react";
import { api } from "../utils/api";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiShareForward2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KweekUtils } from "./shared/CreateKweek/KweekUtils";
import { KweekPost } from "./shared/KweekPost";

type Props = {
  kweek: Kweek;
  kweekAuthor: User;
};

export const KweekStatus = ({ kweek, kweekAuthor }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isRekweeked, setIsRekweeked] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [rekweekCount, setRekweekCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hasFocused, setHasFocused] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [replies, setReplies] = useState<Kweek[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);

  const { data: userData, isLoading } = api.user.getUser.useQuery(
    { id: kweek?.authorId },
    {
      onSuccess(userData: User) {
        setUser(userData);
      },
    }
  );

  const { data: stats } = api.kweek.getStats.useQuery(
    { id: kweek?.id },
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
    { kweekId: kweek?.id, userId: session?.user.id as string },
    {
      onSuccess(isRekweekedByUser: boolean) {
        setIsRekweeked(isRekweekedByUser);
      },
    }
  );

  const { data: isLikedByUser } = api.kweek.getIsLikedByUser.useQuery(
    { kweekId: kweek?.id, userId: session?.user.id as string },
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
    onSuccess(unrekweek) {
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

  const { data: repliesData } = api.kweek.getReplies.useQuery(
    { kweekId: kweek?.id },
    {
      onSuccess(repliesData: Kweek[]) {
        setReplies(repliesData);
      },
    }
  );

  const { mutate: replyToKweek } = api.kweek.replyKweek.useMutation({
    onSuccess(reply) {
      setReplies([reply as Reply, ...replies]);
    },
  });

  const handleKweekReply = () => {
    if (input === "" || input.length > 280) return;

    try {
      replyToKweek({
        kweekId: kweek?.id,
        authorId: session?.user.id as string,
        content: input,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setInput("");
      ref.current?.value && (ref.current.value = "");
      setHasFocused(false);
    }
  };

  if (!userData && isLoading)
    return (
      <div className="flex w-full items-center justify-center border-b border-gray-medium py-4 text-xl text-gray-light">
        ...
      </div>
    );

  return (
    <>
      <div className="flex h-fit w-full flex-col border-b border-gray-medium px-4 pt-3 pb-1 text-left">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <Image
              src={user?.image as string}
              alt=""
              width={48}
              height={48}
              className="max-h-[48px] max-w-[48px] rounded-full bg-black"
              onClick={() => router.push(`/profile/${user?.id as string}`)}
            />

            <a onClick={() => router.push(`/profile/${user?.id as string}`)}>
              <div className="font-bold hover:underline">{user?.name}</div>
              <div className="text-sm text-gray-light hover:underline">
                @{user?.id}
              </div>
            </a>
          </div>

          <button className="h-fit w-fit rounded-full p-1 text-gray-light transition hover:bg-blue-light/20 hover:text-blue-light active:bg-blue-light/30">
            <BiDotsHorizontalRounded size={"1.25em"} />
          </button>
        </div>

        <div className="my-2 text-lg">{kweek.content}</div>

        <a href="#" className="text-sm text-gray-500 hover:underline">
          {kweek.createdAt.toLocaleString("default", { day: "numeric" })}{" "}
          {kweek.createdAt.toLocaleString("default", { month: "short" })}{" "}
          {kweek.createdAt.getFullYear()}
        </a>

        <div className="my-2 h-[1px] w-full bg-gray-medium"></div>

        <div className="flex gap-4 text-sm">
          <a>
            <span className="font-semibold">{rekweekCount}</span>
            <span className="ml-1 text-gray-light hover:cursor-pointer hover:underline">
              {rekweekCount === 1 ? "Rekweek" : "Rekweeks"}
            </span>
          </a>
          <a>
            <span className="font-semibold">{likeCount}</span>
            <span className="ml-1 text-gray-light hover:cursor-pointer hover:underline">
              {likeCount === 1 ? "Like" : "Likes"}
            </span>
          </a>
        </div>

        <div className="my-2 h-[1px] w-full bg-gray-medium"></div>

        <div className="flex w-full items-center justify-between px-12 text-gray-light">
          <button
            onClick={() => router.push(`/status/${kweek.id}`)}
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-blue-light/20 hover:text-blue-primary"
          >
            <FaRegComment size={"1.25em"} />
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
            className={`${
              isRekweeked ? "text-green-400" : "text-gray-light"
            } flex items-center gap-2 rounded-full p-1 transition hover:bg-green-400/20 hover:text-green-400`}
          >
            <AiOutlineRetweet size={"1.25em"} />
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
            className={`${
              isLiked ? "text-red-500" : "text-gray-light"
            } flex items-center gap-2 transition hover:text-red-500`}
          >
            {isLiked ? (
              <AiFillHeart
                size={"1.75em"}
                className="rounded-full p-1 transition hover:bg-red-500/20"
              />
            ) : (
              <AiOutlineHeart
                size={"1.75em"}
                className="rounded-full p-1 transition hover:bg-red-500/20"
              />
            )}
          </button>
          <button className="flex h-fit w-fit items-center rounded-full transition hover:bg-blue-light/20 hover:text-blue-primary">
            <RiShareForward2Fill size={"1.75em"} className="p-1" />
          </button>
        </div>

        <div className="my-2 h-[1px] w-full bg-gray-medium"></div>

        <div>
          {hasFocused && (
            <button className="my-1 pl-16 text-gray-light">
              Replying to{" "}
              <span className="text-blue-primary">{kweekAuthor.name}</span>
            </button>
          )}
          <div className="flex w-full gap-4">
            <Image
              src={session?.user.image as string}
              alt=""
              width={48}
              height={48}
              className="h-max-12 w-max-12 h-12 w-12 cursor-pointer rounded-full"
              onClick={() =>
                router.push(`/profile/${session?.user.id as string}`)
              }
            />
            <div className="w-full">
              <textarea
                ref={ref}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Kweek your reply"
                onFocus={() => setHasFocused(true)}
                className="min-h-12 h-12 w-full resize-none overflow-hidden bg-black py-3 text-xl tracking-wide outline-none"
              />

              <div className="my-2 flex items-center justify-between">
                <KweekUtils reply={true} />
                <button
                  onClick={handleKweekReply}
                  disabled={input === ""}
                  className={`rounded-full bg-blue-light px-5 py-2 text-sm font-bold text-white disabled:bg-blue-light/60 disabled:text-white/60`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {replies.map((reply) => (
        <KweekPost
          key={reply.id}
          kweek={reply}
          replyTo={kweekAuthor.name as string}
        />
      ))}
    </>
  );
};
