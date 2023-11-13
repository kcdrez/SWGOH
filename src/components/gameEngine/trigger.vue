<template>
  <div class="trigger-container">
    <div class="trigger-header">
      <div :title="trigger.srcAbility?.gameText" class="c-help">
        {{ trigger.srcAbility?.name }}
      </div>
      <div
        title="The type of event that will cause this to happen"
        class="c-help"
      >
        {{ trigger.triggerType }}
      </div>
    </div>
    <hr class="bg-dark w-100 mt-0 mb-1" />
    <div
      class="trigger-effect"
      v-for="action in trigger.actions"
      :key="action.id"
    >
      <div>Target: {{ action.targets.filters }}</div>
      <div v-for="effect in action.effects" :key="effect.id">
        <span v-if="effect.condition">
          <span v-if="effect.condition">
            <span>If Target </span>
            <span class="text-warning" v-if="effect.condition.inverted"
              >does NOT have </span
            ><span class="text-danger" v-else>has </span>
            <span>{{ effect.condition.buffs }}</span>
            <span>{{ effect.condition.debuffs }}</span>
            <span v-if="effect.condition.stats"
              >{{ effect.condition.stats.amount }}
              {{ effect.condition.stats.statToModify }}
            </span>
            <span v-if="effect.condition.tm"
              >{{ effect.condition.tm }} Turn Meter</span
            >, then
          </span>
        </span>
        <span v-if="effect.stats">
          <span v-if="effect.stats.amount > 0">Gain </span>
          <span v-else>Lose </span>
          <span v-if="effect.stats.amount <= 1">
            {{ Math.abs(effect.stats.amount) * 100 }}%
          </span>
          <span v-else>
            {{ Math.abs(effect.stats.amount) }}
          </span>
          {{ effect.stats.statToModify }}
        </span>
        <span v-if="effect.heal">
          <span
            >Heal for
            <span v-if="(effect.heal?.amount ?? 0) <= 1">
              {{ Math.abs(effect.heal?.amount ?? 0) * 100 }}%
            </span>
            <span v-else>{{ effect.heal.amount }}</span>
            <span
              class="text-capitalize"
              :class="effect.heal.healthType.toLowerCase()"
              >{{ effect.heal.healthType }}</span
            ></span
          >
        </span>
        <StatusEffect
          v-for="buff in effect.buffs"
          :key="buff.name"
          :statusEffect="buff"
          type="buff"
        />
        <StatusEffect
          v-for="debuff in effect.debuff"
          :key="debuff.name"
          :statusEffect="debuff"
          type="debuff"
        />
        <StatusEffect
          v-for="statusEffect in effect.statusEffects"
          :key="statusEffect.name"
          :statusEffect="statusEffect"
          type="statusEffect"
        />
        <span v-if="effect.dispel">TODO: {{ effect.dispel }}</span>
        <span v-if="effect.immune">
          Immune to:
          <span
            v-for="debuff in effect.immune.negativeStatusEffects"
            :key="debuff"
          >
            <div class="debuff">{{ debuff }}</div>
          </span>
          <div v-for="buff in effect.immune.positiveStatusEffects" :key="buff">
            <span class="buff">{{ buff }}</span>
          </div>
          <div v-if="effect.immune.assists">Assisting</div>
          <div v-if="effect.immune.counterAttack">Counter Attacking</div>
        </span>
        <span v-if="effect.damage" class="damage">
          Deal
          {{ effect.damage.damageType }}
          damage</span
        >
        <div v-if="effect.scalesBy">
          <span>Equal to </span>
          <span>
            <span v-if="effect.scalesBy.stat.percent <= 1">
              {{ Math.abs(effect.scalesBy.stat.percent) * 100 }}%
            </span>
            <span v-else>
              {{ Math.abs(effect.scalesBy.stat.percent) }}
            </span>
            {{ effect.scalesBy.stat.name }}
          </span>
          <span>
            of this Target:
            <div>{{ effect.scalesBy.targets }}</div>
          </span>
        </div>
        <span v-if="effect.assist">
          Call an Assist
          <span v-if="effect.assist.chance"
            >({{ effect.assist.chance * 100 }}%)</span
          >
          <div>
            Target: <span>{{ effect.assist.targets }}</span>
          </div>
          <span v-if="effect.assist.modifier.stats"
            >Dealing {{ effect.assist.modifier.stats.amount * 100 }}%
            damage</span
          >
        </span>
      </div>
    </div>
    <div v-if="trigger.triggerData">
      Limited to
      {{ trigger.triggerData.limit }} per
      {{ trigger.triggerData.frequency }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { iTrigger } from "types/gameEngine/gameEngine";
import StatusEffect from "./statusEffect.vue";

export default defineComponent({
  name: "Trigger",
  components: { StatusEffect },
  props: {
    trigger: {
      type: Object as () => iTrigger,
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.trigger-container {
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: $light;
  color: $dark;
  border: 1px solid $dark;
  margin-bottom: 0.25rem;
}

.trigger-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.health {
  color: $success-dark-1 !important;
  text-shadow: none !important;
}
</style>
