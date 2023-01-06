<template>
  <div class="swgoh-page">
    <GearTable
      :gearList="gearList"
      :selectedColumns="selectedColumns"
      :storageKey="storageKey"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import GearTable from "components/gear/gearTable.vue";

const storageKey = "gearListPage";

export default defineComponent({
  name: "GearListPage",
  components: { GearTable },
  data() {
    return {
      selectedColumns: ["icon", "name", "mark", "locations", "owned"],
      storageKey,
    };
  },
  computed: {
    ...mapState("gear", ["gearList"]),
  },
});
</script>

<style lang="scss" scoped></style>
