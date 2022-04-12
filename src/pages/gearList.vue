<template></template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import UnitSection from "../components/generalPlanner/unitSection.vue";
import GearSection from "../components/generalPlanner/gearSection.vue";
import RelicSection from "../components/generalPlanner/relicSection.vue";
import ShardSection from "../components/generalPlanner/shardSection.vue";
import UnitSearch from "../components/units/unitSearch.vue";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";
import { initializeModules } from "../utils";

const dependencyModules = ["planner", "unit", "gear", "relic", "shards"];

export default defineComponent({
  name: "GearListPage",
  components: {},
  data() {},
  computed: {},
  methods: {},
  created() {},
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
</style>
