<template>
  <div>
    <div class="collapse-header section-header mt-3">
      <h3>
        <div data-bs-toggle="collapse" href="#shard-section-table">
          Shard Summary
        </div>
      </h3>
    </div>
    <div id="shard-section-table" class="collapse" ref="shardSection">
      <ShardTable :units="plannerList" showUnitName />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupEvents } from "../../utils";
import ShardTable from "../shards/shardTable.vue";

export default defineComponent({
  name: "ShardSection",
  components: { ShardTable },
  computed: {
    ...mapGetters("planner", ["fullUnitList", "relicTarget"]),
    ...mapState("relic", ["relicConfig"]),
    ...mapGetters("shards", ["plannerList"]),
  },
  mounted() {
    setupEvents(this.$refs.shardSection as HTMLElement, "shardSection");
  },
});
</script>
