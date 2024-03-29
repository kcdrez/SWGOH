<template>
  <div class="container swgoh-page">
    <SwgohTable :table="glTable" />
    <SwgohTable :table="legendaryTable" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { setupSorting, sortValues } from "utils";
import { Unit, getUnit } from "types/unit";
import { FarmingNode, IPrerequisite, NodeCharacter } from "types/shards";
import relicMapping from "types/relicMapping";
import { Gear, getGear } from "types/gear";
import { iHeaderCell, iTable, iTableCell } from "types/general";
import { Relic } from "types/relic";

const storageKey = "glCompare";

export default defineComponent({
  name: "GLCompare",
  setup() {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(
      `${storageKey}`
    );

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
    };
  },
  data() {
    return {
      storageKey,
      relicMapping,
      gearIds: ["108Salvage", "172Salvage", "173Salvage"],
    } as any;
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    glTable(): iTable {
      const gearHeaderColumns: iHeaderCell[] = this.gearList.map(
        (gear: Gear | string) => {
          if (typeof gear === "string") {
            return {
              click: () => {
                this.sortBy(gear);
              },
              icon: this.sortIcon(gear),
              value: gear,
              show: true,
              label: gear,
            };
          } else {
            return {
              click: () => {
                this.sortBy(gear.id);
              },
              input: { type: "gear" },
              data: { gear },
              icon: this.sortIcon(gear.id),
              value: gear.id,
              show: true,
            };
          }
        }
      );
      const relicList = Object.values(this.relicMapping) as Relic[];
      const relicHeaders: iHeaderCell[] = relicList.map((relic: Relic) => {
        return {
          input: { type: "relic" },
          data: { relic },
          show: true,
          icon: this.sortIcon(relic.id),
          click: () => {
            this.sortBy(relic.id);
          },
        };
      });

      return {
        header: {
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
                  label: "Unit Name",
                  show: true,
                  icon: this.sortIcon("name"),
                  value: "name",
                  click: () => {
                    this.sortBy("name");
                  },
                },
                ...gearHeaderColumns,
                ...relicHeaders,
              ],
            },
          ],
        },
        body: {
          classes: "text-center align-middle",
          rows: this.glUnitList.map((unit: Unit) => {
            const gearCells: iTableCell[] = this.gearList.map((gear: Gear) => {
              return {
                show: true,
                data: unit.getGearRequiredToUnlock(gear.id),
              };
            });
            const relicCells: iTableCell[] = relicList.map((relic: Relic) => {
              return {
                show: true,
                data: unit.getRelicsRequiredToUnlock(relic.id),
              };
            });

            return {
              cells: [
                {
                  data: { unit },
                  type: "unit",
                  show: true,
                },
                ...gearCells,
                ...relicCells,
              ],
            };
          }),
        },
      };
    },
    legendaryTable(): iTable {
      const gearHeaderColumns: iHeaderCell[] = this.gearList.map(
        (gear: Gear | string) => {
          if (typeof gear === "string") {
            return {
              click: () => {
                this.sortBy(gear);
              },
              icon: this.sortIcon(gear),
              value: gear,
              show: true,
              label: gear,
            };
          } else {
            return {
              click: () => {
                this.sortBy(gear.id);
              },
              input: { type: "gear" },
              data: { gear },
              icon: this.sortIcon(gear.id),
              value: gear.id,
              show: true,
            };
          }
        }
      );
      const relicList = Object.values(this.relicMapping) as Relic[];
      const relicHeaders: iHeaderCell[] = relicList.map((relic: Relic) => {
        return {
          input: { type: "relic" },
          data: { relic },
          show: true,
          icon: this.sortIcon(relic.id),
          click: () => {
            this.sortBy(relic.id);
          },
        };
      });

      return {
        header: {
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
                  label: "Unit Name",
                  show: true,
                  icon: this.sortIcon("name"),
                  value: "name",
                  click: () => {
                    this.sortBy("name");
                  },
                },
                ...gearHeaderColumns,
                ...relicHeaders,
              ],
            },
          ],
        },
        body: {
          classes: "text-center align-middle",
          rows: this.legendaryUnitList.map((unit: Unit) => {
            const gearCells: iTableCell[] = this.gearList.map((gear: Gear) => {
              return {
                show: true,
                data: unit.getGearRequiredToUnlock(gear.id),
              };
            });
            const relicCells: iTableCell[] = relicList.map((relic: Relic) => {
              return {
                show: true,
                data: unit.getRelicsRequiredToUnlock(relic.id),
              };
            });

            return {
              cells: [
                {
                  data: { unit },
                  type: "unit",
                  show: true,
                },
                ...gearCells,
                ...relicCells,
              ],
            };
          }),
        },
      };
    },
    glUnitList(): Unit[] {
      return this.shardFarming
        .reduce((characterList: Unit[], node: FarmingNode) => {
          if (node.id === "galactic_legends") {
            node.characters.forEach((char) => {
              const unit = getUnit(char.id);
              if (unit) {
                if (unit.isGL) {
                  characterList.push(unit);
                }
              }
            });
          }
          return characterList;
        }, [])
        .sort((a: Unit, b: Unit) => {
          if (this.sortMethod in relicMapping) {
            return sortValues(
              a.getRelicsRequiredToUnlock(this.sortMethod),
              b.getRelicsRequiredToUnlock(this.sortMethod),
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod !== "name") {
            return sortValues(
              a.getGearRequiredToUnlock(this.sortMethod),
              b.getGearRequiredToUnlock(this.sortMethod),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    legendaryUnitList(): Unit[] {
      return this.shardFarming
        .reduce((characterList: Unit[], node: FarmingNode) => {
          if (node.id === "legendary") {
            node.characters.forEach((char) => {
              const unit = getUnit(char.id);
              const requiresRelics = char.prerequisites?.some(
                (x) => x.requirement?.type === "Relic"
              );
              if (unit && requiresRelics) {
                characterList.push(unit);
              }
            });
          }
          return characterList;
        }, [])
        .sort((a: Unit, b: Unit) => {
          if (this.sortMethod in relicMapping) {
            return sortValues(
              a.getRelicsRequiredToUnlock(this.sortMethod),
              b.getRelicsRequiredToUnlock(this.sortMethod),
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod !== "name") {
            return sortValues(
              a.getGearRequiredToUnlock(this.sortMethod),
              b.getGearRequiredToUnlock(this.sortMethod),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    gearList(): Gear[] {
      return this.gearIds.map((x: string) => {
        return getGear(x) ?? x;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.section-header {
  z-index: 1;
}
</style>
