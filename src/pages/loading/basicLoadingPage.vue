<template>
  <Loading :state="loadingState" size="lg">
    <router-view :key="$route.fullPath" />
  </Loading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { initializeModules } from "utils";

export default defineComponent({
  name: "LoadingBasicPage",
  props: {
    dependencyModules: {
      type: Array as () => string[],
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
        initializeModules(
          this.dependencyModules,
          !this.loadAsync,
          this.$route.params
        );
      });
    },
  },
  created() {
    this.refresh();
  },
});
</script>
