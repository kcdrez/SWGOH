<template>
  <div>
    <template v-if="effect.condition">
      <template v-if="effect.condition">
        <span class="me-1">If the <Target /></span>
        <span class="text-warning me-1" v-if="effect.condition.inverted"
          >does NOT have</span
        ><span class="text-danger me-1" v-else>has</span>
        <span>{{ effect.condition.buffs?.join(", ") }}</span>
        <span>{{ effect.condition.debuffs?.join(", ") }}</span>
        <template v-if="effect.condition.stats"
          >{{ effect.condition.stats.amount }}
          {{ effect.condition.stats.statToModify }}
        </template>
        <template v-if="effect.condition.tm"
          >{{ effect.condition.tm }} Turn Meter</template
        >, then the
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
      <Target />{{ effect.stats.amount > 0 ? "gains" : "loses" }}
      <template v-if="effect.stats.modifiedType === 'additive'">
        {{ round(Math.abs(effect.stats.amount), 2) }}
        {{ effect.scalesBy?.stat?.type }}
        {{ effect.stats.statToModify }}
      </template>
      <template v-else-if="effect.stats.modifiedType === 'multiplicative'">
        {{ round(Math.abs(effect.stats.amount * 100), 2) }}%
        {{ effect.stats.statToModify }}
      </template>
    </template>
    <template v-if="effect.heal">
      Heal for
      <span v-if="effect.heal.amountType === 'additive'">{{
        effect.heal.amount
      }}</span>
      <span v-else-if="effect.heal.amountType === 'multiplicative'"
        >{{ round((effect.heal.amount ?? 0) * 100, 2) }}%</span
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
    <template v-if="effect.immune"
      ><Target />is immune to:
      <ul>
        <li
          v-for="debuff in effect.immune.negativeStatusEffects"
          :key="debuff"
          class="debuff"
        >
          {{ debuff }}
        </li>
        <li
          v-for="buff in effect.immune.positiveStatusEffects"
          :key="buff"
          class="buff"
        >
          {{ buff }}
        </li>
        <li v-if="effect.immune.assisting">Assisting</li>
        <li v-if="effect.immune.counterAttacking">Counter Attacking</li>
      </ul>
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
      <span v-if="effect.scalesBy.targets">
        of this:
        <Target :targetData="effect.scalesBy.targets" />
      </span>
    </div>
    <template v-if="effect.assist">
      Call this <Target :targetData="effect.assist.targets" classes="fw-bold" />
      to assist
      <template v-if="effect.assist.chance"
        >({{ effect.assist.chance * 100 }}%)</template
      >
      <div v-if="effect.assist.modifier.stats">
        Dealing {{ effect.assist.modifier.stats.amount * 100 }}% damage
      </div>
    </template>
    <div v-if="effect.cooldown">
      {{ effect.cooldown.amount > 0 ? "Increase" : "Reduce" }} the cooldown of
      <span class="ability">{{ effect.cooldown.id }}</span> by
      {{ Math.abs(effect.cooldown.amount) }}
    </div>
    <div v-if="effect.triggers">Adds Triggers</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { round } from "lodash";

// import { iEffect } from "types/gameEngine/gameEngine";
import StatusEffect from "../statusEffect.vue";
import Target from "./target.vue";

export default defineComponent({
  name: "Effect",
  components: { StatusEffect, Target },
  props: {
    effect: {
      type: Object as () => any,
      required: true,
    },
  },
  methods: { round },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";
</style>
