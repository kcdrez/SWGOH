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
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Protection:</span>
                <span class="input-group-text fill">
                  <div
                    class="progress"
                    :title="`Bonus Protection: ${character.protection.bonus}\nCurrent Protection: ${character.protection.current}\nMax Protection: ${character.protection.max}\nBase Protection: ${character.protection.base}`"
                  >
                    <div
                      class="progress-bar bonus-protection"
                      role="progressbar"
                      :style="{
                        width: `${
                          (character.protection.bonus /
                            (character.protection.max +
                              character.protection.bonus)) *
                          100
                        }%`,
                      }"
                    >
                      {{ character.protection.bonus }}
                    </div>
                    <div
                      class="progress-bar current-protection"
                      role="progressbar"
                      :style="{
                        width: `${
                          (character.protection.current /
                            (character.protection.max +
                              character.protection.bonus)) *
                          100
                        }%`,
                      }"
                    >
                      {{ character.protection.current }}
                    </div>
                  </div>
                </span>
              </div>
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Health:</span>
                <span class="input-group-text fill">
                  <div
                    class="progress"
                    :title="`Current Health: ${character.health.current}\nMax Health: ${character.health.max}\nBase Protection: ${character.health.base}`"
                  >
                    <div
                      class="progress-bar current-health"
                      role="progressbar"
                      :style="{
                        width: `${
                          (character.health.current / character.health.max) *
                          100
                        }%`,
                      }"
                    >
                      {{ character.health.current }}
                    </div>
                  </div>
                </span>
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
                class="mt-1 ability-name"
                :title="ability.text"
              >
                <div v-if="typeof ability.cooldown === 'number'">
                  {{ ability.name }} - Cooldown:
                  {{ ability.cooldown }}
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
            <div class="tab-pane fade" :id="`other-${id}`">
              <div
                v-if="
                  character.otherEffects.ignoreTaunt ||
                  Object.keys(character.otherEffects?.immunity ?? {}).length > 0
                "
              >
                <div v-if="character.otherEffects.ignoreTaunt">
                  Ignores Taunt
                </div>
                <template v-if="shouldShowImmunity">
                  Immune to:
                  <ul
                    v-for="(val, key) in character.otherEffects.immunity"
                    :key="key"
                  >
                    <li
                      v-if="val.value"
                      :title="'Source: ' + val.sourceAbility?.name"
                      class="c-help"
                    >
                      {{ key }}
                    </li>
                  </ul>
                </template>
              </div>
              <div v-else>None</div>
            </div>
          </div>
        </div>
      </template>
    </Popper>
    <span class="ms-1">({{ character.owner }})</span>
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
  computed: {
    shouldShowImmunity(): boolean {
      const immunity = this.character?.otherEffects.immunity;
      for (const key in immunity) {
        if (immunity[key].value) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    getStatusEffectImgSrc(effect: iBuff | iDebuff | iStatusEffect) {
      return `/images/statusEffects/${effect?.name
        ?.toString()
        .replace(/\s/g, "_")}.png`;
    },
    getStatusEffectText(effect: iBuff | iDebuff | iStatusEffect): string {
      const textLines: string[] = [effect?.name ?? ""];
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
      if (effect.stacks) {
        textLines.push("Stacks: " + effect.stacks);
      }
      if (effect.unique) {
        textLines.push("Is Unique");
      }
      if (effect.sourceAbility) {
        textLines.push("Ability Source: " + effect.sourceAbility.name);
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

.progress {
  width: 100%;
  height: 1.5rem;
  border: 1px solid $dark;
  font-size: 1rem;

  &:hover {
    box-shadow: black 1px 1px 2px;
  }
}
.bonus-protection {
  background-color: #663399;
}
.current-protection {
  background-color: $gray-3;
}

.current-health {
  background-color: $success;
}

.ability-name {
  color: $secondary;

  &:hover {
    color: $secondary-light-2;
    text-decoration: underline;
    cursor: help;
  }
}
</style>
