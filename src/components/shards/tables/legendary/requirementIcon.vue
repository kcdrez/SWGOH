<template>
  <div class="d-flex">
    <template v-if="edit && unit">
      <template v-if="unit?.isShip">-</template>
      <select
        class="form-control form-control-sm me-1"
        v-model="unit.gearTarget"
        v-else-if="(unit.gearLevel ?? 0) < maxGearLevel"
      >
        <option v-for="num in unit.gearOptions" :value="num" :key="num">
          Gear {{ num }}
        </option>
      </select>
      <select v-model="unit.relicTarget" class="form-control form-control-sm">
        <option v-for="num in unit.relicOptions" :value="num" :key="num">
          Relic {{ num }}
        </option>
      </select>
    </template>
    <template v-else>
      <RelicLevelIcon
        v-if="shouldDisplayRelicIcon"
        class="m-auto"
        :relicLevel="displayValue"
        :alignment="alignment"
      />
      <GearText v-else-if="shouldDisplayGearIcon" :level="displayValue" />
      <div v-else-if="type === 'Stars'" class="d-flex justify-content-center">
        <span>{{ displayValue }}</span>
        <img src="images/star.png" class="mx-1" />
      </div>
      <div v-else>{{ type }}: {{ displayValue }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import RelicLevelIcon from "components/units/relicLevelIcon.vue";
import GearText from "components/gear/gearText.vue";
import { getUnit } from "types/unit";
import {
  displayValue,
  isGearRequirement,
  isRelicRequirement,
} from "types/shards";
import { maxGearLevel } from "types/gear";

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
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maxGearLevel,
    };
  },
  computed: {
    defaultText(): string {
      return `${this.type}: ${this.value}`;
    },
    unit() {
      return getUnit(this.unitId ?? "");
    },
    alignment(): string {
      return this.unit?.alignment || "Neutral";
    },
    displayValue(): number {
      return displayValue(
        this.type,
        this.value,
        this.unit?.relicLevel,
        this.unit?.gearLevel,
        this.unit?.stars,
        this.unit?.power
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
