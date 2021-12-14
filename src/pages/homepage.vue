<template>
  <div>
    <h1>Welcome to SWGoH Tools</h1>
    <div>This page is under construction. Stay Tuned!</div>
    <div>
      If you have any feedback or tools suggestions,
      <a href="mailto:drezzinator@gmail.com?subject=SWGoH Tools Suggestion"
        >click here</a
      >
      or send an email to drezzinator@gmail.com.
    </div>
    <Player :player="player" />
    <!-- <div v-if="unit">
      <img :src="`https://game-assets.swgoh.gg/${unit.thumbnailName}.png`" />
    </div> -->
    <!-- <Gear v-for="gear in gearList" :gear="gear" :key="gear.base_id" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import Gear from "../components/gear.vue";
import Player from "../components/player.vue";

export default defineComponent({
  name: "HomePage",
  components: { Gear, Player },
  data() {
    return {};
  },
  computed: {
    ...mapState(["unit", "gearList", "player"]),
  },
  mounted() {},
  methods: {},
});
</script>
