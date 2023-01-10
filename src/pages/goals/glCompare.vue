<template>
  <div class="container swgoh-page">
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead>
        <!-- <ColumnHeaders class="text-center align-middle" :headers="headers" /> -->
        <tr class="text-center align-middle">
          <th @click="sortBy('name')">
            <span>Unit Name</span>
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </th>
          <th v-for="gear in gearList" :key="gear.id" @click="sortBy(gear.id)">
            <GearIcon :gear="gear" class="d-inline-block" />
            <i class="fas mx-1" :class="sortIcon(gear.id)"></i>
          </th>
          <th
            v-for="relic in relicMapping"
            :key="relic.id"
            @click="sortBy(relic.id)"
          >
            <RelicIcon :item="relic" class="d-inline-block" />
            <i class="fas mx-1" :class="sortIcon(relic.id)"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in glUnitList" :key="unit.id">
          <td class="align-middle text-center">
            <UnitIcon :unit="unit" isLink hideImage />
          </td>
          <td
            class="align-middle text-center"
            v-for="gear in gearList"
            :key="gear.id"
          >
            {{ unit.getGearRequiredToUnlock(gear.id) }}
          </td>
          <td
            class="align-middle text-center"
            v-for="relic in relicMapping"
            :key="relic.id"
          >
            <div>
              {{ unit.getRelicsRequiredToUnlock(relic.id) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { setupSorting } from "utils";
import { Unit, getUnit } from "types/unit";
import { FarmingNode } from "types/shards";
import UnitIcon from "components/units/unitIcon.vue";
import RelicIcon from "components/relic/relicIcon.vue";
import GearIcon from "components/gear/gearIcon.vue";
import relicMapping from "types/relicMapping";
import { Gear, getGear } from "types/gear";
import { iHeader } from "types/general";

const storageKey = "glCompare";

export default defineComponent({
  name: "GLCompare",
  setup(props) {
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
  components: {
    UnitIcon,
    RelicIcon,
    GearIcon,
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
    headers(): iHeader[] {
      const gearHeaders: iHeader[] = this.gearList.map((gear: Gear) => {
        return {
          label: gear.name,
          show: this.showCol(gear.id),
          icon: this.sortIcon(gear.id),
          click: () => {
            this.sortBy(gear.id);
          },
        };
      });
      // const relicHeaders: iHeader[] = this.relicMapping.map((relic: Relic) => {
      //   return {
      //     label: relic.name,
      //     show: this.showCol(relic.id),
      //     icon: this.sortIcon(relic.id),
      //     click: () => {
      //       this.sortBy(relic.id);
      //     },
      //   };
      // });
      return [
        {
          label: "Unit Name",
          show: this.showCol("name"),
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        ...gearHeaders,
        // ...relicHeaders,
      ];
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
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod in relicMapping) {
            const compareA = a.getRelicsRequiredToUnlock(this.sortMethod);
            const compareB = b.getRelicsRequiredToUnlock(this.sortMethod);

            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else {
            const compareA = a.getGearRequiredToUnlock(this.sortMethod);
            const compareB = b.getGearRequiredToUnlock(this.sortMethod);

            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          }
        });
    },
    gearList(): Gear[] {
      return this.gearIds.map((x: string) => {
        return getGear(x);
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
