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
          <input
            class="form-control"
            type="text"
            v-model="allyCode"
            @keypress="validateAllyCode($event)"
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
          Please verify that the code is correct and try again.
        </div>
      </div>
      <Player v-else :player="player" />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import Gear from "../components/gear/gear.vue";
import Player from "../components/player.vue";
import Loading from "../components/loading.vue";

export default defineComponent({
  name: "HomePage",
  components: { Gear, Player, Loading },
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
    validateAllyCode(e: KeyboardEvent) {
      const keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode < 48 || keyCode > 57) {
        e.preventDefault();
      }
    },
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
