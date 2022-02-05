<template>
  <div class="last-updated">
    Last Updated:
    <span
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      :title="lastUpdated.timestamp"
      >{{ lastUpdated.fromNow }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "LastUpdated",
  computed: {
    ...mapGetters("player", ["lastUpdated"]),
  },
});
</script>

<style lang="scss" scoped>
.last-updated {
  text-align: right;
  font-size: 0.75rem;

  span {
    border-bottom: 1px dashed #d4d4d4;
    cursor: pointer;
  }
}
</style>
