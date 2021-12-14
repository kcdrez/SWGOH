<template>
  <div v-if="player">
    <h1>{{ player.data.name }}</h1>
    <div>
      <input type="text" v-model="searchText" />
      <router-link
        v-for="unit in filteredUnits"
        :key="unit.data.base_id"
        :to="{ name: 'UnitPage', params: { unitId: unit.data.base_id } }"
        class="d-block"
      >
        {{ unit.data.name }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Player, UnitData } from "../api/interfaces";

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
    filteredUnits(): UnitData[] {
      return this.player.units
        .filter((unit) => {
          return unit.data.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
        })
        .sort((a, b) => {
          return a.data.name.toLowerCase() > b.data.name.toLowerCase() ? 1 : -1;
        });
    },
  },
  mounted() {},
  methods: {},
});
</script>
