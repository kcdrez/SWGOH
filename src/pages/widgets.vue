<template>
  <div class="container swgoh-page">
    <WidgetGrid />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import WidgetGrid from "components/widgets/WidgetGrid.vue";

//https://codesandbox.io/s/0z9kv?file=/src/components/GridComponent.vue
//https://codepen.io/niklasramo/details/bGWpVae

export default defineComponent({
  name: "WidgetsPage",
  components: { WidgetGrid },
});
</script>

<style lang="scss" scoped></style>
