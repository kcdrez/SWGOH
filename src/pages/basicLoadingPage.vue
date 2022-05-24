<template>
  <Loading :state="loadingState" size="lg">
    <router-view />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapGetters } from "vuex";

import { loadingState } from "../types/loading";
import { initializeModules } from "../utils";

export default defineComponent({
  name: "LoadingBasicPage",
  props: {
    dependencyModules: {
      type: Array as PropType<string[]>,
      required: true,
    },
    loadAsync: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["someLoading"]),
    loadingState() {
      return this.someLoading(this.dependencyModules);
    },
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        initializeModules(this.dependencyModules, !this.loadAsync);
      });
    },
  },
  created() {
    this.refresh();
  },
});
</script>
