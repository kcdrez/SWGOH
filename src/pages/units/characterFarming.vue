<template>
  <div class="container swgoh-page">
    <ShardContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ShardContainer from "components/shards/shardTableContainer.vue";

export default defineComponent({
  name: "CharacterFarmingPage",
  components: { ShardContainer },
});
</script>

<style lang="scss" scoped></style>
