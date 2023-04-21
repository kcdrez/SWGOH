<template>
  <div v-if="state === 'ERROR'">
    <img
      src="images/stormtrooper-lego-stretcher.jpg"
      class="d-block m-auto w-50"
    />
    <h3 class="text-center">Oops! We may have had some casualties.</h3>
    <h3 class="text-center">{{ message }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { loadingState } from "types/loading";

export default defineComponent({
  name: "Error",
  props: {
    state: {
      type: String as () => loadingState,
      required: true,
    },
    message: {
      type: String,
      default: "Please try again later.",
    },
  },
});
</script>
