import { Ability, ActiveAbility } from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";

// import C3POCHEWBACCA from "./C3POCHEWBACCA";
// import AAYLASECURA from "./AAYLASECURA";
// import CHEWBACCALEGENDARY from "./CHEWBACCALEGENDARY";
// import COMMANDERLUKESKYWALKER from "./COMMANDERLUKESKYWALKER";
// import HANSOLO from "./HANSOLO";
// import OLDBENKENOBI from "./OLDBENKENOBI";
// import ADMIRALACKBAR from "./ADMIRALACKBAR";

class basicskill_COMMANDERLUKESKYWALKER extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_COMMANDERLUKESKYWALKER",
      "Destined Strike",
      "Deal Physical damage to target enemy and inflict Speed Down and Defense Down for 2 turns. If the target already had Speed Down, remove 30% Turn Meter. If the target already had Defense Down, inflict Stun for 1 turn.",
      character
    );
  }

  public execute(): void {
    const { targetList } = this.findTargets({
      filters: [{ allies: false }],
      targetCount: 1,
    });

    targetList.forEach((target) => {
      this.dealDamage("physical", target, 1.781);
    });
  }
}

class specialskill_COMMANDERLUKESKYWALKER02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_COMMANDERLUKESKYWALKER02",
      "Destined Strike",
      "Deal Physical damage to target enemy and inflict Speed Down and Defense Down for 2 turns. If the target already had Speed Down, remove 30% Turn Meter. If the target already had Defense Down, inflict Stun for 1 turn.",
      character
    );
  }

  public execute(): void {
    super.execute();

    const { targetList } = this.findTargets({
      filters: [{ allies: false }],
      targetCount: 1,
    });

    targetList.forEach((target) => {
      this.dealDamage("physical", target, 1.781);
    });
  }
}

export default new Map([
  ["basicskill_COMMANDERLUKESKYWALKER", basicskill_COMMANDERLUKESKYWALKER],
  // [
  //   "specialskill_COMMANDERLUKESKYWALKER02",
  //   specialskill_COMMANDERLUKESKYWALKER02,
  // ],
]);
// const x: Map<string, Ability> = {
//   meow: basicskill_COMMANDERLUKESKYWALKER
// }

// const characterMapping: Record<string, Ability> = {
//   basicskill_COMMANDERLUKESKYWALKER
// };

// export default characterMapping;
