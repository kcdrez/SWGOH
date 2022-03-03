<template>
  <div class="container swgoh-page">
    <Error
      :state="requestState"
      message="An error occurred retrieving the player data."
    />
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <ShardContainer />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import ShardContainer from "../components/shards/shardTableContainer.vue";
import { loadingState } from "../types/loading";

export default defineComponent({
  name: "StarProgressionPage",
  components: { ShardContainer },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["shards", "planner", "unit"]);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
