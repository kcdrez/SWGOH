<template>
  <span
    v-if="relicLevel >= 0"
    class="relic-level"
    :class="{
      'dark-side': forceSide === 'Dark Side',
      'light-side': forceSide === 'Light Side',
      'relic-lg': size === 'lg',
    }"
    >{{ relicLevel }}</span
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RelicIcon",
  props: {
    relicLevel: {
      type: Number,
      required: true,
    },
    forceSide: {
      type: String,
      default: "Light Side",
    },
    size: {
      type: String,
      default: "md",
    },
  },
});
</script>
  
<style lang="scss" scoped>
.relic-level {
  background-image: url("../../images/relicAtlas.png");
  background-repeat: no-repeat;
  background-position: 0 0;
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
    background-position: 0 -100%;
  }
  &.light-side {
    background-position: 0 0;
  }
}
</style>