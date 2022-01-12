<template>
  <div v-if="player">
    <div>
      <input
        class="form-control form-control-sm"
        type="text"
        v-model="searchText"
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
import { Player, PlayerUnit } from "../types/player";

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
    filteredUnits(): PlayerUnit[] {
      return this.player.units
        .filter((unit) => {
          return unit.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
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
