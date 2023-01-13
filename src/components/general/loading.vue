<template>
  <div>
    <div class="text-center my-2" v-if="state === 'LOADING'">
      <i class="fas fa-spinner fa-spin" :class="sizeClass" :title="message" />
      <div v-if="displayText">{{ displayText }}</div>
    </div>
    <slot name="error" v-else-if="state === 'ERROR'" />
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { loadingState, loadingSize } from "types/loading";

export default defineComponent({
  name: "LoadingComponent",
  props: {
    state: {
      type: String as PropType<loadingState>,
      required: true,
    },
    message: {
      type: String,
      default: "Loading Data...",
    },
    size: {
      type: String as PropType<loadingSize>,
      default: "",
    },
    displayText: {
      type: String,
      default: "",
    },
  },
  computed: {
    sizeClass(): string {
      switch (this.size) {
        case loadingSize.sm:
        default:
          return "fa-1x";
        case loadingSize.md:
          return "fa-5x";
        case loadingSize.lg:
          return "fa-10x";
      }
    },
  },
});
</script>
