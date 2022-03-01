<template>
  <span :class="`gear-text gear-text-${level}`">{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GearText",
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
  computed: {
    text() {
      const curLevelText = "Gear Lvl ";
      switch (this.level) {
        case 0:
        default:
          return curLevelText + "0";
        case 1:
          return curLevelText + "I";
        case 2:
          return curLevelText + "II";
        case 3:
          return curLevelText + "III";
        case 4:
          return curLevelText + "IV";
        case 5:
          return curLevelText + "V";
        case 6:
          return curLevelText + "VI";
        case 7:
          return curLevelText + "VII";
        case 8:
          return curLevelText + "VIII";
        case 9:
          return curLevelText + "IX";
        case 10:
          return curLevelText + "X";
        case 11:
          return curLevelText + "XI";
        case 12:
          return curLevelText + "XII";
        case 13:
          return curLevelText + "XIII";
      }
    },
  },
});
</script>

<style lang="scss">
.gear-text {
  text-shadow: 1px 1px 3px black;
}
.gear-text-0,
.gear-text-1 {
  color: #8dacac;
}
.gear-text-2,
.gear-text-3 {
  color: #8fdd3b;
}
.gear-text-4,
.gear-text-5,
.gear-text-6 {
  color: #02a1da;
}
.gear-text-7,
.gear-text-8,
.gear-text-9,
.gear-text-10,
.gear-text-11 {
  color: #8d41e9;
}
.gear-text-12 {
  color: #efc23c;
}
.gear-text-13 {
  color: #c74917;
}
</style>
