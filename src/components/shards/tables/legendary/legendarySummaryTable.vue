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
              <ProgressBar
                :percent="totalProgress(unit.id ?? '', 'requirement')"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState } from "vuex";

import { setupEvents } from "utils";
import { totalProgress, getPrerequisites, Unit } from "types/unit";
import { IPrerequisite } from "types/shards";
import UnitIcon from "components/units/unitIcon.vue";

export default defineComponent({
  name: "GLChecklistPage",
  components: { UnitIcon },
  props: {
    unitList: {
      type: Array as PropType<(Unit | IPrerequisite)[]>,
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
      default: null,
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
      return totalProgress(getPrerequisites(unitId), prerequisiteType);
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
