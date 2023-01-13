<template>
  <tbody :class="body.classes">
    <TableRow :rows="zeroStateRows" />
    <TableRow :rows="body.rows" />
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { iTableBody, iTableRow } from "types/general";
import TableRow from "./tableRow.vue";

export default defineComponent({
  name: "TableBody",
  components: { TableRow },
  props: {
    body: {
      type: Object as () => iTableBody,
      required: true,
    },
  },
  computed: {
    zeroStateRows(): iTableRow[] {
      if (this.body?.zeroState?.show) {
        return [
          {
            cells: [
              {
                colspan: "100%",
                classes: this.body.zeroState?.classes,
                data: this.body.zeroState?.message,
                show: true,
              },
            ],
          },
        ];
      } else {
        return [];
      }
    },
  },
});
</script>
