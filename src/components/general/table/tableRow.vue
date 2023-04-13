<template>
  <template v-for="(row, index) in rows">
    <tr :key="index" :class="row?.classes" v-if="!row.hide">
      <TableCell v-for="cell in row.cells" :cell="cell" />
    </tr>
  </template>
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
