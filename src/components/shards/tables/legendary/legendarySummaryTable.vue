<template>
  <div class="mb-2">
    <div class="collapse-header section-header">
      <h3 class="w-100" data-bs-toggle="collapse" :href="`#${storageKey}`">
        <div class="d-inline">{{ header }}</div>
      </h3>
    </div>
    <div :id="`${storageKey}`" class="collapse" :ref="`${storageKey}`">
      <table
        class="table table-bordered table-dark table-sm table-striped swgoh-table"
      >
        <thead>
          <tr class="text-center align-middle">
            <th>
              <span>Unit Name</span>
            </th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in unitList" :key="unit.id">
            <td class="align-middle text-center">
              <UnitIcon :unit="unit" isLink hideImage />
            </td>
            <td class="align-middle text-center">
              <ProgressBar :percent="totalProgress(unit.id, 'requirement')" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { setupEvents } from "../../../../utils";
import { totalProgress } from "../../../../types/unit";
import { FarmingNode } from "../../../../types/shards";
import UnitIcon from "../../../../components/units/unitIcon.vue";

export default defineComponent({
  name: "GLChecklistPage",
  components: { UnitIcon },
  props: {
    unitList: {
      type: Array,
      required: true,
    },
    header: {
      type: String,
      default: "Summary",
    },
    storageKey: {
      type: String,
      required: true,
    },
    nodeKey: {
      type: String,
      default: "legendary",
    },
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
  },
  methods: {
    totalProgress(
      unitId: string,
      prerequisiteType: "requirement" | "recommended"
    ): number {
      const x = this.getPrerequisites(unitId);
      return totalProgress(x, prerequisiteType);
    },
    getPrerequisites(unitId: string) {
      const legendaryUnits: FarmingNode = this.shardFarming.find(
        (x: FarmingNode) => x.id === this.nodeKey
      );
      return (
        legendaryUnits?.characters.find((x) => x.id === unitId)
          ?.prerequisites ?? []
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      setupEvents(
        this.$refs[`${this.storageKey}`] as HTMLElement,
        `${this.storageKey}`
      );
    });
  },
});
</script>
