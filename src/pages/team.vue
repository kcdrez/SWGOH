<template>
  <div class="container speed-clocking-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <div class="input-group input-group-sm w-50">
        <input
          type="text"
          class="form-control"
          placeholder="Team Name"
          v-model="newTeamName"
          @keypress.enter="addNewTeam"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="addNewTeam"
          :disabled="newTeamName.trim() === ''"
        >
          Add New Team
        </button>
      </div>
      <template v-for="team in teams" :key="team.id">
        <h4>{{ team.name }}</h4>
        <table class="table table-bordered table-dark table-sm table-striped">
          <thead>
            <tr class="text-center">
              <td width="12%">Unit</td>
              <td width="8%">Square</td>
              <td width="8%">Arrow</td>
              <td width="8%">Diamond</td>
              <td width="8%">Triangle</td>
              <td width="8%">Circle</td>
              <td width="8%">Cross</td>
              <td width="10%">Set Bonus</td>
              <td width="10%">Sub Total</td>
              <td width="10%">Leader/Unique</td>
              <td width="10%">Total</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in team.units" :key="unit.id" class="text-center">
              <td>{{ unitData(unit.id).name }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[0]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[1]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[2]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[3]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[4]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[5]) }}</td>
              <td>{{ hasSpeedSet(unitData(unit.id)) ? "Yes" : "No" }}</td>
              <td>{{ unitData(unit.id).stats["5"] }}</td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="unit.speedBonus"
                  @change="speedBonusChange(unit)"
                  min="0"
                />
              </td>
              <td>
                {{ unitData(unit.id).stats["5"] + (unit.speedBonus || 0) }}
              </td>
            </tr>
            <tr>
              <td colspan="11">
                <div class="input-group input-group-sm">
                  <SearchInput
                    :list="player.units"
                    @select="selected = $event"
                  />
                  <button
                    class="btn btn-sm btn-primary"
                    @click="add(team.id, selected)"
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { v4 as uuid } from "uuid";

import Loading from "../components/loading.vue";
import Error from "../components/error.vue";
import SearchInput from "../components/search-input.vue";
import { Unit } from "../types/unit";

export default defineComponent({
  name: "TeamPage",
  components: { SearchInput, Loading, Error },
  data() {
    return {
      selected: null,
      newTeamName: "",
    };
  },
  computed: {
    ...mapState("player", ["player", "requestState"]),
    ...mapGetters("player", ["unitData"]),
    ...mapState("speed", ["teams"]),
    ...mapGetters("speed", ["speedValueFromMod", "hasSpeedSet"]),
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
    ...mapActions("speed", ["addTeam", "addUnit", "saveTeams"]),
    addNewTeam() {
      if (this.newTeamName.trim() !== "") {
        this.addTeam({
          id: uuid(),
          name: this.newTeamName,
          units: [],
        });
        this.newTeamName = "";
      }
    },
    add(teamId: String, unit: Unit) {
      this.addUnit({ teamId, unit });
    },
    speedBonusChange(unit: any) {
      //todo debouncer
      this.saveTeams();
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
