<template>
  <Loading :state="loadingState" size="lg">
    <router-view />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { loadingState } from "../types/loading";
import { initializeModules } from "../utils";

export default defineComponent({
  name: "LoadingPlayerPage",
  props: {
    dependencyModules: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  computed: {
    ...mapState("player", ["requestState"]),
    ...mapGetters(["someLoading"]),
    loadingState() {
      if (this.requestState !== loadingState.ready) {
        return loadingState.loading;
      } else {
        this.someLoading(this.dependencyModules);
        return this.someLoading(this.dependencyModules);
      }
    },
  },
  methods: {
    ...mapActions("player", ["initialize"]),
    refresh() {
      this.$nextTick(() => {
        initializeModules(this.dependencyModules);
      });
    },
  },
  watch: {
    requestState(newVal) {
      if (newVal === loadingState.ready) {
        this.refresh();
      }
    },
    $route(to, from) {
      this.refresh();
    },
  },
  created() {
    this.initialize();
    if (this.requestState === loadingState.ready) {
      this.refresh();
    }
  },
});
</script>
