<template>
  <ProgressBar :percent="percent" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { Unit } from "../../types/unit";

export default defineComponent({
  name: "ShardProgressBar",
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
  },
  computed: {
    ...mapState("shards", ["ownedShards"]),
    ...mapGetters("shards", ["remainingShards"]),
    ownedAmount() {
      return this.ownedShards[this.unit.id]?.owned || 0;
    },
    percent() {
      const remaining = this.remainingShards(this.unit);
      const val = (this.ownedAmount / remaining) * 100;
      if (val >= 100) {
        return 100;
      } else {
        return val.toFixed(2);
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
