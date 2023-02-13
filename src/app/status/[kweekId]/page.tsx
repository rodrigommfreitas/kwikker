"use client";
import type { Kweek, User } from "@prisma/client";
import { type NextPage } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "../../../utils/api";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { KweekStatus } from "../../../components/KweekStatus";
import { useSession } from "next-auth/react";

const Status: NextPage = () => {
  const kweekId = usePathname()?.slice(8);
  const [user, setUser] = useState<User | null>(null);
  const [kweek, setKweek] = useState<Kweek | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const { data: kweekData, isLoading } = api.kweek.getKweek.useQuery(
    { kweekId: kweekId as string },
    {
      onSuccess(kweek: Kweek) {
        setKweek(kweek);
      },
    }
  );

  const { data: userData } = api.user.getUser.useQuery(
    { id: kweek?.authorId as string },
    {
      onSuccess(user: User) {
        setUser(user);
      },
    }
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-8 bg-black/50 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="ml-2 flex h-fit w-fit items-center justify-center rounded-full p-2 text-xl font-bold transition hover:bg-gray-dark active:bg-gray-medium"
        >
          <BiLeftArrowAlt />
        </button>
        <div>
          <div className="text-xl font-black">Kweek</div>
        </div>
      </header>
      <KweekStatus kweek={kweek as Kweek} kweekAuthor={user as User} />
    </>
  );
};

export default Status;
