import { Engine } from "types/gameEngine/gameEngine";
import { Character } from "types/gameEngine/characters/index";
import charactersList from "types/gameEngine/characterScripts/charactersList";

onmessage = (e) => {
  const {
    playerList,
    opponentList,
    playerName,
    opponentName,
    simulationCount,
  } = e.data;
  const ctx: Worker = self as any;
  const engine = new Engine();

  const playerCharacters = playerList.map((unit) => {
    const characterClass = charactersList.get(unit.id);

    if (characterClass) {
      return new characterClass(unit, playerName, unit.isLeader, engine);
    } else {
      return new Character(unit, playerName, unit.isLeader, engine);
    }
  });

  const opponentCharacters = opponentList.map((unit) => {
    const characterClass = charactersList.get(unit.id);

    if (characterClass) {
      return new characterClass(unit, opponentName, unit.isLeader, engine);
    } else {
      return new Character(unit, opponentName, unit.isLeader, engine);
    }
  });

  const results = engine.startSimulation(
    playerCharacters,
    opponentCharacters,
    Math.min(simulationCount, 10)
  );

  console.log(results);
  ctx.postMessage(results);
};
