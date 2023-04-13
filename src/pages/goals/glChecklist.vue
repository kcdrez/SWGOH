<template>
  <div class="container swgoh-page">
    <LegendarySummaryTable
      :unitList="glUnitList"
      :storageKey="storageKey + 'Summary'"
      class="mb-2"
    />
    <ExpandableSection
      v-for="unit in glUnitList"
      :key="unit.id"
      class="mb-2"
      :title="unit.name ?? unit.id"
      :idRef="getIdRef(unit.id)"
      :options="expandOptions[unit.id]"
    >
      <LegendaryRequirementsTable
        class="mt-1"
        :unit="unit"
        :selectedColumns="selectedColumns[unit.id] ?? []"
        :storageKey="getIdRef(unit.id) + 'Table'"
        :simpleView="simpleView[unit.id]"
        :nodeKey="unit.isGL ? 'galactic_legends' : 'legendary'"
      />
    </ExpandableSection>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Unit } from "types/unit";
import { NodeCharacter, FarmingNode } from "types/shards";
import LegendaryRequirementsTable from "components/shards/tables/legendary/legendaryRequirementsTable.vue";
import LegendarySummaryTable from "components/shards/tables/legendary/legendarySummaryTable.vue";

const storageKey = "glChecklist";

export default defineComponent({
  name: "GLChecklistPage",
  components: { LegendaryRequirementsTable, LegendarySummaryTable },
  data() {
    return {
      storageKey,
      selectedColumns: {},
      simpleView: JSON.parse(window.localStorage.getItem(storageKey) || "{}"),
    } as any;
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    glUnitList(): (Unit | NodeCharacter)[] {
      return this.shardFarming.reduce(
        (characterList: (Unit | NodeCharacter)[], node: FarmingNode) => {
          if (node.id === "legendary" || node.id === "galactic_legends") {
            node.characters.forEach((char) => {
              const playerUnit = this.player.units.find(
                (u: Unit) => u.id === char.id
              );
              if (playerUnit) {
                if (
                  (playerUnit.isGL && !playerUnit.hasUlt) ||
                  playerUnit.stars < 7
                ) {
                  characterList.push(playerUnit);
                }
              } else {
                const unownedUnit = this.unitList.find(
                  (x: Unit) => x.id === char.id
                );
                if (unownedUnit) {
                  characterList.push(unownedUnit);
                } else {
                  characterList.push(char);
                }
              }
            });
          }
          return characterList;
        },
        []
      );
    },
    cols(): { label: string; value: any }[] {
      return [
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Current Level",
          value: "current",
        },
        {
          label: "Requirements",
          value: "requirements",
        },
        {
          label: "Progress",
          value: "progress",
        },
      ];
    },
    expandOptions(): any {
      return this.glUnitList.reduce((acc: any, unit: Unit) => {
        acc[unit.id] = {
          toggle: {
            change: (val: boolean) => {
              this.simpleView[unit.id] = val;
            },
            value: this.simpleView[unit.id],
            onLabel: "Simple",
            offLabel: "Advanced",
          },
          multiSelect: {
            options: this.cols,
            change: (newVal: string[]) => {
              this.selectedColumns[unit.id] = newVal;
            },
          },
        };
        return acc;
      }, {});
    },
  },
  methods: {
    getIdRef(unitId: string): string {
      return `${storageKey}${unitId}`;
    },
  },
  watch: {
    simpleView: {
      handler(newVal) {
        window.localStorage.setItem(storageKey, JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  mounted() {
    this.glUnitList.forEach((unit: Unit) => {
      this.simpleView[unit.id] = this.simpleView[unit.id] ?? true;

      (this.selectedColumns as any)[unit.id] =
        (this.selectedColumns as any)[unit.id].filter(
          (x: string) => x !== "recommended"
        ) ?? [];
    });
  },
});
</script>

<style lang="scss" scoped>
.section-header {
  z-index: 1;
}
</style>
