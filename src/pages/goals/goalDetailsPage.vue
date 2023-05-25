<template>
  <div class="container swgoh-page">
    <template v-if="goalData">
      <GoalsTable
        :goal="goalData"
        :storageKey="storageKey + goalData.id + 'Table'"
        :simpleView="true"
      />
      <TimelineTable
        :goal="goalData"
        :storageKey="'TimelineTable' + goalData.id"
        :prerequisites="prerequisites"
      />
      <!-- <GearSection
        class="gear-section"
        :units="prerequisites.list"
        :gearTargets="prerequisites.gearTargets"
      />
      <RelicSection
        class="relic-section mb-2"
        :units="prerequisites.list"
        :relicTargets="prerequisites.relicTargets"
      /> -->
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
import TimelineTable from "components/shards/progress/timelineTable.vue";
import { Unit, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import { maxGearLevel } from "types/gear";
import { IPrerequisite } from "types/shards";

const storageKey = "goalDetailsPage";

export default defineComponent({
  name: "GoalsDetailsPage",
  components: {
    GoalsTable,
    GearSection,
    RelicSection,
    TimelineTable,
  },
  data() {
    return {
      storageKey,
    };
  },
  computed: {
    ...mapState("player", ["player"]),
    goalData(): Goal {
      return this.player.goalList.find((goal: Goal) => {
        return (
          goal.name.replace(/\s/g, "").toLowerCase() ===
          (this.$route.params.goalName as string)
            .replace(/\s/g, "")
            .toLowerCase()
        );
      });
    },
    prerequisites(): { list: Unit[]; relicTargets: any; gearTargets: any } {
      return this.goalData.list.reduce(
        (
          acc: { list: Unit[]; relicTargets: any; gearTargets: any },
          x: IPrerequisite
        ) => {
          const match = getUnit(x?.id ?? "");
          if (match && !match.isShip) {
            match.relicTarget = x.requirement?.value ?? 0;
            acc.list.push(match);
            if (x.requirement?.type === "Relic") {
              acc.relicTargets[match.id] = x.requirement.value;
              acc.gearTargets[match.id] = maxGearLevel;
            } else if (x.requirement?.type === "Gear") {
              acc.gearTargets[match.id] = x.requirement.value;
            } else {
              acc.relicTargets[match.id] = 0;
              acc.gearTargets[match.id] = 0;
            }
          }
          return acc;
        },
        { list: [], relicTargets: {}, gearTargets: {} }
      );
    },
  },
  methods: {
    totalProgress,
  },
});
</script>

<style lang="scss" scoped></style>
