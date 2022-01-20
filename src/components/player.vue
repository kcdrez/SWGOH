<template>
  <div v-if="player">
    <div>
      <input
        class="form-control form-control-sm"
        type="text"
        v-model="searchText"
        placeholder="Search for Unit"
      />
      <router-link
        v-for="unit in filteredUnits"
        :key="unit.id"
        :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
        class="d-block"
      >
        {{ unit.name }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Player } from "../types/player";
import { Unit } from "../types/unit";

export default defineComponent({
  name: "Player",
  props: {
    player: {
      type: Object as () => Player,
      default: () => null,
    },
  },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    filteredUnits(): Unit[] {
      return this.player.units
        .filter((unit) => {
          if (unit) {
            return unit.name
              .toLowerCase()
              .includes(this.searchText.toLowerCase());
          } else {
            return false;
          }
        })
        .sort((a, b) => {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });
    },
  },
  mounted() {},
  methods: {},
});
</script>
