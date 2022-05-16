<template>
  <Popper hover arrow placement="right">
    <template #content v-if="hideImage">
      <UnitPortrait :unit="unit" :size="size" showGearLevel />
    </template>
    <div>
      <router-link
        v-if="isLink"
        :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
      >
        <span v-if="hideImage">{{ unit.name }}</span>
        <UnitPortrait
          v-else
          :unit="unit"
          :size="size"
          :class="{ 'hide-on-mobile': hideImgOnMobile }"
        />
      </router-link>
      <template v-else>
        <span v-if="hideImage">{{ unit.name }}</span>
        <UnitPortrait
          v-else
          :unit="unit"
          :size="size"
          :class="{ 'hide-on-mobile': hideImgOnMobile }"
        />
        <slot />
      </template>
    </div>
  </Popper>
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
    hideImage: {
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
