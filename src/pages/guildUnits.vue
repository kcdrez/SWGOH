<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
      <SearchInput :list="unitList" @select="selected = $event" />
      <template v-if="data">
        <table
          class="
            table table-bordered table-dark table-sm table-striped
            swgoh-table
          "
        >
          <thead class="sticky-header show-on-mobile">
            <tr class="text-center align-middle">
              <th>Player Name</th>
              <th>Gear Level</th>
              <th>Relic Level</th>
              <th>Zetas</th>
              <th>Speed</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="text-center align-middle"
              v-for="player in data.owned"
              :key="player.allyCode"
            >
              <td>{{ player.name }}</td>
              <td>{{ player.gearLevel }}</td>
              <td>{{ player.relicLevel }}</td>
              <td>{{ player.zetas }}</td>
              <td>{{ player.speed }}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-sm btn-primary" @click="downloadXlsx()">
          Download as XLSX
        </button>
      </template>
      <!-- <Loading :state="requestState" message="Loading Guild Data" size="lg">
      </Loading> -->
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
// import xlsx from "node-json-xlsx";
import { writeFile, utils } from "xlsx";
// import fs from "fs";

import { loadingState } from "../types/loading";
import { initializeModules, setupEvents } from "../utils";
import { Unit } from "../types/unit";

const dependencyModules = ["player", "guild"];

interface dataModel {
  selected: null | Unit;
  data: any;
  loading: loadingState;
}

export default defineComponent({
  name: "GuildUnitsPage",
  components: {},
  data() {
    return {
      // sortDir: "asc",
      // sortMethod: "date",
      selected: null,
      data: null,
      loading: loadingState.initial,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("unit", ["unitList"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
  },
  watch: {
    async selected(newVal) {
      if (newVal) {
        this.loading = loadingState.loading;
        this.data = await this.fetchGuildUnitData(newVal.id);
        this.loading = loadingState.ready;
      }
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    downloadXlsx(): void {
      const rows = this.data?.owned ?? [];
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(rows);

      utils.book_append_sheet(wb, ws, "Players");

      const fileName = this.selected?.id || "meow";
      writeFile(wb, fileName + ".xlsx");
    },
  },
  async created() {
    await initializeModules(dependencyModules);
  },
});
</script>

<style lang="scss" scoped>
</style>
