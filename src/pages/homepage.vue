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
    <div v-if="unit">
      <img :src="`https://game-assets.swgoh.gg/${unit.thumbnailName}.png`" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  data() {
    return {};
  },
  computed: {
    ...mapState(["unit"]),
  },
  mounted() {},
  methods: {},
});
</script>
