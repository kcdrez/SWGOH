<template>
  <ProgressBar :percent="percent" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Relic } from "../../types/relic";

export default defineComponent({
  name: "RelicProgressBar",
  props: {
    item: {
      type: Object as () => Relic,
      required: true,
    },
    amountNeeded: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState("relic", ["ownedRelics"]),
    ownedAmount() {
      return this.ownedRelics[this.item.id] || 0;
    },
    percent() {
      if (this.amountNeeded <= 0) {
        return 100;
      }

      const val = (this.ownedAmount / this.amountNeeded) * 100;
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
