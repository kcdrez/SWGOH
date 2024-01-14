<template>
  <div>
    <template v-if="effect.condition">
      <template v-if="effect.condition">
        <span>If Target </span>
        <span class="text-warning" v-if="effect.condition.inverted"
          >does NOT have </span
        ><span class="text-danger" v-else>has </span>
        <span>{{ effect.condition.buffs }}</span>
        <span>{{ effect.condition.debuffs }}</span>
        <template v-if="effect.condition.stats"
          >{{ effect.condition.stats.amount }}
          {{ effect.condition.stats.statToModify }}
        </template>
        <template v-if="effect.condition.tm"
          >{{ effect.condition.tm }} Turn Meter</template
        >, then
      </template>
    </template>
    <div v-if="effect.ability">
      <div v-if="effect.ability.abilityToUse">
        Will use {{ effect.ability.abilityToUse }}
      </div>
      <div v-if="effect.ability.abilityTrigger">
        Whenever {{ effect.ability.abilityTrigger }} is used
      </div>
      <div v-if="effect.ability.effects">
        With these additional effects:
        <Effect
          v-for="(childEffect, index) in effect.ability.effects"
          :key="index"
          :effect="childEffect"
        />
      </div>
    </div>
    <template v-if="effect.stats">
      <template v-if="effect.stats.modifiedType === 'additive'">
        <template v-if="effect.stats.amount > 0">Gain </template>
        <template v-else>Lose </template>
        {{ Math.abs(effect.stats.amount) }}
        {{ effect.stats.statToModify }}
      </template>
      <template v-else-if="effect.stats.modifiedType === 'multiplicative'">
        {{ effect.stats.statToModify }} is multiplied by
        {{ Math.abs(effect.stats.amount * 100) }}%
      </template>
    </template>
    <template v-if="effect.heal">
      Heal for
      <span v-if="effect.heal.amountType === 'additive'">{{
        effect.heal.amount
      }}</span>
      <span v-else-if="effect.heal.amountType === 'multiplicative'"
        >{{ (effect.heal.amount ?? 0) * 100 }}%</span
      >
      <span
        class="text-capitalize ms-1"
        :class="effect.heal.healthType.toLowerCase()"
        >{{ effect.heal.healthType }}</span
      >
    </template>
    <StatusEffect
      v-for="(buff, index) in effect.buffs"
      :key="index"
      :statusEffect="buff"
      type="buff"
    />
    <StatusEffect
      v-for="(debuff, index) in effect.debuffs"
      :key="index"
      :statusEffect="debuff"
      type="debuff"
    />
    <StatusEffect
      v-for="(statusEffect, index) in effect.statusEffects"
      :key="index"
      :statusEffect="statusEffect"
      type="statusEffect"
    />
    <template v-if="effect.dispel">TODO: {{ effect.dispel }}</template>
    <template v-if="effect.immune">
      Immune to:
      <div
        v-for="debuff in effect.immune.negativeStatusEffects"
        :key="debuff"
        class="debuff"
      >
        {{ debuff }}
      </div>
      <div
        v-for="buff in effect.immune.positiveStatusEffects"
        :key="buff"
        class="buff"
      >
        {{ buff }}
      </div>
      <div v-if="effect.immune.assists">Assisting</div>
      <div v-if="effect.immune.counterAttack">Counter Attacking</div>
    </template>
    <template v-if="effect.damage">
      Deal
      <span class="damage">{{ effect.damage.damageType }}</span>
      damage
    </template>
    <div v-if="effect.scalesBy">
      <template>Equal to </template>
      <template>
        <template v-if="(effect.scalesBy.stat?.percent ?? 0) <= 1">
          {{ Math.abs(effect.scalesBy.stat?.percent ?? 0) * 100 }}%
        </template>
        <template v-else>
          {{ Math.abs(effect.scalesBy.stat?.percent ?? 0) }}
        </template>
        {{ effect.scalesBy.stat?.name }}
      </template>
      <span>
        of this Target:
        <div>{{ effect.scalesBy.targets }}</div>
      </span>
    </div>
    <template v-if="effect.assist">
      Call an Assist
      <template v-if="effect.assist.chance"
        >({{ effect.assist.chance * 100 }}%)</template
      >
      <div>
        Target: <span>{{ effect.assist.targets }}</span>
      </div>
      <template v-if="effect.assist.modifier.stats"
        >Dealing {{ effect.assist.modifier.stats.amount * 100 }}%
        damage</template
      >
    </template>
    <div v-if="effect.cooldown">
      {{ effect.cooldown.amount > 0 ? "Increase" : "Reduce" }} the cooldown of
      <span class="ability">{{ effect.cooldown.id }}</span> by
      {{ Math.abs(effect.cooldown.amount) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import { iEffect } from "types/gameEngine/gameEngine";
import StatusEffect from "../statusEffect.vue";

export default defineComponent({
  name: "Effect",
  components: { StatusEffect },
  props: {
    effect: {
      type: Object as () => any,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";
</style>
