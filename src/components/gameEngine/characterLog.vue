<template>
  <span v-if="character" class="characterLogContainer">
    <Popper arrow placement="right">
      <em class="character">{{ character.name }}</em>
      <template #content>
        <div>
          <h5>{{ character.name }}</h5>
          <ul class="nav nav-tabs my-3" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                data-bs-toggle="tab"
                :data-bs-target="`#general-${id}`"
                type="button"
                role="tab"
              >
                General
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                :data-bs-target="`#stats-${id}`"
                type="button"
                role="tab"
              >
                Stats
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                :data-bs-target="`#statusEffects-${id}`"
                type="button"
                role="tab"
              >
                Status Effects
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                :data-bs-target="`#triggers-${id}`"
                type="button"
                role="tab"
              >
                Triggers
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                :data-bs-target="`#other-${id}`"
                type="button"
                role="tab"
              >
                Other Effects
              </button>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" :id="`general-${id}`">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Protection:</span>
                <span class="input-group-text fill"
                  ><span
                    :class="{
                      'text-danger':
                        (character.protection.current ?? 0) <
                        (character.protection.max ?? 0),
                    }"
                    >{{ character.protection.current }}</span
                  >
                  <span class="mx-1">/</span>
                  {{ character.protection.max }}</span
                >
              </div>
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Health:</span>
                <span class="input-group-text fill"
                  ><span
                    :class="{
                      'text-warning':
                        (character.health.current ?? 0) <
                        (character.health.max ?? 0),
                    }"
                    >{{ character.health.current }}</span
                  ><span class="mx-1">/</span> {{ character.health.max }}</span
                >
              </div>
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Turn Meter</span>
                <span class="input-group-text fill">
                  <ProgressBar :percent="character.turnMeter" class="w-100" />
                </span>
              </div>
              <div
                v-for="ability in character.activeAbilities"
                :key="ability.id"
                class="mt-1"
              >
                <div v-if="ability.cooldown">
                  {{ ability.name }} - Cooldown:
                  {{ ability.turnsRemaining }}
                </div>
                <div v-else>{{ ability.name }} (Basic)</div>
              </div>
            </div>
            <div class="tab-pane fade stats" :id="`stats-${id}`">
              <div class="row">
                <div class="col">
                  <u>General Stats:</u>
                  <div v-for="(stat, index) in character.general" :key="index">
                    <span class="me-1">{{ stat.label }}:</span>
                    <span
                      :class="{
                        'text-success': stat.value > stat.base,
                        'text-warning': stat.value < stat.base,
                      }"
                      :title="`Current ${stat.label}`"
                      >{{ stat.value }}{{ stat.isPercent ? "%" : "" }}
                    </span>
                    <span
                      class="ms-1"
                      v-if="stat.value !== stat.base"
                      :title="`Base ${stat.label}`"
                      >({{ stat.base }}{{ stat.isPercent ? "%" : "" }})</span
                    >
                  </div>
                </div>
                <div class="col">
                  <u>Physical Stats:</u>
                  <div v-for="(stat, index) in character.physical" :key="index">
                    <span class="me-1">{{ stat.label }}:</span>
                    <span
                      :class="{
                        'text-success': stat.value > stat.base,
                        'text-warning': stat.value < stat.base,
                      }"
                      :title="`Current ${stat.label}`"
                      >{{ stat.value }}{{ stat.isPercent ? "%" : "" }}
                    </span>
                    <span
                      class="ms-1"
                      v-if="stat.value !== stat.base"
                      :title="`Base ${stat.label}`"
                      >({{ stat.base }}{{ stat.isPercent ? "%" : "" }})</span
                    >
                  </div>
                </div>
                <div class="col">
                  <u>Special Stats:</u>
                  <div v-for="(stat, index) in character.special" :key="index">
                    <span class="me-1">{{ stat.label }}:</span>
                    <span
                      :class="{
                        'text-success': stat.value > stat.base,
                        'text-warning': stat.value < stat.base,
                      }"
                      :title="`Current ${stat.label}`"
                      >{{ stat.value }}{{ stat.isPercent ? "%" : "" }}
                    </span>
                    <span
                      class="ms-1"
                      v-if="stat.value !== stat.base"
                      :title="`Base ${stat.label}`"
                      >({{ stat.base }}{{ stat.isPercent ? "%" : "" }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" :id="`statusEffects-${id}`">
              <div>Buffs:</div>
              <template v-if="character.buffs.length === 0">-</template>
              <template v-for="(buff, index) in character.buffs" :key="index">
                <img
                  class="statusEffect"
                  :src="getStatusEffectImgSrc(buff)"
                  alt="images/statusEffects/Default.png"
                  :title="getStatusEffectText(buff)"
                />
              </template>
              <div>Debuffs:</div>
              <template v-if="character.debuffs.length === 0">-</template>
              <template
                v-for="(debuff, index) in character.debuffs"
                :key="index"
              >
                <img
                  class="statusEffect"
                  :src="getStatusEffectImgSrc(debuff)"
                  alt="images/statusEffects/Default.png"
                  :title="getStatusEffectText(debuff)"
                />
              </template>
              <div>Other Status Effects:</div>
              <template v-if="character.statusEffects.length === 0">-</template>
              <template
                v-for="(statusEffect, index) in character.statusEffects"
                :key="index"
              >
                <img
                  class="statusEffect"
                  :src="getStatusEffectImgSrc(statusEffect)"
                  alt="images/statusEffects/Default.png"
                  :title="getStatusEffectText(statusEffect)"
                />
              </template>
            </div>
            <div class="tab-pane fade" :id="`triggers-${id}`">
              <Trigger
                v-for="trigger in character.triggers"
                :key="trigger.id"
                :trigger="trigger"
              />
            </div>
            <div class="tab-pane fade" :id="`other-${id}`">
              <div>
                {{ character.otherEffects.ignoreTaunt ? "Ignores Taunt" : "" }}
                Immune to:
                <ul
                  v-for="(val, key) in character.otherEffects.immunity"
                  :key="key"
                >
                  <li v-if="val">{{ key }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popper>
    <span class="mx-1">({{ character.owner }})</span>
  </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { v4 as uuid } from "uuid";

import { tLogData } from "types/gameEngine/characters/log";
import {
  iBuff,
  iDebuff,
  iStatusEffect,
} from "types/gameEngine/characters/statusEffects";
import Trigger from "components/gameEngine/triggers/trigger.vue";

export default defineComponent({
  name: "CharacterLog",
  components: { Trigger },
  props: {
    character: {
      type: [Object, undefined] as PropType<tLogData | undefined>,
    },
  },
  data() {
    return {
      id: uuid(),
    };
  },
  methods: {
    getStatusEffectImgSrc(effect: iBuff | iDebuff | iStatusEffect) {
      return `/images/statusEffects/${effect.name.replace(/\s/g, "_")}.png`;
    },
    getStatusEffectText(effect: iBuff | iDebuff | iStatusEffect): string {
      const textLines: string[] = [effect.name];
      if (effect.cantDispel) {
        textLines.push("Cant be Dispeled");
      }
      if (effect.cantPrevent) {
        textLines.push("Cant be Prevented");
      }
      if (effect.cantResist) {
        textLines.push("Cant be Resisted");
      }
      if (effect.duration) {
        textLines.push("Turns Remaining: " + effect.duration);
      }
      if (effect.unique) {
        textLines.push("Is Unique");
      }
      if (effect.isStackable) {
        textLines.push("Stacks: " + effect.stacks);
      }
      return textLines.join("\n");
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.character {
  color: $dark;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.popper .tab-pane {
  max-height: 300px;
  overflow: scroll;
}

::v-deep(.popper) .stats .row {
  width: 700px;
}

.statusEffect {
  max-width: 30px;
}

.input-group-text.fill {
  flex: 1 1 auto;
}

.characterLogContainer > * {
  &:first-child {
    border: 0 !important;
    margin: 0 !important;
  }
}
</style>
