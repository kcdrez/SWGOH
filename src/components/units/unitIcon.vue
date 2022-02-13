<template>
  <div>
    <router-link
      v-if="isLink"
      :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
    >
      <UnitPortrait :unit="unit" :size="size" />
    </router-link>
    <template v-else>
      <UnitPortrait
        :unit="unit"
        :size="size"
        :class="{ 'hide-on-mobile': hideImgOnMobile }"
      />
      <slot />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Unit } from "../../types/unit";
import UnitPortrait from "./unitPortrait.vue";

export default defineComponent({
  name: "UnitIcon",
  components: { UnitPortrait },
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>,
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    hideImgOnMobile: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
    },
  },
});
</script>

<style lang="scss" scoped>
// img {
//   display: block;
//   margin: auto;
//   max-width: 120px;
// }

h5 {
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
