<template>
  <div class="container swgoh-page">
    <WidgetGrid />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import WidgetGrid from "../components/widgets/WidgetGrid.vue";

export default defineComponent({
  name: "WidgetsPage",
  components: { WidgetGrid },
});
</script>

<style lang="scss" scoped></style>
