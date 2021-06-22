<template>
  <div>
    <h1>Welcome to SWGoH Tools</h1>
    <div>This page is under construction. Stay Tuned!</div>
    <div>If you have any feedback or tools suggestions, <a href="mailto:drezzinator@gmail.com?subject=SWGoH Tools Suggestion">click here</a> or send an email to drezzinator@gmail.com.</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    data() {
      return {
        count: 0
      }
    },
    mounted() {
      // const r = this.count.split("");
      console.log(this.test());
    },
    methods: {
      test(): number {
        return 0;
      }
    }
  });
</script>