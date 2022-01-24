<template>
  <div class="container speed-clocking-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <button class="btn btn-sm btn-primary" @click="addNewTeam">
        Add New Team
      </button>
      <table
        class="table table-bordered table-dark table-sm table-striped"
        v-for="team in teams"
        :key="team.id"
      >
        <thead>
          <tr class="text-center">
            <td>Unit</td>
            <td>Base Speed</td>
            <td>Square</td>
            <td>Arrow</td>
            <td>Diamond</td>
            <td>Triangle</td>
            <td>Circle</td>
            <td>Cross</td>
            <td>Set Bonus</td>
            <td>Leader/Unique</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in team.units" :key="unit.id">
            <td>{{ unit.name }}</td>
            <td></td>
            <td>{{ speedValueFromMod(unit.mods[0]) }}</td>
            <td>{{ speedValueFromMod(unit.mods[1]) }}</td>
            <td>{{ speedValueFromMod(unit.mods[2]) }}</td>
            <td>{{ speedValueFromMod(unit.mods[3]) }}</td>
            <td>{{ speedValueFromMod(unit.mods[4]) }}</td>
            <td>{{ speedValueFromMod(unit.mods[5]) }}</td>
            <td>{{ hasSpeedSet(unit) ? "Yes" : "No" }}</td>
            <td>Leader/Unique</td>
            <td>{{ unit.stats["5"] }}</td>
          </tr>
          <tr>
            <td colspan="11">
              <SearchInput :list="player.units" @select="selected = $event" />
              <button
                class="btn btn-sm btn-primary"
                @click="add(team.id, selected)"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import Loading from "../components/loading.vue";
import Error from "../components/error.vue";
import SearchInput from "../components/search-input.vue";
import { Unit } from "../types/unit";

export default defineComponent({
  name: "SpeedClockingPage",
  components: { SearchInput, Loading, Error },
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    ...mapState("player", ["player", "requestState"]),
    ...mapState("speed", ["teams"]),
    ...mapGetters("speed", ["speedValueFromMod", "hasSpeedSet"]),
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
    ...mapActions("speed", ["addTeam", "addUnit"]),
    addNewTeam() {
      this.addTeam();
    },
    add(teamId: String, unit: Unit) {
      this.addUnit({ teamId, unit });
    },
  },
  async created() {},
});
</script>

<style lang="scss" scoped>
.speed-clocking-page {
  max-width: 90%;
}
</style>
