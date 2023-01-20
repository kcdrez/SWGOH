<template>
  <div>
    <div
      class="text-center gear-border"
      :class="`gear-tier-${gearData.tier}`"
      :title="gearData.name"
    >
      <div class="mark-level">{{ gearData.mark }}</div>
      <img :src="gearData.image" />
    </div>
    <div v-if="showName">{{ gearData.name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Gear } from "types/gear";

export default defineComponent({
  name: "GearIcon",
  props: {
    gear: {
      type: Object as () => Gear,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    gearId: {
      type: String,
    },
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    gearData(): Gear {
      if (this.gear) {
        return this.gear;
      } else if (this.gearId) {
        const match = this.gearList.find((x: Gear) => x.id === this.gearId);
        if (match) {
          return match;
        }
      }
      return this.gearList[0];
    },
  },
});
</script>

<style lang="scss" scoped>
.gear-border {
  border: 2px solid;
  max-width: 45px;
  margin: auto;
  position: relative;

  .mark-level {
    position: absolute;
    font-size: 0.5rem;
    text-align: right;
    width: 100%;
    padding-right: 0.1rem;
    text-shadow: 1px 1px 1px black;
  }

  img {
    max-width: 35px;
  }
}

.gear-tier {
  &-12 {
    border-color: #f1c752;
    background: radial-gradient(#997300, #000 80%);
  }
  &-11,
  &-7,
  &-9 {
    border-color: #844df1;
    background: radial-gradient(#4700a7, #000 80%);
  }
  &-4 {
    border-color: #51bcf6;
    background: radial-gradient(#004b65, #000 80%);
  }
  &-2 {
    border-color: #aff65b;
    background: radial-gradient(#4c9601, #000 80%);
  }
  &-1 {
    border-color: #97d2d3;
    background: radial-gradient(#4391a3, #000 80%);
  }
}

img {
  max-width: 40px;
}
</style>
