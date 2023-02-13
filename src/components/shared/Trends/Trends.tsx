"use client";
import { Trend } from "./Trend";

export const Trends = () => {
  return (
    <div className="mt-4 rounded-3xl bg-gray-dark pt-3">
      <span className="px-4 text-xl font-bold">Trends for you</span>
      <div className="mt-2">
        <Trend location="Kwikker" trend="TypeScript" kweeks="2.1M" />
        <Trend location="Kwikker" trend="Next.js" kweeks="1.5M" />
        <Trend location="Kwikker" trend="NextAuth.js" kweeks="175K" />
        <Trend location="Kwikker" trend="Prisma" kweeks="29.4K" />
        <Trend location="Kwikker" trend="Tailwind CSS" kweeks="39.6K" />
        <Trend location="Kwikker" trend="Zod" kweeks="394.2K" />
        <Trend location="Kwikker" trend="tRPC" kweeks="59.7K" />
        <Trend location="Kwikker" trend="ESLint" kweeks="92K" />
        <Trend location="Kwikker" trend="Prettier" kweeks="31.1K" last={true} />
      </div>
    </div>
  );
};
