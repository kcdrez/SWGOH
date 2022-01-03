<template>
  <div>
    <navbar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import navbar from "./components/navbar.vue";

export default defineComponent({
  name: "App",
  components: { navbar },
  methods: {
    ...mapActions(["initialize", "fetchPlayers"]),
  },
  async created() {
    await this.initialize();
  },
});
</script>

<style></style>
