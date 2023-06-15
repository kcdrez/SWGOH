<template>
  <span
    v-if="relicLevel >= 0"
    class="relic-level"
    :class="{
      'dark-side': alignment === 'Dark Side',
      'light-side': alignment === 'Light Side',
      neutral: alignment === 'Neutral',
      'relic-lg': size === 'lg',
    }"
    >{{ relicLevel }}</span
  >
</template>

<script lang="ts">
import { maxRelicLevel } from "types/relic";
import { defineComponent } from "vue";

export default defineComponent({
  name: "RelicIcon",
  props: {
    relicLevel: {
      type: Number,
      required: true,
      validator: (val: number) => {
        return val <= maxRelicLevel;
      },
    },
    alignment: {
      type: String,
      default: "Neutral",
      validator: (val: string) => {
        return ["Light Side", "Dark Side", "Neutral"].includes(val);
      },
    },
    size: {
      type: String,
      default: "md",
      validator: (val: string) => {
        return ["md", "lg"].includes(val);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.relic-level {
  background-image: url("../../images/relicAtlas.png");
  background-repeat: no-repeat;
  background-position: 0 -100px;
  height: 50px;
  width: 50px;
  background-size: 100%;
  color: #fff;
  font-size: 1rem;
  line-height: 3.25;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  text-align: center;
  &.dark-side {
    background-position: 0 -50px;
  }
  &.light-side {
    background-position: 0 0;
  }
  &.neutral {
    background-position: 0 -100px;
  }
}
</style>
