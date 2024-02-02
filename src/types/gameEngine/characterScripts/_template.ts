import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";

class basicskill extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill",
      "Something Something",
      `This some some shit`,
      character
    );
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      const newStats: iStatsCheck[] = [
        ...(stats ?? []),
        {
          statToModify: "physicalOffense",
          modifiedType: "multiplicative",
          characterSourceId: this._character.uniqueId,
          amount: 1,
        },
        {
          statToModify: "specialOffense",
          modifiedType: "multiplicative",
          characterSourceId: this._character.uniqueId,
          amount: 1,
        },
      ];

      if (primaryTarget) {
        if (!this.checkEvade("physical", primaryTarget)) {
          this.dealDamage(
            "physical",
            primaryTarget,
            1.1111,
            5,
            newStats,
            canBeCountered
          );
        }
      }
    });
  }
}

class uniqueskill extends PassiveAbility {
  constructor(character: Character) {
    super("uniqueskill", "Unique Something", `DOOO THINGSSSS`, character);
  }

  public override activate(): void {
    this._character?.stats.addTempStats(
      [
        {
          statToModify: "potency",
          amount: 0.4,
          modifiedType: "additive",
        },
      ],
      this
    );

    this._character?.events.push({
      characterSourceId: this._character.uniqueId,
      eventType: "receiveDamage",
      callback: () => {},
    });
  }
}

const basicAbility = new Map([["basicskill", basicskill]]);

const specialAbilities = new Map([]);

const uniqueAbilities = new Map([["uniqueskill", uniqueskill]]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
