<template>
  <div class="d-flex">
    <RelicLevelIcon
      v-if="shouldDisplayRelicIcon"
      class="m-auto"
      :relicLevel="displayValue"
      :forceSide="alignment"
    />
    <GearText v-else-if="shouldDisplayGearIcon" :level="displayValue" />
    <div v-else-if="type === 'Stars'" class="d-flex justify-content-center">
      <span>{{ displayValue }}</span>
      <img src="images/star.png" class="mx-1" />
    </div>
    <span v-else>{{ type }}: {{ displayValue }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import RelicLevelIcon from "../../../units/relicLevelIcon.vue";
import GearText from "../../../gear/gearText.vue";
import { getUnit } from "../../../../types/unit";
import {
  displayValue,
  isGearRequirement,
  isRelicRequirement,
} from "../../../../types/shards";

export default defineComponent({
  name: "RequirementIcon",
  components: {
    RelicLevelIcon,
    GearText,
  },
  props: {
    value: {
      type: Number,
      default: null,
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
    unit() {
      return getUnit(this.unitId);
    },
    alignment(): string {
      return this.unit?.alignment || "Light Side";
    },
    displayValue(): number {
      return displayValue(
        this.type,
        this.value,
        this.unit?.relicLevel,
        this.unit?.gearLevel,
        this.unit?.stars
      );
    },
    shouldDisplayRelicIcon(): boolean {
      return isRelicRequirement(this.type, this.value, this.unit?.relicLevel);
    },
    shouldDisplayGearIcon(): boolean {
      return isGearRequirement(this.type, this.value, this.unit?.relicLevel);
    },
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 40px;
}
</style>
