<template>
  <div>
    <div v-if="timeLength === 0">
      {{ label }}
      <span class="display-container completed">{{ completedText }}</span>
    </div>
    <div v-else-if="timeLength === -1">
      {{ label }}
      <span class="display-container unknown">{{ unknownText }}</span>
    </div>
    <div v-else>
      {{ label }}
      <span
        class="display-container"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        :title="tooltip"
      >
        {{ display }}
        <span class="display-text" :class="displayClasses"
          >({{ tooltip }})</span
        >
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { pluralText, daysFromNow } from "utils";

export default defineComponent({
  name: "Timestamp",
  props: {
    title: {
      type: String,
      default: "",
    },
    displayText: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    displayClasses: {
      type: String,
      default: "",
    },
    timeLength: {
      type: Number,
      default: Infinity,
    },
    completedText: {
      type: String,
      default: "Completed",
    },
    unknownText: {
      type: String,
      default: "Unknown",
    },
  },
  computed: {
    display(): string {
      return this.displayText || pluralText(this.timeLength, "day");
    },
    tooltip(): string {
      return this.title || daysFromNow(this.timeLength);
    },
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 800px) {
  .display-container {
    &:not(.completed):not(.unknown) {
      border-bottom: 1px dashed #d4d4d4;
      cursor: help;
    }
  }
  .display-text {
    display: none !important;
  }
}
</style>
