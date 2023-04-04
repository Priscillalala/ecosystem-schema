import { loadGameDefinitions } from "../load";
import { GameDefinition, ThunderstoreCommunityDefinition } from "../models";
import fs from "fs";

const existingDefinitions = loadGameDefinitions();

const games = new Map<string, GameDefinition>();
const communities = new Map<string, ThunderstoreCommunityDefinition>();
for (const game of existingDefinitions) {
  if (games.has(game.label)) {
    throw new Error(`Game definition with duplicate label: ${game.label}`);
  }
  if (game.thunderstore !== undefined) {
    if (communities.has(game.label)) {
      throw new Error(
        `Community definition with duplicate label: ${game.label}`
      );
    }
    communities.set(game.label, game.thunderstore);
  }
  games.set(game.label, game);
}

const result = {
  schemaVersion: "0.0.8",
  games: Object.fromEntries(games),
  communities: Object.fromEntries(communities),
};

const outdir = "./dist";
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}
const jsoned = JSON.stringify(result, undefined, 2);
fs.writeFileSync(
  `${outdir}/ecosystem-schema.${result.schemaVersion}.json`,
  jsoned
);
fs.writeFileSync(`${outdir}/latest.json`, jsoned);
