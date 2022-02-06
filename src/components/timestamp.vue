<template>
  <div>
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
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 800px) {
  span {
    border-bottom: 1px dashed #d4d4d4;
    cursor: pointer;
  }
  .display-text {
    display: none !important;
  }
}
</style>
