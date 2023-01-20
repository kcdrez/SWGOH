<template>
  <table
    class="table table-bordered table-dark table-sm table-striped"
    :class="table.classes"
    v-if="table.show ?? true"
  >
    <TableHeader :header="table.header" v-if="table.header" />
    <TableBody :body="table.body" v-if="table.body" />
    <TableFooter :footer="table.footer" v-if="table.footer" />
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { iTable } from "types/general";
import TableHeader from "./tableHeader.vue";
import TableBody from "./tableBody.vue";
import TableFooter from "./tableFooter.vue";

export default defineComponent({
  name: "SwgohTable",
  components: {
    TableHeader,
    TableBody,
    TableFooter,
  },
  props: {
    table: {
      type: Object as () => iTable,
      default: () => {
        return {};
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
