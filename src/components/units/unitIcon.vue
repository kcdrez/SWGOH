<template>
  <div v-if="unit">
    <Popper hover arrow placement="right" v-if="'name' in unit">
      <template #content v-if="hideImage">
        <UnitPortrait
          :unit="unit"
          :size="size"
          showGearLevel
          :level="level"
          :type="type"
        />
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
            :level="level"
            :type="type"
          />
        </router-link>
        <template v-else>
          <span v-if="hideImage">{{ unit.name }}</span>
          <UnitPortrait
            v-else
            :unit="unit"
            :size="size"
            :class="{ 'hidden-sm': hideImgOnMobile }"
            :level="level"
            :type="type"
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
import { defineComponent } from "vue";

import { Unit } from "types/unit";
import { NodeCharacter } from "types/shards";
import UnitPortrait from "./unitPortrait.vue";

export default defineComponent({
  name: "UnitIcon",
  components: { UnitPortrait },
  props: {
    unit: {
      required: true,
      type: Object as () => Unit | NodeCharacter | undefined,
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
    type: {
      type: String,
      default: null,
      validator(val) {
        return val === "Relic" || val === "Gear" || val === "Stars";
      },
    },
    level: {
      type: Number,
      default: null,
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
