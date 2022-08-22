<template>
  <template v-for="(item, index) in prerequisites" :key="index">
    <template v-if="!meetsCriteria(item)">
      <tr>
        <td class="text-center align-middle" v-if="showCol('name')">
          <div class="d-flex justify-content-center align-items-center">
            <UnitIcon
              v-if="item.id"
              :unit="getUnit(item.id)"
              isLink
              :hideImage="simpleView"
            />
            <div class="d-inline-block" v-else-if="item.tags">
              <div>You need {{ item.count ?? 1 }} of the following units:</div>
              <div class="unit-list-tags">
                <UnitIcon
                  class="unit-icon d-block border-0 m-0"
                  v-for="unit in getUnitsByTag(item.tags, parentIds)"
                  :key="unit.id"
                  :unit="unit"
                  isLink
                  :hideImage="simpleView"
                />
              </div>
            </div>
            <template v-for="parent in parentIds" :key="parent">
              <i class="fa fa-arrow-right mx-2"></i>
              <UnitIcon
                :unit="getUnit(parent)"
                isLink
                :hideImage="simpleView"
              />
            </template>
          </div>
        </td>
        <td class="text-center align-middle" v-if="showCol('current')">
          <RequirementIcon
            class="justify-content-center"
            :type="item.requirement?.type"
            :unitId="item.id"
            v-if="item.id"
            currentLevel
          />
          <template v-else-if="item.tags && bestUnitByTag(item)">
            {{ bestUnitByTag(item)?.name }}:
            <RequirementIcon
              class="justify-content-center"
              :type="item.requirement?.type"
              :unitId="bestUnitByTag(item)?.id"
              currentLevel
            />
          </template>
        </td>
        <td class="text-center align-middle" v-if="showCol('requirements')">
          <RequirementIcon
            class="justify-content-center"
            :value="item.requirement?.value"
            :type="item.requirement?.type"
            :unitId="item.id"
          />
        </td>
        <td
          class="text-center align-middle"
          v-if="showCol('recommended') && showRecommended"
        >
          <div class="percent-container" v-if="getRecommended(item)">
            <span>{{ getRecommended(item) }}</span>
            <ProgressBar :percent="getPercent(item, 'recommended')" />
          </div>
          <div v-else>-</div>
        </td>
        <td class="text-center align-middle" v-if="showCol('progress')">
          <ProgressBar :percent="getPercent(item, 'requirement')" />
        </td>
      </tr>
      <LegendaryRequirementRow
        v-if="showChildren(item)"
        :prerequisites="item.prerequisites"
        :selectedColumns="selectedColumns"
        :simpleView="simpleView"
        :showRecommended="showRecommended"
        :parentIds="[item.id, ...parentIds]"
      />
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IPrerequisite } from "../../../../types/shards";
import UnitIcon from "../../../units/unitIcon.vue";
import RequirementIcon from "./requirementIcon.vue";
import { getPercent, getUnitsByTag, getUnit } from "../../../../types/unit";

export default defineComponent({
  name: "LegendaryRequirementRow",
  components: { UnitIcon, RequirementIcon },
  props: {
    prerequisites: {
      type: Array as () => IPrerequisite[],
      required: true,
    },
    selectedColumns: {
      type: Array,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
    showRecommended: {
      type: Boolean,
      default: false,
    },
    parentIds: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
    },
  },
  computed: {},
  methods: {
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
    getPercent,
    getUnitsByTag,
    getUnit,
    getRecommended(item: any): string {
      if (item.recommended) {
        return `${item.recommended.type}: ${item.recommended.value}`;
      } else {
        return "";
      }
    },
    showChildren(item: any): boolean {
      if (!!item.prerequisites) {
        const unit = getUnit(item.id);
        return (unit?.stars ?? 0) < 7;
      }
      return false;
    },
    bestUnitByTag(item: any) {
      const list = getUnitsByTag(item.tags, this.parentIds);
      const { type, value } = item.requirement;
      return list.find((unit) => {
        if (type === "Stars") {
          return unit.stars >= value;
        } else if (type === "Power") {
          return unit.power >= value;
        } else if (type === "Relic") {
          return unit.relicLevel >= value;
        } else if (type === "Gear") {
          return unit.gearLevel >= value;
        }
      });
    },
    meetsCriteria(item: any) {
      if (this.parentIds.length === 0) {
        return false;
      } else {
        return getPercent(item, "requirement") >= 100;
      }
    },
  },
});
</script>
