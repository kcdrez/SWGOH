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

export default defineComponent({
  name: "ProgressBar",
  props: {
    percent: {
      type: [Number, String],
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

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
