<template>
  <div class="container swgoh-page">
    <Loading :state="requestState" message="Loading Data" size="lg">
      <LegendarySummaryTable
        :unitList="glUnitList"
        :storageKey="storageKey + 'Summary'"
        nodeKey="galactic_legends"
      />
      <div v-for="unit in glUnitList" :key="unit.id" class="mb-2">
        <div class="collapse-header section-header">
          <h3
            class="w-100"
            data-bs-toggle="collapse"
            :href="`#${storageKey}Collapse${unit.id}`"
          >
            <div class="d-inline">{{ unit.name }}</div>
          </h3>
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
        <LegendaryRequirementsTable
          :id="`${storageKey}Collapse${unit.id}`"
          class="collapse mt-1"
          :ref="`${storageKey}Collapse${unit.id}`"
          :unit="unit"
          :selectedColumns="selectedColumns[unit.id] ?? []"
          :storageKey="storageKey + unit.id + 'Table'"
          :simpleView="simpleView[unit.id]"
          nodeKey="galactic_legends"
        />
      </div>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import { initializeModules, setupEvents } from "../utils";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";
import LegendaryRequirementsTable from "../components/shards/tables/legendary/legendaryRequirementsTable.vue";
import LegendarySummaryTable from "../components/shards/tables/legendary/legendarySummaryTable.vue";

const dependencyModules = ["player", "unit", "shards"];
const storageKey = "glChecklist";

export default defineComponent({
  name: "GLChecklistPage",
  components: { LegendaryRequirementsTable, LegendarySummaryTable },
  data() {
    return {
      storageKey,
      selectedColumns: {},
      simpleView: JSON.parse(window.localStorage.getItem(storageKey) || "{}"),
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("unit", ["unitList"]),
    ...mapState("player", ["player"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
    glUnitList(): Unit[] {
      return this.unitList.filter((unit: Unit) => {
        const isGL = !!unit.whereToFarm.find(
          (x) => x.table === "Galactic Legends"
        );
        if (isGL) {
          const playerUnit = this.player.units.find(
            (u: Unit) => u.id === unit.id
          );

          return playerUnit ? playerUnit.stars < 7 : true;
        }
        return false;
      });
    },
    cols() {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Current Level",
          value: "current",
        },
        {
          text: "Requirements",
          value: "requirements",
        },
        {
          text: "Progress",
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
    glUnitList(newVal) {
      this.$nextTick(() => {
        newVal.forEach((unit: Unit) => {
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
      });
    },
  },
  async created() {
    await initializeModules(dependencyModules);
  },
});
</script>

<style lang="scss" scoped></style>
