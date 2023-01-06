<template>
  <div class="container swgoh-page">
    <template v-if="goalData">
      <!-- <UnitSection class="unit-section" :units="unitList" /> -->
      <GoalsTable
        :goal="goalData"
        :storageKey="storageKey + goalData.id + 'Table'"
        :simpleView="true"
      />
      <GearSection class="gear-section" :units="unitList" />
      <RelicSection class="relic-section" :units="unitList" />
    </template>
    <div v-else>Could not find a matching Goal</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import GearSection from "components/generalPlanner/gearSection.vue";
import RelicSection from "components/generalPlanner/relicSection.vue";
import GoalsTable from "components/shards/progress/goalsTable.vue";
import { Unit, getUnit } from "types/unit";
import { Goal } from "types/goals";
import { maxGearLevel } from "types/gear";

const storageKey = "goalDetailsPage";

export default defineComponent({
  name: "GoalsDetailsPage",
  components: {
    GoalsTable,
    GearSection,
    RelicSection,
  },
  data() {
    return {
      storageKey,
    };
  },
  computed: {
    ...mapState("player", ["player"]),
    goalData() {
      return this.player.goalList.find((goal: Goal) => {
        return (
          goal.name.replace(/\s/g, "").toLowerCase() ===
          (this.$route.params.goalName as string)
            .replace(/\s/g, "")
            .toLowerCase()
        );
      });
    },
    unitList(): Unit[] {
      return this.goalData.list.reduce((acc: Unit[], unit: any) => {
        const match = getUnit(unit.id);
        if (match) {
          if (unit.requirement.type === "Relic") {
            match.gearTarget = maxGearLevel;
            match.relicTarget = unit.requirement.value;
          } else if (unit.requirement.type === "Gear") {
            match.gearTarget = unit.requirement.value;
          }
          acc.push(match);
        }
        return acc;
      }, []);
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped></style>
