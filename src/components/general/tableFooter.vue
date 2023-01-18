<template>
  <tfoot :class="footer.classes">
    <TableRow :rows="zeroStateRows" />
    <TableRow :rows="footer.rows" />
  </tfoot>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { iTableBody, iTableRow } from "types/general";
import TableRow from "./tableRow.vue";

export default defineComponent({
  name: "TableFooter",
  components: { TableRow },
  props: {
    footer: {
      type: Object as () => iTableBody,
      required: true,
    },
  },
  computed: {
    zeroStateRows(): iTableRow[] {
      if (this.footer?.zeroState?.show) {
        return [
          {
            cells: [
              {
                colspan: "100%",
                classes: this.footer.zeroState?.classes,
                data: this.footer.zeroState?.message,
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
