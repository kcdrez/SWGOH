<template>
  <div>
    <div class="text-center" v-if="state === 'LOADING'">
      <i class="fas fa-spinner fa-spin" :class="sizeClass" :title="message" />
      <div v-if="displayText">{{ displayText }}</div>
    </div>
    <slot name="error" v-else-if="state === 'ERROR'">
      An unexpected error occurred. Please refresh and try again.
    </slot>
    <slot name="initial" v-else-if="state === 'INITIAL'" />
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { loadingState, loadingSize } from "types/loading";

export default defineComponent({
  name: "LoadingComponent",
  props: {
    state: {
      type: String as () => loadingState,
      required: true,
    },
    message: {
      type: String,
      default: "Loading Data...",
    },
    size: {
      type: String as () => loadingSize,
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
