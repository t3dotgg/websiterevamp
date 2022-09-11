import { createRouter } from "./context";
import { z } from "zod";
import { PokemonClient } from "pokenode-ts";
import { resolve } from "path";

export const pokeRouter = createRouter().query("pokemon-get", {
  input: z.object({id: z.number()}),
    async resolve({input}){
      const api = new PokemonClient();
      const pokemon = api.getPokemonById(input.id);
    return pokemon;
  },
});
