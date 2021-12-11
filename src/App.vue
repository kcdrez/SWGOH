<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "App",
  methods: {
    ...mapActions(["initialize", "fetchPlayers"]),
  },
  async created() {
    await this.initialize();
  },
});
</script>

<style></style>
