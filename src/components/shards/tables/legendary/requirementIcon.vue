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
      if (this.value === null) {
        if (this.type === "Relic" && this.unit?.relicLevel) {
          return this.unit.relicLevel ?? 0;
        } else if (this.type === "Relic" || this.type === "Gear") {
          return this.unit?.gearLevel ?? 0;
        } else if (this.type === "Stars") {
          return this.unit?.stars ?? 0;
        }
      }
      return this.value;
    },
    shouldDisplayRelicIcon(): boolean {
      if (this.type !== "Relic") {
        return false;
      } else if (this.value === null) {
        return (this.unit?.relicLevel ?? 0) > 0;
      } else {
        return true;
      }
    },
    shouldDisplayGearIcon(): boolean {
      if (
        (this.type === "Relic" && !this.shouldDisplayRelicIcon) ||
        this.type === "Gear"
      ) {
        return true;
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 40px;
}
</style>
