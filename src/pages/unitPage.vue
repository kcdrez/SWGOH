<template>
  <div>
    <div v-if="unit">
      <h1>This is the page for {{ unit.name }}</h1>
      <div v-if="unit.relic_level > 1">
        Relic Level: {{ unit.relic_level + 1 }}
      </div>
      <div>
        Gear:
        <div>Gear Level: {{ unit.gear_level }}</div>
        <div v-for="gear in unit.gear" :key="gear.slot">
          <div>Slot: {{ gear.slot }}</div>
          <div>Equipped: {{ gear.is_obtained ? "Yes" : "No" }}</div>
          <div>Name: {{ gearName(gear) }}</div>
        </div>
      </div>
    </div>
    <div v-else>Loading unit page</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { UnitData, UnitGear, Gear } from "../api/interfaces";

export default defineComponent({
  name: "UnitPage",
  data() {
    return {};
  },
  computed: {
    ...mapState(["player", "gearList"]),
    unit(): UnitData | null {
      const match = this.player?.units.find((u: UnitData) => {
        return u.data.base_id === this.$route.params.unitId;
      });
      if (match) {
        return match.data;
      } else {
        return null;
      }
    },
  },
  methods: {
    gearName(gear: UnitGear): string {
      const match = this.gearList.find((g: Gear) => g.base_id === gear.base_id);
      if (match) {
        return match.name;
      } else {
        return "Unknown";
      }
    },
  },
});
</script>
