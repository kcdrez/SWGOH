<template>
  <div v-if="player">
    <SearchInput :list="player.units" @select="selected = $event" />
    <div v-if="selected" class="text-center">
      <img
        class="d-block mx-auto my-1"
        :src="`https://game-assets.swgoh.gg/${selected?.thumbnailName}.png`"
      />
      <router-link
        as="button"
        class="btn btn-primary"
        :to="{ name: 'UnitPage', params: { unitId: selected.id } }"
        >View Details</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Player } from "../types/player";
import SearchInput from "./search-input.vue";

export default defineComponent({
  name: "Player",
  components: { SearchInput },
  props: {
    player: {
      type: Object as () => Player,
      default: () => null,
    },
  },
  data() {
    return {
      selected: null,
    };
  },
});
</script>
