<template>
  <div class="mod-icon">
    <!-- <img :src="`/images/mod_${shape}.png`" /> -->
    <span class="mod-text">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { Unit } from "@/types/unit";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "ModIcon",
  props: {
    unitId: {
      type: String,
      required: true,
    },
    shape: {
      type: String,
      validator(val: string) {
        return [
          "square",
          "circle",
          "arrow",
          "diamond",
          "triangle",
          "cross",
        ].includes(val);
      },
      required: true,
    },
  },
  computed: {
    ...mapGetters("teams", ["speedValueFromMod"]),
    ...mapGetters("player", ["unitData"]),
    value(): string {
      const unit: Unit = this.unitData(this.unitId);
      const mod = unit.mods[this.slotId];
      return this.speedValueFromMod(mod);
    },
    slotId(): number {
      switch (this.shape) {
        case "square":
        default:
          return 0;
        case "diamond":
          return 2;
        case "circle":
          return 4;
        case "arrow":
          return 1;
        case "triangle":
          return 3;
        case "cross":
          return 5;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.mod-icon {
  // background-size: contain;
  // background-repeat: no-repeat;
  // background-position: center;
  // min-width: 40px;
  // display: flex;
  // align-items: center;
  // max-height: 40px;

  // &.square {
  //   background-image: url("../../images/mod_square.png");
  // }
  // &.diamond {
  //   background-image: url("../../images/mod_diamond.png");
  // }
  // &.circle {
  //   background-image: url("../../images/mod_circle.png");
  // }
  // &.arrow {
  //   background-image: url("../../images/mod_arrow.png");
  // }
  // &.triangle {
  //   background-image: url("../../images/mod_triangle.png");
  // }
  // &.cross {
  //   background-image: url("../../images/mod_cross.png");
  // }
}

.mod-text {
  // position: relative;
  // font-size: 1.5rem;
  // text-shadow: 2px 2px 2px black;
  // -webkit-text-stroke: 1px black;
  // color: #0bc9cd;
  // font-weight: bold;
  // margin: auto;
}
img {
  max-width: 40px;
}
</style>
