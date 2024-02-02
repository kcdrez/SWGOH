import { v4 as uuid } from "uuid";

import { Character } from "../../characters/index";
import { iStatsCheck, Stats } from "../../characters/stats";
import { Unit } from "types/unit";
import { Log } from "types/gameEngine/characters/log";
import { gameEngine } from "types/gameEngine/gameEngine";
import abilityList from "./abilities";

class GENERALSKYWALKER extends Character {
  constructor(data: Unit, owner: string, isLeader?: boolean) {
    super(data, owner, isLeader);

    let usedAbilityId: null | string = null;

    const abilityClass = abilityList.hiddenAbilities.get(
      "grantedability_GENERALSKYWALKER"
    );

    if (abilityClass) {
      this._hiddenAbilities.push(new abilityClass(this));
    }

    this.events.push(
      {
        eventType: "startOfTurn",
        characterSourceId: this.uniqueId,
        callback: () => {
          usedAbilityId = null;
        },
      },
      {
        eventType: "useAbility",
        characterSourceId: this.uniqueId,
        callback: ({ abilityId, target }) => {
          if (usedAbilityId) return;
          usedAbilityId = abilityId;

          const sourceAbility = this.activeAbilities.find(
            (x) => x.id === abilityId
          );

          if (abilityId === "basicskill_GENERALSKYWALKER") {
            const telekinesisAbility = this.hiddenAbilities.find(
              (ability) => ability.id === "grantedability_GENERALSKYWALKER"
            );

            telekinesisAbility?.execute(target, [], false);
          } else if (abilityId === "specialskill_GENERALSKYWALKER01") {
            const forceGripAbility = this.specialAbilities.find(
              (ability) => ability.id === "specialskill_GENERALSKYWALKER02"
            );

            if (sourceAbility) {
              forceGripAbility?.changeCooldown(-Infinity, sourceAbility, this);
              forceGripAbility?.execute(target, [], false);
            }
          } else if (abilityId === "specialskill_GENERALSKYWALKER02") {
            const sunderingStrikeAbility = this.specialAbilities.find(
              (ability) => ability.id === "specialskill_GENERALSKYWALKER01"
            );

            if (sourceAbility) {
              sunderingStrikeAbility?.changeCooldown(
                -Infinity,
                sourceAbility,
                this
              );
              sunderingStrikeAbility?.execute(target, [], false);
            }
          }
        },
      }
    );

    this.stats = new GENERALSKYWALKER_stats(data, this);
    this.statusEffect.addImmune(
      "cannot_be_targeted_in_cover",
      "Targeting",
      () => {
        return this.statusEffect.hasStatusEffect("Cover");
      }
    );
  }
}

class GENERALSKYWALKER_stats extends Stats {
  public override get speed() {
    if (this._character.statusEffect.hasStatusEffect("Cover")) {
      return 0;
    } else {
      return super.speed;
    }
  }

  public override loseHealth(amount: number, type?: "health" | "protection") {
    if (!this._character.isLeader) {
      super.loseHealth(amount, type);
      return;
    }

    if (this._character.statusEffect.hasStatusEffect("Cover")) {
      gameEngine.addLogs(
        new Log({
          character: this._character,
          ability: { source: this._character.leaderAbility },
          customMessage:
            "cannot lose health or protection due to being in Cover",
        })
      );
      return;
    }

    const hasOther501stAllies = this._character.teammates.some((ally) => {
      return (
        ally.hasTags("501st", this._character.id) &&
        !ally.isSelf(this._character) &&
        !ally.isDead
      );
    });

    if (hasOther501stAllies) {
      if (this._curProtection > 0) {
        if (amount > this._curProtection) {
          this._curProtection = 0;
          this._character.dispatchEvent("loseProtection");
        }
      }
    } else {
      super.loseHealth(amount, type);
    }
  }
}

export default GENERALSKYWALKER;
