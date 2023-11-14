<template>
  <span>
    <em class="character">{{ character.name }}</em> ({{ character.owner }})
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Character } from "types/gameEngine/characters";

export default defineComponent({
  name: "CharacterLog",
  props: {
    character: {
      type: Object as () => Character,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.character {
  color: $dark;
  cursor: pointer;
}
</style>
