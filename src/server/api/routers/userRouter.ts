import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.id },
        });
        return user;
      } catch (err) {
        console.log(`It wasn't possible to find user...\n ${err as string}`);
      }
    }),

  getStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const followingCount = await ctx.prisma.follows.count({
          where: { followerId: input.id },
        });
        const followersCount = await ctx.prisma.follows.count({
          where: { followingId: input.id },
        });
        const kweeksCount = await ctx.prisma.kweek.count({
          where: { authorId: input.id },
        });
        const rekweeksCount = await ctx.prisma.rekweek.count({
          where: { rekweekerId: input.id },
        });

        return {
          followingCount: followingCount,
          followersCount: followersCount,
          kweeksCount: kweeksCount + rekweeksCount,
        };
      } catch (err) {
        console.log(`It wasn't possible to get stats...\n ${err as string}`);
      }
    }),

  getFollowers: publicProcedure
    .input(
      z.object({
        id: z.string(),
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const followers = await ctx.prisma.follows.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            followingId: input.id,
          },
        });
        return followers;
      } catch (err) {
        console.log(
          `It wasn't possible to get followers...\n ${err as string}`
        );
      }
    }),

  getFollowing: publicProcedure
    .input(
      z.object({
        id: z.string(),
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const following = await ctx.prisma.follows.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            followerId: input.id,
          },
        });
        return following;
      } catch (err) {
        console.log(
          `It wasn't possible to get following...\n ${err as string}`
        );
      }
    }),

  getIsFollowedByUser: protectedProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const isFollowed = await ctx.prisma.follows.findFirst({
          where: {
            followerId: input.followerId,
            followingId: input.followingId,
          },
        });
        return isFollowed ? true : false;
      } catch (err) {
        console.log(
          `It wasn't possible to verify if user is followed...\n ${
            err as string
          }`
        );
      }
    }),

  follow: protectedProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const follow = await ctx.prisma.follows.create({
          data: {
            followerId: input.followerId,
            followingId: input.followingId,
          },
        });
        return follow;
      } catch (err) {
        console.log(`It wasn't possible to follow user...\n ${err as string}`);
      }
    }),

  unfollow: protectedProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const follow = await ctx.prisma.follows.delete({
          where: {
            followerId_followingId: {
              followerId: input.followerId,
              followingId: input.followingId,
            },
          },
        });
        return follow;
      } catch (err) {
        console.log(
          `It wasn't possible to unfollow user...\n ${err as string}`
        );
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(50),
        bio: z.string().max(160),
        location: z.string().max(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id !== ctx.session.user.id) {
        throw new Error("You can't update other user's profile");
      }

      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.bio,
            location: input.location,
          },
        });
        return user;
      } catch (err) {
        console.log(`It wasn't possible to update user...\n ${err as string}`);
      }
    }),
});
