<template>
  <div class="container swgoh-page">
    <template v-if="goalData">
      <GoalsTable
        :goal="goalData"
        :storageKey="storageKey + goalData.id + 'Table'"
        :simpleView="true"
      />
    </template>
    <div v-else>Could not find a matching Goal</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import GoalsTable from "components/guild/goalsTable.vue";
import { totalProgress } from "types/unit";
import { Goal } from "types/goals";

const storageKey = "guildGoalDetailsPage";

export default defineComponent({
  name: "GuildGoalDetailsPage",
  components: {
    GoalsTable,
  },
  data() {
    return {
      storageKey,
    };
  },
  computed: {
    ...mapState("guild", ["goals"]),
    goalData(): Goal {
      return this.goals.find((goal: Goal) => {
        return (
          goal.name.replace(/\s/g, "").toLowerCase() ===
          (this.$route.params.goalName as string)
            .replace(/\s/g, "")
            .toLowerCase()
        );
      });
    },
  },
  methods: {
    totalProgress,
  },
});
</script>

<style lang="scss" scoped></style>
