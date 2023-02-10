import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { kweekRouter } from "./routers/kweekRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  kweek: kweekRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
