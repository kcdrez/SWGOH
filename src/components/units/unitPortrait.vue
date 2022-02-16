<template>
  <div class="unit-container" :class="size === 'lg' ? 'unit-container-lg' : ''">
    <div
      class="image-container"
      :class="{
        'dark-side': unit.alignment === 'Dark Side',
        'light-side': unit.alignment === 'Light Side',
      }"
    >
      <img :src="unit?.image" :alt="unit?.name" />
      <span class="gear-level" :class="`gear-level${unit.gear_level}`"></span>
      <span v-for="index in 7" :key="index" :class="starClasses(index)"></span>
      <span
        v-for="index in unit.stars"
        :key="index"
        :class="`star-level-${index}`"
      ></span>
      <RelicIcon
        v-if="unit.relic_tier"
        :relicLevel="unit.relic_tier"
        :size="size"
        :forceSide="unit.alignment"
      />
    </div>
    <div class="unit-name">{{ unit?.name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Unit } from "../../types/unit";
import RelicIcon from "./relicIcon.vue";

export default defineComponent({
  name: "UnitPortrait",
  components: { RelicIcon },
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>,
    },
    size: {
      type: String,
      default: "md",
    },
  },
  methods: {
    starClasses(index: number) {
      const classes = ["star-level"];
      if (index <= this.unit.stars) {
        classes.push("star-level-full", `star-level-${index}`);
      } else {
        classes.push("star-level-empty", `star-level-${index}`);
      }
      return classes;
    },
  },
});
</script>
  
<style lang="scss" scoped>
.unit-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;

  &.unit-container-lg {
    .image-container {
      img {
        width: 125px;
      }

      &.dark-side {
        .gear-level13 {
          background-position: 0 50%;
        }
      }

      .gear-level {
        &:not(.gear-level12) {
          top: 0;
          left: -9px;
          width: 115%;
        }

        &.gear-level13 {
          top: -16px;
          left: -27px;
          width: 140%;
          height: 115%;
        }
      }
    }
  }
  .image-container {
    position: relative;
    margin-bottom: 5px;

    img {
      height: 100%;
      width: 70px;
      max-width: 100%;
      border-radius: 100%;
    }

    .gear-level {
      top: -2px;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      position: absolute;
      display: block;
      background-size: 100%;
      background-position: 50%;

      &.gear-level1 {
        background-image: url("../../images/gear1.png");
      }
      &.gear-level2 {
        background-image: url("../../images/gear2.png");
      }
      &.gear-level3 {
        background-image: url("../../images/gear3.png");
      }
      &.gear-level4 {
        background-image: url("../../images/gear4.png");
      }
      &.gear-level5 {
        background-image: url("../../images/gear5.png");
      }
      &.gear-level6 {
        background-image: url("../../images/gear6.png");
      }
      &.gear-level7 {
        background-image: url("../../images/gear7.png");
      }
      &.gear-level8 {
        background-image: url("../../images/gear8.png");
      }
      &.gear-level9 {
        background-image: url("../../images/gear9.png");
      }
      &.gear-level10 {
        background-image: url("../../images/gear10.png");
      }
      &.gear-level11 {
        background-image: url("../../images/gear11.png");
      }
      &.gear-level12 {
        background-image: url("../../images/gear12.png");
      }
      &.gear-level13 {
        background-image: url("../../images/g13Atlas.png");
        top: -7px;
        left: -10px;
        width: 130%;
        height: 115%;
      }
    }

    &.dark-side {
      .gear-level13 {
        background-position: 0 -100%;
      }
    }
    &.light-side {
      .gear-level13 {
        background-position: 0 0;
      }
    }

    .star-level {
      bottom: 50%;
      left: 50%;
      display: block;
      width: 20%;
      height: calc(66% + 1px);
      background-repeat: no-repeat;
      transform-origin: center bottom;
      position: absolute;
      background-size: 100%;

      // &.star-level-empty {
      //   background-image: url("../../images/empty_star.png");
      // }
      &.star-level-full {
        background-image: url("../../images/star.png");
      }

      &.star-level-1 {
        transform: translateX(-50%) rotate(-60deg);
      }
      &.star-level-2 {
        transform: translateX(-50%) rotate(-40deg);
      }
      &.star-level-3 {
        transform: translateX(-50%) rotate(-20deg);
      }
      &.star-level-4 {
        transform: translateX(-50%) rotate(0deg);
      }
      &.star-level-5 {
        transform: translateX(-50%) rotate(20deg);
      }
      &.star-level-6 {
        transform: translateX(-50%) rotate(40deg);
      }
      &.star-level-7 {
        transform: translateX(-50%) rotate(60deg);
      }
    }

    ::v-deep(.relic-level) {
      position: absolute;
      bottom: -3%;
      right: -14%;
    }
  }
}
</style>