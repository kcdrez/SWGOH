<template>
  <div>
    <template v-if="log?.effects?.winner">
      Match ends: {{ log.effects.winner }} is the winner!
    </template>
    <CharacterLog :character="log.characterLogData" />
    <template v-if="log?.ability?.used"
      >used
      <span class="ability" :title="log.ability.used.text">{{
        log.ability.used.name
      }}</span>
    </template>
    <template v-if="log.statusEffects">
      <template v-if="log.statusEffects.immune"
        >is immune to
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.map((x) => x.name).join(", ")
        }}</span></template
      >
      <template v-else-if="log.statusEffects.resisted"
        >resisted
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.map((x) => x.name).join(", ")
        }}</span>
      </template>
      <template v-else-if="log.statusEffects.prevented"
        >could not gain
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.map((x) => x.name).join(", ")
        }}</span>
        due to <span class="debuff">Buff Immunity</span>
      </template>
      <template v-else-if="log.statusEffects.removed"
        >removed
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.map((x) => x.name).join(", ")
        }}</span>
        <template v-if="log.targetLogData">
          from
          <CharacterLog :character="log.targetLogData" />
        </template>
      </template>
      <template v-else-if="log.statusEffects.list.length > 0">
        {{
          log.statusEffects.type === "debuff"
            ? "was inflicted with "
            : "gained "
        }}
        <span :class="log.statusEffects.type">{{
          log.statusEffects.list.map((x) => x.name).join(", ")
        }}</span>
        <template v-if="log.targetLogData">
          on
          <CharacterLog :character="log.targetLogData" />
        </template>
        <template v-if="log.statusEffects.duration">
          for {{ log.statusEffects.duration }} turn{{
            log.statusEffects.duration === 1 ? "" : "s"
          }}</template
        >
      </template>
    </template>
    <template v-if="log?.effects?.turnMeter">
      {{ log.effects.turnMeter > 0 ? "gained" : "lost" }}
      {{ Math.abs(log.effects.turnMeter) }}% turn meter
    </template>
    <template v-if="log?.heal"
      >recovered <span :class="log.heal.type">{{ log.heal.amount }}</span>
      <span class="text-capitalize ms-1">{{ log.heal.type }}</span>
    </template>
    <template v-if="log?.effects?.assisted">
      <template v-if="isStunned"
        >cannot assist because they are
        <span class="debuff">Stunned</span></template
      >
      <template v-else-if="isDazed"
        >cannot assist because they are
        <span class="debuff">Dazed</span></template
      >
      <template v-else>is called to assist</template>
    </template>
    <template v-if="log?.effects?.countered">counter attacked</template>
    <template v-if="log?.effects?.cooldown?.ability">
      <span class="ability" :title="log.effects.cooldown.ability?.text">
        {{ log.effects.cooldown?.ability?.name }}'s
      </span>
      cooldown was
      {{ log.effects.cooldown.amount > 0 ? "increased" : "decreased" }} by
      {{ Math.abs(log.effects.cooldown.amount) }}
    </template>
    <template v-if="log.damage">
      <template v-if="log.damage.evaded">
        <CharacterLog :character="log.targetLogData" />
        evaded
      </template>
      <template v-else-if="log.damage.bonus">
        <CharacterLog :character="log.targetLogData" />was dealt
        <span class="damage">{{ log.damage.amount }}</span> bonus damage
      </template>
      <template v-else-if="log.damage.amount">
        <span class="damage">{{ log.damage.amount }}</span> damage was dealt to
        <CharacterLog :character="log.targetLogData" />
        <span v-if="log.damage.isCrit" class="crit">(Crit)</span>
      </template>
    </template>
    <template v-if="log?.effects?.defeated"
      >defeated <CharacterLog :character="log.targetLogData" />
    </template>
    <template v-if="log?.effects?.stunned"
      >is stunned and took no action</template
    >
    <template v-if="log?.ability?.source">
      (src:
      <span class="ability" :title="log.ability.source.text">{{
        log.ability.source.name
      }}</span
      >)</template
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Log } from "types/gameEngine/characters/log";
import { Character } from "types/gameEngine/characters/index";
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
  computed: {
    isStunned() {
      return this.log.characterLogData?.debuffs.some((d) => d.name === "Stun");
    },
    isDazed() {
      return this.log.characterLogData?.debuffs.some((d) => d.name === "Daze");
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
