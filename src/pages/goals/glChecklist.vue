<template>
  <div class="container swgoh-page">
    <LegendarySummaryTable
      :unitList="glUnitList"
      :storageKey="storageKey + 'Summary'"
    />
    <div v-for="unit in glUnitList" :key="unit.id" class="mb-2">
      <div class="collapse-header section-header extended-2">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          :href="`#${storageKey}Collapse${unit.id}`"
        >
          <div class="d-inline">{{ unit.name ?? unit.id }}</div>
        </h3>
        <div class="toggles-container">
          <div class="simple-view-container">
            <Toggle
              v-model="simpleView[unit.id]"
              onLabel="Simple"
              offLabel="Advanced"
            />
          </div>
          <MultiSelect
            class="select-columns"
            :options="cols"
            :storageKey="storageKey + unit.id + 'Columns'"
            @checked="selectedColumns[unit.id] = $event"
          />
        </div>
      </div>
      <LegendaryRequirementsTable
        :id="`${storageKey}Collapse${unit.id}`"
        class="collapse mt-1"
        :ref="`${storageKey}Collapse${unit.id}`"
        :unit="unit"
        :selectedColumns="selectedColumns[unit.id] ?? []"
        :storageKey="storageKey + unit.id + 'Table'"
        :simpleView="simpleView[unit.id]"
        :nodeKey="unit.isGL ? 'galactic_legends' : 'legendary'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { setupEvents } from "utils";
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

      setupEvents(
        (this.$refs[`${storageKey}Collapse${unit.id}`] as any[])[0]
          ?.$el as HTMLElement,
        `${storageKey}Collapse${unit.id}`
      );
    });
  },
});
</script>

<style lang="scss" scoped>
.section-header {
  z-index: 1;
}
</style>
