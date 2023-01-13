<template>
  <tr v-for="(row, index) in rows" :key="index" :class="row?.classes">
    <TableCell v-for="cell in row.cells" :cell="cell" />
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { iTableRow } from "types/general";
import TableCell from "./tableCell.vue";

export default defineComponent({
  name: "TableRow",
  components: {
    TableCell,
  },
  props: {
    rows: {
      type: Array as () => iTableRow[],
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
