<template>
  <div>
    <RelicLevelIcon
      v-if="type === 'Relic'"
      class="m-auto"
      :relicLevel="value"
      :forceSide="getUnit(unitId).alignment"
    />
    <div v-else-if="type === 'Stars'" class="d-flex justify-content-center">
      <span>{{ value }}</span>
      <img src="images/star.png" class="mx-1" />
    </div>
    <GearText :level="value" v-else-if="type === 'Gear'" />
    <span v-else>{{ getRequirement(item) }} </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import RelicLevelIcon from "../../../units/relicLevelIcon.vue";
import GearText from "../../../gear/gearText.vue";

export default defineComponent({
  name: "RequirementIcon",
  components: {
    RelicLevelIcon,
    GearText,
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    unitId: {
      type: String,
      required: true,
    },
  },
  computed: {
    defaultText(): string {
      return `${this.type}: ${this.value}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.gear-border {
  border: 2px solid;
  max-width: 45px;
  margin: auto;

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
