import { Character } from "../../characters/index";
import { iStatsCheck } from "../../characters/stats";
import { Unit } from "types/unit";

class GRANDMASTERLUKE extends Character {
  public ultCharge: number = 0;
  public keywords = ["reduce_massive_damage"];

  constructor(data: Unit, owner: string, isLeader?: boolean) {
    super(data, owner, isLeader);
  }

  public receiveDamage(
    damageType: "physical" | "special" | "true",
    damageAmount: number,
    armorPen: number,
    critChance: number,
    critDamage: number,
    stats?: iStatsCheck[] | undefined
  ): { isCrit: boolean; damageTotal: number } {
    return super.receiveDamage(
      damageType,
      damageAmount * 0.7,
      armorPen,
      critChance,
      critDamage,
      stats
    );
  }
}

export default GRANDMASTERLUKE;
