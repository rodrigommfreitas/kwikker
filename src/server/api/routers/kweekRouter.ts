import type { Kweek } from "@prisma/client";
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

  replyKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        authorId: z.string(),
        content: z
          .string()
          .min(1, { message: "Field can't be empty." })
          .max(280, { message: "Maximum characters exceeded." }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const kweek = await ctx.prisma.reply.create({
          data: input,
        });
        return kweek;
      } catch (err) {
        console.log(
          `It wasn't possible to reply to kweek...\n ${err as string}`
        );
      }
    }),

  getReplies: publicProcedure
    .input(
      z.object({
        kweekId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const replies = await ctx.prisma.reply.findMany({
          where: {
            kweekId: input.kweekId,
          },
        });
        return replies;
      } catch (err) {
        console.log(`It wasn't possible to get replies...\n ${err as string}`);
      }
    }),

  getKweek: publicProcedure
    .input(
      z.object({
        kweekId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const kweek = await ctx.prisma.kweek.findUnique({
          where: {
            id: input.kweekId,
          },
        });
        return kweek;
      } catch (err) {
        console.log(`It wasn't possible to get kweek...\n ${err as string}`);
      }
    }),

  deleteKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.authorId !== ctx.session.user.id)
          throw new Error("Unauthorized");

        const kweek = await ctx.prisma.kweek.delete({
          where: {
            id: input.kweekId,
          },
        });
        return kweek;
      } catch (err) {
        console.log(`It wasn't possible to delete kweek...\n ${err as string}`);
      }
    }),

  rekweekKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        rekweekerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const rekweek = await ctx.prisma.rekweek.create({
          data: input,
        });
        return rekweek;
      } catch (err) {
        console.log(
          `It wasn't possible to rekweek kweek...\n ${err as string}`
        );
      }
    }),

  unRekweekKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        rekweekerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const rekweek = await ctx.prisma.rekweek.findFirst({
          where: {
            kweekId: input.kweekId,
            rekweekerId: input.rekweekerId,
          },
        });
        const unrekweek = await ctx.prisma.rekweek.delete({
          where: {
            id: rekweek?.id,
          },
        });
        return unrekweek;
      } catch (err) {
        console.log(
          `It wasn't possible to unrekweek kweek...\n ${err as string}`
        );
      }
    }),

  likeKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        likerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const like = await ctx.prisma.like.create({
          data: input,
        });
        return like;
      } catch (err) {
        console.log(`It wasn't possible to like kweek...\n ${err as string}`);
      }
    }),

  unLikeKweek: protectedProcedure
    .input(
      z.object({
        kweekId: z.string(),
        likerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const like = await ctx.prisma.like.findFirst({
          where: {
            kweekId: input.kweekId,
            likerId: input.likerId,
          },
        });
        const unlike = await ctx.prisma.like.delete({
          where: {
            id: like?.id,
          },
        });
        return unlike;
      } catch (err) {
        console.log(`It wasn't possible to unlike kweek...\n ${err as string}`);
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

  getFollowingKweeks: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // User kweeks
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

        // User followers
        const following = await ctx.prisma.follows.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            followerId: input.userId,
          },
        });
        const followingIds = following.map((follow) => follow.followingId);

        // Followers kweeks
        const followersKweeks = await ctx.prisma.kweek.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            authorId: {
              in: followingIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        kweeks.push(...followersKweeks);

        const followingRekweeks = await ctx.prisma.rekweek.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            rekweekerId: {
              in: followingIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        for (const rekweek of followingRekweeks) {
          const rekweekedKweek = await ctx.prisma.kweek.findUnique({
            where: {
              id: rekweek.kweekId,
            },
          });
          rekweekedKweek && kweeks.push(rekweekedKweek);
        }

        // Followers likes
        const followingLikes = await ctx.prisma.like.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            likerId: {
              in: followingIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        for (const like of followingLikes) {
          const likedKweek = await ctx.prisma.kweek.findUnique({
            where: {
              id: like.kweekId,
            },
          });
          likedKweek && kweeks.push(likedKweek);
        }

        // Sort kweeks by time
        kweeks.sort((a: Kweek, b: Kweek) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        return kweeks;
      } catch (err) {
        console.log(
          `It wasn't possible to get following kweeks...\n ${err as string}`
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

        kweeks.sort((a: Kweek, b: Kweek) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return kweeks;
      } catch (err) {
        console.log(
          `It wasn't possible to get user kweeks...\n ${err as string}`
        );
      }
    }),

  getUserLikedKweeks: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const likes = await ctx.prisma.like.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            likerId: input.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        const kweeks = [];
        for (const like of likes) {
          const likedKweek = await ctx.prisma.kweek.findUnique({
            where: {
              id: like.kweekId,
            },
          });
          likedKweek && kweeks.push(likedKweek);
        }
        return kweeks;
      } catch (err) {
        console.log(
          `It wasn't possible to get liked kweeks...\n ${err as string}`
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
});
