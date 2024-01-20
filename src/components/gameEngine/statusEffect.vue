<template>
  <span>
    <div v-if="statusEffect.chance">
      There's a
      {{ statusEffect.chance * 100 }}% chance to:
    </div>
    <span v-if="statusEffect.name === 'TM Decrease'"
      >Lose {{ statusEffect.duration }}% Turn Meter</span
    >
    <span v-if="statusEffect.name === 'TM Increase'"
      >Gain {{ statusEffect.duration }}% Turn Meter</span
    >
    <div v-else>
      {{ type === "debuff" ? "Inflict" : "Add" }}
      <span :class="type">{{ statusEffect.name }}</span> for
      {{ statusEffect.duration }} turn{{ statusEffect.duration > 1 ? "s" : "" }}
    </div>
    <div v-if="statusEffect.cantDispel">Cant Be Dispelled</div>
    <div v-if="statusEffect.cantPrevent">Cant Be Prevented</div>
    <div v-if="statusEffect.cantResist">Cant Be Resisted</div>
    <div v-if="statusEffect.unique">Is Unique</div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { iStatusEffect } from "types/gameEngine/characters/statusEffects";

export default defineComponent({
  name: "StatusEffect",
  props: {
    statusEffect: {
      type: Object as () => iStatusEffect,
      required: true,
    },
    type: {
      type: String,
      default: "buff",
    },
  },
});
</script>

<style scoped lang="scss"></style>
