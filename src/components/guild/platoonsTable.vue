<template>
  <SwgohTable :table="{ header, body }" />
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent, Ref, ref } from "vue";
import { mapActions, mapState } from "vuex";

import { loadingState } from "types/loading";
import { iTableBody, iTableHead } from "types/general";
import platoonData from "resources/tbPlatoons";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iGoalPlayer } from "types/goals";

interface dataModel {
  redundancyCoverageAmount: number;
}

type platoonType = {
  id: string;
  requirement: { amount: number; type: string };
  total: number;
  players: any[];
  closePlayerList: any[];
  difficulty: number;
};

const storageKey = "PlatoonsTable";

export default defineComponent({
  name: "PlatoonsTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } = setupSorting(
      storageKey + props.phase
    );

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  props: {
    phase: {
      required: true,
      type: [Number, String],
    },
    excludedPlayers: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      redundancyCoverageAmount: 3,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["players"]),
    platoonDataList(): platoonType[] {
      const phaseData = platoonData.find((x) => x.phase === this.phase);

      if (phaseData) {
        const characterList = [
          ...(phaseData.characters.darkside ?? []).map((x) => {
            return { ...x, alignment: "Dark Side" };
          }),
          ...(phaseData.characters.mixed ?? []).map((x) => {
            return { ...x, alignment: "Mixed" };
          }),
          ...(phaseData.characters.lightside ?? []).map((x) => {
            return { ...x, alignment: "Light Side" };
          }),
        ];

        const shipsList = [
          ...(phaseData.ships.darkside ?? []).map((x) => {
            return { ...x, alignment: "Dark Side", isShip: true };
          }),
          ...(phaseData.ships.mixed ?? []).map((x) => {
            return { ...x, alignment: "Mixed", isShip: true };
          }),
          ...(phaseData.ships.lightside ?? []).map((x) => {
            return { ...x, alignment: "Light Side", isShip: true };
          }),
        ];

        return [...characterList, ...shipsList].reduce(
          (acc: platoonType[], char: any) => {
            const exists: any = acc.find((x: any) => x.id === char.id);
            const requirement = char.isShip
              ? phaseData.ships.requirement
              : phaseData.characters.requirement;

            if (exists) {
              exists[char.alignment] = exists[char.alignment] ?? 0;
              exists[char.alignment] += char.amount;
              exists.total += char.amount;
              exists.closePlayerList = this.getClosePlayerList(
                char.id,
                requirement,
                exists.total +
                  this.redundancyCoverageAmount -
                  exists.players.length
              );
            } else {
              const playerList = this.getPlayerList(char.id, requirement);
              const closePlayerList = this.getClosePlayerList(
                char.id,
                requirement,
                char.amount + this.redundancyCoverageAmount - playerList.length //char.players.length - char.total
              );

              acc.push({
                ...char,
                [char.alignment]: char.amount,
                total: char.amount,
                players: playerList.map((x) => x.name),
                closePlayerList,
                requirement,
              });
            }
            return acc;
          },
          []
        );
      } else {
        return [];
      }
    },
    header(): iTableHead {
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
                label: "Unit",
                show: true, //this.showCol("unit"),
                icon: this.sortIcon("unit"),
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  value: this.searchText,
                  click: () => {
                    this.sortBy("unit");
                  },
                },
              },
              {
                label: "Requirements",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("total"),
                click: () => {
                  this.sortBy("total");
                },
              },
              {
                label: "Players",
                show: true, //this.showCol("requirements"),
              },
              {
                label: "Coverage",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("coverage"),
                click: () => {
                  this.sortBy("coverage");
                },
              },
              {
                label: "Redundancy",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("redundancy"),
                click: () => {
                  this.sortBy("redundancy");
                },
              },
              {
                label: "Closest Players",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("closest"),
                click: () => {
                  this.sortBy("closest");
                },
              },
              {
                label: "Difficulty",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("difficulty"),
                click: () => {
                  this.sortBy("difficulty");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      const fullList = this.platoonDataList
        .filter((platoon) => {
          const name = platoon.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a, b) => {
          if (this.sortMethod === "coverage") {
            return sortValues(
              a.players.length,
              b.players.length,
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod === "redundancy") {
            return sortValues(
              Math.max(a.players.length - a.total, 0),
              Math.max(b.players.length - b.total, 0),
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod === "closest") {
            return sortValues(
              Math.max(a.closePlayerList.length - a.total, 0),
              Math.max(b.closePlayerList.length - b.total, 0),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });

      return {
        classes: "align-middle text-center",
        rows: fullList.map((char) => {
          return {
            cells: [
              {
                show: true,
                type: "unit",
                classes: "align-middle",
                data: {
                  id: char.id,
                  isLink: false,
                  type: char.requirement.type,
                  level: char.requirement.amount,
                },
              },
              {
                show: true,
                type: "list",
                label: "Requirements Needed:",
                data: {
                  classes: "text-left",
                  list: [
                    {
                      message: `Dark Side: ${char["Dark Side"]}`,
                      hidden: !char["Dark Side"],
                    },
                    {
                      message: `Mixed: ${char["Mixed"]}`,
                      hidden: !char["Mixed"],
                    },
                    {
                      message: `Light Side: ${char["Light Side"]}`,
                      hidden: !char["Light Side"],
                    },
                    { message: `Total: ${char.total}` },
                  ],
                },
              },
              {
                show: true,
                type: "list",
                label: "Players Completed:",
                data: {
                  classes: "mb-0 text-left player-list",
                  list: char.players.map((x) => {
                    return { message: x, id: x };
                  }),
                },
              },
              {
                show: true,
                data: {
                  message: `Completed: ${char.players.length}`,
                  classes:
                    char.players.length < char.total
                      ? "text-danger"
                      : "text-success",
                },
              },
              {
                show: true,
                data: {
                  classes:
                    char.players.length <
                    char.total + this.redundancyCoverageAmount
                      ? "text-warning"
                      : "text-success",
                  message: `Redundant Coverage: ${Math.max(
                    char.players.length - char.total,
                    0
                  )}`,
                },
              },
              {
                show: true,
                type: "list",
                label: "Players Closest to Completion:",
                data: {
                  classes: "mb-0 text-left player-list",
                  list: char.closePlayerList.map((player) => {
                    return {
                      message: `${player.name} (${player.levelType} ${player.levelValue})`,
                    };
                  }),
                },
              },
              {
                show: true,
                label: "Difficulty Rating:",
                data: {
                  message: char.difficulty,
                },
              },
            ],
          };
        }),
      };
    },
  },
  methods: {
    getPlayerList(
      unitId: string,
      requirement: { amount: number; type: string }
    ) {
      return this.players
        .reduce((list: iGoalPlayer[], player: iGoalPlayer) => {
          const match = player.units.find((x) => x.base_id === unitId);
          const shouldExclude = this.excludedPlayers.some(
            (playerName) => playerName === player.name
          );
          if (match && !shouldExclude) {
            if (requirement.type === "Stars") {
              if (match.stars >= requirement.amount) {
                list.push(player);
              }
            } else if (requirement.type === "Relic") {
              if (match.relic_tier >= requirement.amount) {
                list.push(player);
              }
            }
          }
          return list;
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    getClosePlayerList(
      unitId: string,
      requirement: { amount: number; type: string },
      totalNeeded: number
    ) {
      const playerList: {
        name: string;
        levelType: string;
        levelValue: number;
      }[] = [];
      let i = 0;
      do {
        const player: iGoalPlayer = this.players[i];

        if (!player) {
          break;
        }

        const unitMatch = player.units.find((x) => x.base_id === unitId);
        const shouldExclude = this.excludedPlayers.some(
          (playerName) => playerName === player.name
        );
        if (unitMatch && !shouldExclude) {
          if (requirement.type === "Stars") {
            if (unitMatch.stars < requirement.amount) {
              if (totalNeeded > playerList.length) {
                playerList.push({
                  name: player.name,
                  levelType: "Stars",
                  levelValue: unitMatch.stars,
                });
              } else {
                const index = playerList.findIndex((p) => {
                  return unitMatch.stars > p.levelValue;
                });
                if (index >= 0) {
                  playerList.splice(0, index, {
                    name: player.name,
                    levelType: "Stars",
                    levelValue: unitMatch.stars,
                  });
                }
              }
            }
          } else if (requirement.type === "Relic") {
            if (unitMatch.relic_tier < requirement.amount) {
              if (totalNeeded > playerList.length) {
                if (unitMatch.relic_tier <= 0) {
                  playerList.push({
                    name: player.name,
                    levelType: "Gear",
                    levelValue: unitMatch.gear_level,
                  });
                } else {
                  playerList.push({
                    name: player.name,
                    levelType: "Relic",
                    levelValue: unitMatch.relic_tier,
                  });
                }
              } else {
                const index = playerList.findIndex((p) => {
                  if (p.levelType === "Relic") {
                    return unitMatch.relic_tier > p.levelValue;
                  } else if (p.levelType === "Gear") {
                    return unitMatch.relic_tier > 0
                      ? true
                      : unitMatch.gear_level > p.levelValue;
                  }
                });

                if (index >= 0) {
                  let levelType = "Relic";
                  let levelValue = unitMatch.relic_tier;
                  if (playerList[index].levelType === "Gear") {
                    levelType = unitMatch.relic_tier > 0 ? "Relic" : "Gear";
                    levelValue =
                      unitMatch.relic_tier > 0
                        ? unitMatch.relic_tier
                        : unitMatch.gear_level;
                  }

                  playerList.splice(index, 1, {
                    name: player.name,
                    levelType,
                    levelValue,
                  });
                }
              }
            }
          }
        }
        i++;
      } while (i < this.players.length);

      return playerList.sort((a, b) => {
        if (a.levelType === b.levelType) {
          return a.levelValue > b.levelValue ? -1 : 1;
        } else if (a.levelType === "Relic") {
          return -1;
        } else if (b.levelType === "Relic") {
          return 1;
        } else {
          return a.name > b.name ? 1 : -1;
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
:deep(.player-list) {
  overflow: scroll;
  max-height: 300px;
}
</style>
