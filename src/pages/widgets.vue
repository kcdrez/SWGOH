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
  data() {
    return {
      widgetsList: [],
    };
  },
  methods: {
    handleResize({ width, height }: any) {
      console.log("resized", width, height);
    },
  },
});
</script>

<style lang="scss" scoped></style>
