import { prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const kweekRouter = createTRPCRouter({
  addKweek: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, { message: "Field can't be empty." })
          .max(280, { message: "Maximum characters exceeded." }),
        author: z.object({ connect: z.object({ id: z.string() }) }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const kweek = await ctx.prisma.kweek.create({
          data: input,
        });
        return kweek;
      } catch (err) {
        console.log(`It wasn't possible to add kweek...\n ${err as string}`);
      }
    }),

  getAllKweeks: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const kweeks = await ctx.prisma.kweek.findMany({
          skip: input.skip,
          take: input.take,
          orderBy: {
            createdAt: "desc",
          },
        });
        return kweeks;
      } catch (err) {
        console.log(
          `It wasn't possible to get all kweeks...\n ${err as string}`
        );
      }
    }),

  getUserKweeksAndRekweeks: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const kweeks = await ctx.prisma.kweek.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            authorId: input.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        const rekweeks = await ctx.prisma.rekweek.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            rekweekerId: input.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        for (const rekweek of rekweeks) {
          const rekweekedKweek = await ctx.prisma.kweek.findUnique({
            where: {
              id: rekweek.kweekId,
            },
          });
          rekweekedKweek && kweeks.push(rekweekedKweek);
        }

        kweeks.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return kweeks;
      } catch (err) {
        console.log(
          `It wasn't possible to get user kweeks...\n ${err as string}`
        );
      }
    }),

  getStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const replyCount = await ctx.prisma.reply.count({
          where: { kweekId: input.id },
        });
        const rekweekCount = await ctx.prisma.rekweek.count({
          where: { kweekId: input.id },
        });
        const likeCount = await ctx.prisma.like.count({
          where: { kweekId: input.id },
        });

        return {
          replyCount: replyCount,
          rekweekCount: rekweekCount,
          likeCount: likeCount,
        };
      } catch (err) {
        console.log(`It wasn't possible to get stats...\n ${err as string}`);
      }
    }),

  getIsRekweekedByUser: protectedProcedure
    .input(z.object({ kweekId: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const isRekweeked = await ctx.prisma.rekweek.findFirst({
          where: {
            kweekId: input.kweekId,
            rekweekerId: input.userId,
          },
        });
        return isRekweeked ? true : false;
      } catch (err) {
        console.log(
          `It wasn't possible to verify if kweek was retweeted...\n ${
            err as string
          }`
        );
      }
    }),

  getIsLikedByUser: protectedProcedure
    .input(z.object({ kweekId: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const isLiked = await ctx.prisma.like.findFirst({
          where: {
            kweekId: input.kweekId,
            likerId: input.userId,
          },
        });
        return isLiked ? true : false;
      } catch (err) {
        console.log(
          `It wasn't possible to verify if kweek was liked...\n ${
            err as string
          }`
        );
      }
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
