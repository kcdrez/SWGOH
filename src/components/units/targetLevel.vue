<template>
  <div class="d-flex">
    <select v-model="_type" class="form-control form-control-sm me-2">
      <option value="Gear">Gear</option>
      <option value="Relic">Relic</option>
      <option value="Stars">Stars</option>
      <option value="Power">Power</option>
    </select>
    <input v-if="_type === 'Power'" type="number" v-model="_target" min="1" />
    <select class="form-control form-control-sm me-1" v-model="_target" v-else>
      <option
        v-for="option in options"
        :value="option.value"
        :key="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { maxGearLevel } from "types/gear";
import { maxRelicLevel } from "types/relic";
import { unvue } from "utils";

export default defineComponent({
  name: "TargetLevel",
  props: {
    value: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // _target: this.value,
      // _type: this.type,
    };
  },
  computed: {
    options(): { value: number; label: string }[] {
      const list: { value: number; label: string }[] = [];
      if (this.type === "Gear") {
        for (let i = 1; i <= maxGearLevel; i++) {
          list.push({ value: i, label: `Gear ${i}` });
        }
      } else if (this.type === "Relic") {
        for (let i = 1; i <= maxRelicLevel; i++) {
          list.push({ value: i, label: `Relic ${i}` });
        }
      } else if (this.type === "Stars") {
        for (let i = 1; i <= 7; i++) {
          list.push({ value: i, label: `Star Level ${i}` });
        }
      }
      return list;
    },
    _target: {
      get() {
        return unvue(this.value);
      },
      set(value: number) {
        this.$emit("dataChange", { value, type: this._type });
      },
    },
    _type: {
      get() {
        return unvue(this.type);
      },
      set(type: string) {
        this.$emit("dataChange", { value: this._target, type });
      },
    },
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 40px;
}
</style>
