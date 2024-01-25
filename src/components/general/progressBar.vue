<template>
  <div class="progress">
    <template v-if="valueList.length > 0">
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style="width: 15%"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
        <div
          class="progress-bar bg-success"
          role="progressbar"
          style="width: 30%"
          aria-valuenow="30"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
        <div
          class="progress-bar bg-info"
          role="progressbar"
          style="width: 20%"
          aria-valuenow="20"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </template>
    <template v-else>
      <div
        class="progress-bar bg-success progress-bar-striped"
        role="progressbar"
        :style="`width: ${percent}%`"
      ></div>
      <div class="progress-value">{{ percent }}%</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ProgressBar",
  props: {
    percent: {
      type: [Number, String],
      // required: true,
    },
    valueList: {
      type: [Array] as PropType<
        { value: number; label?: string; classes: string[] }[]
      >,
      default: () => {
        return [];
      },
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
