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
        :title="title"
      >
        {{ displayText }}
        <span class="display-text" :class="displayClasses">({{ title }})</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Timestamp",
  props: {
    title: {
      type: String,
      required: true,
    },
    displayText: {
      type: String,
      required: true,
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
});
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 800px) {
  .display-container {
    &:not(.completed):not(.unknown) {
      border-bottom: 1px dashed #d4d4d4;
      cursor: pointer;
    }
  }
  .display-text {
    display: none !important;
  }
}
</style>
