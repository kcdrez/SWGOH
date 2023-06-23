<template>
  <div class="container swgoh-page">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="input-group input-group-sm">
            <input
              class="form-control form-control-sm"
              type="number"
              v-model.number="simulation.count"
              min="1"
              max="1000"
            />
            <button class="btn btn-sm btn-primary" @click="start()">
              Run the Simulations
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div v-for="character in team1">
            <h3>{{ character.name }}</h3>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Max Protection:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.maxProtection"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Max Health:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.maxHealth"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Speed:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.speed"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Damage:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.critDamage"
                min="1.5"
                step=".01"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Avoidance:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.critAvoid"
                min="0"
                step=".01"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.critAvoid"
                min="0"
                step=".01"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Offense:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.offense"
                min="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.offense"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Chance:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.critChance"
                min="0"
                step=".01"
                max="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.critChance"
                min="0"
                step=".01"
                max="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Defense:</span>
              <span class="input-group-text row-label">Armor:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.armor"
                min="1"
              />
              <span class="input-group-text row-label">Resistance:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.armor"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Armor Penetration:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.armorPen"
                min="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.armorPen"
                min="1"
              />
            </div>
          </div>
        </div>
        <div class="col">
          <div v-for="character in team2">
            <h3>{{ character.name }}</h3>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Max Protection:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.maxProtection"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Max Health:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.maxHealth"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Speed:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.speed"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Damage:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.critDamage"
                min="1.5"
                step=".01"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Avoidance:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.critAvoid"
                min="0"
                step=".01"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.critAvoid"
                min="0"
                step=".01"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Offense:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.offense"
                min="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.offense"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Crit Chance:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.critChance"
                min="0"
                step=".01"
                max="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.critChance"
                min="0"
                step=".01"
                max="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Defense:</span>
              <span class="input-group-text row-label">Armor:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.armor"
                min="1"
              />
              <span class="input-group-text row-label">Resistance:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.armor"
                min="1"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Armor Penetration:</span>
              <span class="input-group-text row-label">Physical:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.physical.armorPen"
                min="1"
              />
              <span class="input-group-text row-label">Special:</span>
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="character.special.armorPen"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div>Team 1 Wins: {{ simulation.team1Wins }}</div>
          <div>Team 2 Wins: {{ simulation.team2Wins }}</div>
          <ol>
            <li v-for="log in logs"><span v-html="log"></span></li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { v4 as uuid } from "uuid";

import { Team } from "types/teams";
import TeamTable from "components/teams/teamTable.vue";
import MatchTable from "components/teams/matchTable.vue";
import { randomNumber, unvue } from "utils";
import { random } from "lodash";
import abilities from "types/abilities";
import {
  team1,
  team2,
  Character,
  iStatusEffect,
  iAbility,
} from "types/characters";

interface dataModel {
  simulation: {
    count: number;
    team1Wins: number;
    team2Wins: number;
  };
  team1: Character[];
  team2: Character[];
  logs: string[];
}

export default defineComponent({
  name: "GameSimulationPage",
  data() {
    return {
      simulation: {
        count: 1,
        team1Wins: 0,
        team2Wins: 0,
      },
      team1,
      team2,
      logs: [],
    } as dataModel;
  },
  methods: {
    reset() {
      [...this.team1, ...this.team2].forEach((x) => x.reset());
      this.logs = [];
    },
    start() {
      this.simulation.team1Wins = 0;
      this.simulation.team2Wins = 0;
      this.simulation.count = Math.min(this.simulation.count, 1000);
      for (let i = 0; i < this.simulation.count; i++) {
        this.reset();
        let j = 0;
        do {
          j++;
          this.nextAction();
          const team1Lost = this.team1.every((x) => x.health <= 0);
          const team2Lost = this.team2.every((x) => x.health <= 0);
          if (team1Lost || team2Lost || j > 100) {
            const winner = team1Lost ? "Team 2" : "Team 1";
            this.logs.push(`Match ends: ${winner} is the winner!`);
            if (team1Lost) {
              this.simulation.team2Wins++;
            } else {
              this.simulation.team1Wins++;
            }
            break;
          }
        } while (true);
      }
    },
    nextAction() {
      const allChars: Character[] = [
        ...this.team1,
        ...this.team2,
      ] as Character[];

      const { character, tmAmount } = allChars.reduce(
        (acc: { tmAmount: number; character: null | Character }, char) => {
          if (!acc.character) {
            acc.character = char;
          } else {
            const results = acc.character.compareTm(char);
            acc.character = results.character;
            acc.tmAmount = results.amount;
          }

          return acc;
        },
        { tmAmount: 0, character: null }
      );

      if (character !== null) {
        allChars.forEach((char) => {
          char.turnMeter += (tmAmount / character.speed) * char.speed;
        });

        const opponents: Character[] =
          character.owner === "team1"
            ? (this.team2 as Character[])
            : (this.team1 as Character[]);

        this.logs.push(...character.takeAction(opponents));
      }
    },
    inflictEffects(character, ability, opponent) {
      ability.effects.forEach((effect) => {
        if (effect.condition) {
          if (effect.condition.debuffs) {
            const hasDebuff = opponent.debuffs.some((d) =>
              effect.condition.debuffs.includes(d.name)
            );
            if (!hasDebuff) {
              return;
            }
          }
        }
        character.inflictDebuffs(effect.actions, opponent);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

::v-deep(em) {
  color: $dark;
}
::v-deep(.damage) {
  color: $danger-dark-3;
}
::v-deep(.crit) {
  color: $success-dark-1;
}
::v-deep(.buff),
::v-deep(.debuff) {
  color: $primary-text-dark;
}
::v-deep(.ability) {
  color: $warning-dark-1;
}
::v-deep(.protection) {
  color: $gray-7;
}
::v-deep(.health) {
  color: $success-text-light;
}
</style>
