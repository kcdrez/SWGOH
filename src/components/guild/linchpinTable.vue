<template>
  <SwgohTable :table="{ header: linchpinHeader, body: linchpinBody }" />
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { iTableBody, iTableHead } from "types/general";
import {
  characterMapping,
  CharacterMapping,
  platoonData,
} from "resources/tbPlatoons";
import { setupSorting, sortValues, unvue } from "utils";
import { iGoalPlayer, iGoalUnit } from "types/goals";
import { maxRelicLevel } from "types/relic";

const storageKey = "Linchpins";

export default defineComponent({
  name: "LinchpinsTable",
  setup(_props: any) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("guild", ["players"]),
    playerData(): { name: string; units: iGoalUnit[]; phaseMapping: any }[] {
      return this.players
        .filter((player: iGoalPlayer) => {
          const name = player.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .map((player) => {
          return {
            ...player,
            units: player.units.filter((unit) => this.isLinchpin(unit)),
          };
        })
        .sort((a: any, b: any) => {
          if (this.sortMethod === "player") {
            return sortValues(a.name, b.name, this.sortDir, this.sortMethod);
          } else if (this.sortMethod === "linchpins") {
            return sortValues(
              a.units.length,
              b.units.length,
              this.sortDir,
              this.sortMethod
            );
          }
          return 0;
        });
    },
    linchpinHeader(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Player",
                show: true,
                icon: this.sortIcon("player"),
                sortMethodShow: true,
                value: "player",
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  label: "Player Name",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  value: this.searchText,
                  click: () => {
                    this.sortBy("player");
                  },
                },
              },
              {
                show: true,
                label: "Linchpins",
                sortMethodShow: true,
                value: "linchpins",
                click: () => {
                  this.sortBy("linchpins");
                },
                icon: this.sortIcon("linchpins"),
              },
            ],
          },
        ],
      };
    },
    linchpinBody(): iTableBody {
      return {
        classes: "align-middle",
        rows: this.playerData.map((player) => {
          return {
            cells: [
              {
                show: true,
                data: player.name,
                classes: "text-center",
              },
              {
                show: true,
                type: "list",
                data: {
                  classes: "text-left mb-0",
                  list: player.units.map((unit) => {
                    return {
                      message: `${unit.name} (Relic ${unit.relic_tier})`,
                      id: `${player.name}-${unit.name}`,
                    };
                  }),
                },
              },
            ],
          };
        }),
      };
    },
    coverage(): CharacterMapping {
      return this.players.reduce(
        (acc: CharacterMapping, player: iGoalPlayer) => {
          player.units.forEach((unit) => {
            if (acc[unit.base_id]) {
              if (acc[unit.base_id][unit.relic_tier]) {
                acc[unit.base_id][unit.relic_tier].coverage++;
              } else if (unit.relic_tier > 0) {
                acc[unit.base_id][unit.relic_tier] = {
                  coverage: 1,
                  requirements: 0,
                };
              }
            }
          });
          return acc;
        },
        unvue(characterMapping)
      );
    },
  },
  methods: {
    isLinchpin(unit: iGoalUnit): boolean {
      const unitMatch = this.coverage[unit.base_id];
      if (unitMatch) {
        let totalCoverage = 0;
        for (let i = maxRelicLevel; i > 0; i--) {
          if (unitMatch[i]) {
            const { requirements, coverage } = unitMatch[i];
            totalCoverage += coverage;

            if (
              requirements > 0 &&
              totalCoverage <= requirements + 1 &&
              unit.relic_tier >= i
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
