<template>
  <div class="container swgoh-page">
    <Loading :state="requestState" message="Loading Data" size="lg">
      <div v-for="unit in glUnitList" :key="unit.id" class="mb-2">
        <div class="collapse-header section-header">
          <h3
            class="w-100"
            data-bs-toggle="collapse"
            :href="`#glTable${unit.id}`"
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
          :id="`glTable${unit.id}`"
          class="collapse"
          :ref="`glTable${unit.id}`"
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
import { mapState, mapActions, mapGetters } from "vuex";

import { initializeModules } from "../utils";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";
import LegendaryRequirementsTable from "../components/shards/tables/legendaryRequirementsTable.vue";

const dependencyModules = ["player", "unit", "shards"];
const storageKey = "glChecklist";

export default defineComponent({
  name: "GLChecklistPage",
  components: { LegendaryRequirementsTable },
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
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
    glUnitList(): Unit[] {
      return this.unitList.filter((unit: Unit) => {
        return !!unit.whereToFarm.find((x) => x.table === "Galactic Legends");
      });
    },
    cols() {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Requirements",
          value: "requirements",
        },
        {
          text: "Recommended",
          value: "recommended",
        },
      ];
    },
  },
  methods: {},
  watch: {
    simpleView: {
      handler(newVal) {
        window.localStorage.setItem(storageKey, JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  async created() {
    await initializeModules(dependencyModules);
    this.glUnitList.forEach((unit) => {
      this.simpleView[unit.id] = this.simpleView[unit.id] ?? true;
      (this.selectedColumns as any)[unit.id] =
        (this.selectedColumns as any)[unit.id] ?? [];
    });
  },
});
</script>

<style lang="scss" scoped></style>
