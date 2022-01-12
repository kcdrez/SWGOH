<template>
  <div class="container home-page">
    <h1>Welcome to SWGoH Tools</h1>
    <div>
      <div>
        This page is currently in active development and is VERY rough. Please
        forgive any bad UX, bugs, etc.
      </div>
      If you have any feedback, bug reports, or tools suggestions,
      <a href="mailto:drezzinator@gmail.com?subject=SWGoH Tools Suggestion"
        >click here</a
      >
      or send an email to drezzinator@gmail.com.
    </div>
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <div v-if="!player">
        <div>Enter your ally code:</div>
        <div class="input-group input-group-sm w-50">
          <span class="input-group-text">Ally Code:</span>
          <input class="form-control" type="number" v-model.number="allyCode" />
          <button
            type="button"
            class="btn btn-success"
            @click="fetchPlayer(allyCode)"
          >
            GO!
          </button>
        </div>
      </div>
      <Player v-else :player="player" />
    </Loading>
    <!-- <div v-if="unit">
      <img :src="`https://game-assets.swgoh.gg/${unit.thumbnailName}.png`" />
    </div> -->
    <!-- <Gear v-for="gear in gearList" :gear="gear" :key="gear.base_id" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import Gear from "../components/gear/gear.vue";
import Player from "../components/player.vue";

export default defineComponent({
  name: "HomePage",
  components: { Gear, Player },
  computed: {
    ...mapState(["requestState"]),
    ...mapState("player", ["player"]),
    allyCode: {
      get(): string {
        return this.$store.state.player.allyCode;
      },
      set(value: string) {
        this.$store.commit("player/SET_ALLY_CODE", value);
      },
    },
  },
  methods: {
    ...mapActions("player", ["fetchPlayer"]),
  },
});
</script>

<style lang="scss" scoped>
::v-deep(a) {
  text-shadow: 2px 2px 2px black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
