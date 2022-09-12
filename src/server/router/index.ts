// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { pokeNames, pokeRouter } from "./pokeinfo";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("", pokeRouter)
  .merge("", pokeNames);
  

// export type definition of API
export type AppRouter = typeof appRouter;
