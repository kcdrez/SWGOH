<template>
  <div class="container home-page">
    <h1>Welcome to SWGoH Tools</h1>
    <div>
      <div>
        These tools are designed to help players and guilds maximize their
        potential while playing the game
        <a
          href="https://www.ea.com/games/starwars/galaxy-of-heroes"
          class="link-shadow"
          >Star Wars: Galaxy of Heroes</a
        >. The tools are most useful for players that are at the
        semi-competative to competative players (GP of 2mil or more) and may be
        overwhelming to new players. If you need help, please contact me below.
      </div>
      If you have any feedback, bug reports, or tools suggestions, send an email
      to
      <a
        href="mailto:drezzinator@gmail.com?subject=SWGoH Tools Suggestion"
        class="link-shadow"
        >drezzinator@gmail.com</a
      >, or contact me on discord via
      <a
        href="https://discord.com/channels/@me/drezzinator#6175"
        class="link-shadow"
        >drezzinator#6175</a
      >.
    </div>
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <div v-if="!player">
        <div>Enter your ally code:</div>
        <div class="input-group input-group-sm ally-code">
          <span class="input-group-text">Ally Code:</span>
          <input
            class="form-control"
            type="text"
            v-model="allyCode"
            @keypress="$filters.numbersOnly($event)"
          />
          <button
            type="button"
            class="btn btn-success"
            @click="fetchPlayer(allyCode)"
          >
            GO!
          </button>
        </div>
        <div class="text-danger shadow-text" v-if="requestState === 'ERROR'">
          An error occured retrieving the player data with that ally code.
          Please make sure you are registered on
          <a href="www.swgoh.gg" class="link-shadow">SWGOH.GG</a> in order to
          use the tools. If you have already registered, please verify that the
          ally code is correct and try again. If the issue persists, contact the
          author via email
          <a
            href="mailto:drezzinator@gmail.com?subject=SWGoH Tools Suggestion"
            class="link-shadow"
            >drezzinator@gmail.com</a
          >
        </div>
      </div>
      <Player v-else />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Player from "components/player.vue";

export default defineComponent({
  name: "HomePage",
  components: { Player },
  data() {
    //needed to include for $filters to work with linting
    return {} as any;
  },
  computed: {
    ...mapState("player", ["player", "requestState"]),
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
.ally-code {
  width: 50%;
  @media only screen and (max-width: 640px) {
    width: 100%;
  }
}
</style>
