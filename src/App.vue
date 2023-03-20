<template>
  <div>
    <navbar />
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import navbar from "./components/general/navbar.vue";

export default defineComponent({
  name: "App",
  components: { navbar },
  computed: {
    ...mapState(["requestState"]),
  },
  methods: {
    ...mapActions(["initialize"]),
  },
  async created() {
    await this.initialize();
  },
});
</script>

<style></style>
