<template>
  <div>
    <router-link
      v-if="isLink"
      :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
    >
      <img :src="unit?.image" :class="{ 'hide-on-mobile': hideImgOnMobile }" />
      <h5>{{ unit.name }}</h5></router-link
    >
    <template v-else>
      <img :src="unit?.image" :class="{ 'hide-on-mobile': hideImgOnMobile }" />
      <h4>{{ unit.name }}</h4>
      <slot />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Unit } from "../../types/unit";

export default defineComponent({
  name: "UnitIcon",
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
  },
});
</script>

<style lang="scss" scoped>
img {
  display: block;
  margin: auto;
  max-width: 120px;
}

h5 {
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
