<template>
  <Timestamp
    class="last-updated"
    label="Last Updated:"
    :title="lastUpdated.timestamp"
    :displayText="lastUpdated.fromNow"
    displayClasses="d-block"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import Timestamp from "./timestamp.vue";

export default defineComponent({
  name: "LastUpdated",
  components: {
    Timestamp,
  },
  computed: {
    ...mapGetters("player", ["lastUpdated"]),
  },
});
</script>

<style lang="scss" scoped>
.last-updated {
  text-align: right;
  font-size: 0.75rem;
}
</style>
