<template>
  <span>
    <span class="target" :class="classes">Target</span>
    {{ targetData?.self ? "Self" : "" }}
    {{ targetData?.self === false ? "Not Self" : "" }}
    {{ targetData?.weakest ? "Weakest" : "" }}
    {{ targetData?.filters }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { iTargetData } from "types/gameEngine/characters";

export default defineComponent({
  name: "Target",
  props: {
    targetData: {
      type: Object as () => iTargetData,
    },
    classes: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.target {
  color: $primary-dark-1;
}
</style>
