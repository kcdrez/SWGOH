<template>
  <Loading :state="loadingState" size="lg">
    <template v-slot:error>{{ errorLoading }}</template>
    <router-view :key="$route.fullPath" />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { loadingState } from "types/loading";
import { initializeModules } from "utils";

export default defineComponent({
  name: "LoadingPlayerPage",
  props: {
    dependencyModules: {
      type: Array as PropType<string[]>,
      required: true,
    },
    loadAsync: {
      type: Boolean,
      default: true,
    },
    errorLoading: {
      type: String,
      default: "Error loading data",
    },
  },
  computed: {
    ...mapState("player", ["requestState"]),
    ...mapGetters(["someLoading"]),
    loadingState() {
      if (this.requestState === loadingState.error) {
        return loadingState.error;
      } else if (this.requestState !== loadingState.ready) {
        return loadingState.loading;
      } else {
        return this.someLoading(this.dependencyModules);
      }
    },
  },
  methods: {
    ...mapActions("player", ["initialize"]),
    refresh() {
      this.$nextTick(() => {
        initializeModules(this.dependencyModules, !this.loadAsync);
      });
    },
  },
  watch: {
    requestState(newVal) {
      if (newVal === loadingState.ready) {
        this.refresh();
      }
    },
    $route(_to, _from) {
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
