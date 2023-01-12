<template>
  <tbody :class="body.classes">
    <tr v-if="body.zeroState?.show">
      <td colspan="100%" :class="body.zeroState.classes">
        {{ body.zeroState.message }}
      </td>
    </tr>
    <tr v-for="(row, index) in body.rows" :key="index" :class="row.classes">
      <TableCell :cells="row.cells" />
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { iTableBody } from "types/general";
import TableCell from "./tableCell.vue";

export default defineComponent({
  name: "TableBody",
  components: { TableCell },
  props: {
    body: {
      type: Object as () => iTableBody,
      required: true,
    },
  },
});
</script>
