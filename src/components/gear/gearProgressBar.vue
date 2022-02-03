<template>
  <div class="progress">
    <div
      class="progress-bar bg-success progress-bar-striped"
      role="progressbar"
      :style="`width: ${percent}%`"
    ></div>
    <div class="progress-value">{{ percent }}%</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { Gear } from "../../types/gear";

export default defineComponent({
  name: "GearProgressBar",
  props: {
    gear: {
      type: Object as () => Gear,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("gear", ["gearOwnedCount"]),
    ownedAmount() {
      return this.gearOwnedCount(this.gear);
    },
    totalAmount() {
      return this.gear.amount;
    },
    percent() {
      const val = (this.ownedAmount / this.totalAmount) * 100;
      if (val >= 100) {
        return 100;
      } else {
        return val.toFixed(2);
      }
    },
  },
  methods: {},
  created() {},
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.progress {
  position: relative;
  text-align: center;
  height: 1.5rem;
}
.progress-value {
  position: absolute;
  right: 0;
  left: 0;
  color: $dark;
  font-size: 1rem;
}
</style>
