<template>
  <div>
    <CharacterLog v-if="log.character" :character="log.character" />
    <span
      v-if="log.ability.used"
      class="ability"
      :title="log.ability.used.gameText"
      >used {{ log.ability.used.name }}</span
    >
    <template v-if="log.effects.immune">is immune to</template>
    <template v-if="log.statusEffects.resisted">resisted</template>
    <template v-if="log.statusEffects.list.length > 0">
      <template v-if="log.statusEffects.removed"
        >Removed
        <template :class="log.statusEffects.type">{{
          log.statusEffects.list.join(", ")
        }}</template>
        <template v-if="log.target">
          from
          <CharacterLog :character="log.target" />
        </template>
      </template>
      <template v-else>
        {{ log.statusEffects.type === "debuff" ? "Inflicted" : "Gained" }}
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.join(", ")
        }}</span>
        <template v-if="log.target">
          on
          <CharacterLog :character="log.target" />
        </template>
      </template>

      <template v-if="log.statusEffects.duration"
        >for {{ log.statusEffects.duration }} turns</template
      >
    </template>
    <template v-if="log.effects.turnMeter">
      {{ log.effects.turnMeter > 0 ? "gained" : "lost" }}
      {{ log.effects.turnMeter }}% turn meter
    </template>
    <template v-if="log.heal.amount > 0"
      >recovered <span :class="log.heal.type">{{ log.heal.amount }}</span>
      {{ log.heal.type }}</template
    >
    <template v-if="log.effects.assisted">
      <template v-if="log.character?.hasDebuff('Stun')"
        >cannot assist because they are
        <span class="debuff">Stunned</span></template
      >
      <template v-else-if="log.character?.hasDebuff('Daze')"
        >cannot assist because they are
        <span class="debuff">Dazed</span></template
      >
      <template v-else>is called to assist</template>
    </template>
    <template v-if="log.effects.countered">counter attacked</template>
    <span
      v-if="log.effects.cooldown?.ability"
      class="ability"
      :title="log.effects.cooldown.ability.gameText"
    >
      cooldown stuff
    </span>
    <template v-if="log.damage.amount">
      <span class="damage"
        >{{ log.damage.amount }} damage was dealt to
        <CharacterLog v-if="log.damage.target" :character="log.damage.target" />
        <span v-if="log.damage.isCrit" class="crit">(Crit)</span>
      </span>
    </template>
    <template v-if="log.damage.evaded">evaded</template>
    <template v-if="log.effects.defeated"
      >defeated <CharacterLog v-if="log.target" :character="log.target"
    /></template>
    <template v-if="log.character?.hasDebuff('Stun')"
      >is stunned and took no action</template
    >
    <template v-if="log.ability.source"
      >(src: {{ log.ability.source.name }})</template
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Log } from "types/gameEngine/gameEngine";
import { Character, format } from "types/gameEngine/characters";
import CharacterLog from "./characterLog.vue";

export default defineComponent({
  name: "Log",
  components: { CharacterLog },
  props: {
    log: {
      type: Object as () => Log,
      required: true,
    },
  },
  methods: {
    characterName(character: Character) {
      return `<em class="character">${character.name}</em> (${character.owner})`;
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.character {
  color: $dark;
}
.damage {
  color: $danger-dark-3;
}
.crit {
  color: $warning;
}
.buff {
  color: $success-dark-2;
  text-shadow: 0px 0px 3px $success-light-3;
}
.debuff {
  color: $danger-dark-3;
  text-shadow: 0px 0px 3px $danger-light-2;
}
.statusEffect {
  color: $primary-dark-3;
  text-shadow: 0px 0px 3px $primary-light-2;
}
.ability {
  color: $secondary-dark-3;
  text-shadow: 0px 0px 3px $secondary-light-3;

  &:hover {
    color: $primary-dark-2;
    text-decoration: underline;
    cursor: help;
  }
}
.protection {
  color: $gray-1;
  text-shadow: 0px 0px 3px $gray-9;
}
.health {
  color: $success-light-2;
  text-shadow: 0px 0px 3px $gray-1;
}
</style>
