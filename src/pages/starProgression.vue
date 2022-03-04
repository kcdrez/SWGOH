<template>
  <div class="container swgoh-page">
    <Error
      :state="requestState"
      message="An error occurred retrieving the player data."
    />
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <LastUpdated />
      <ShardContainer />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

import ShardContainer from "../components/shards/shardTableContainer.vue";
import { loadingState } from "../types/loading";

const dependencyModules = ["shards", "planner", "unit", "guild"];

export default defineComponent({
  name: "StarProgressionPage",
  components: { ShardContainer },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
  },
  methods: {
    ...mapActions("guild", ["initialize"]),
  },
  async created() {
    dependencyModules.forEach((moduleName) => {
      this.$store.dispatch(`${moduleName}/initialize`);
    });
  },
});
</script>

<style lang="scss" scoped></style>
