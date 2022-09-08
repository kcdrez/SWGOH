<template>
  <div>
    <Popper hover arrow placement="right" v-if="'name' in unit && unit">
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
            :class="{ 'hidden-sm': hideImgOnMobile }"
          />
        </router-link>
        <template v-else>
          <span v-if="hideImage">{{ unit.name }}</span>
          <UnitPortrait
            v-else
            :unit="unit"
            :size="size"
            :class="{ 'hidden-sm': hideImgOnMobile }"
          />
          <slot />
        </template>
      </div>
    </Popper>
    <div v-else>
      {{ unit.id }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Unit } from "types/unit";
import { NodeCharacter } from "types/shards";
import UnitPortrait from "./unitPortrait.vue";

export default defineComponent({
  name: "UnitIcon",
  components: { UnitPortrait },
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit | NodeCharacter>,
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
h5 {
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>
