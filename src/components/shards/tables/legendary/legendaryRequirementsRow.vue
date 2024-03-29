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
                  class="unit-icon border-0"
                  :class="{ 'unit-icon-simple': simpleView }"
                  v-for="unit in getUnitsByTag(item.tags, parentIds, unitId)"
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
          <span class="row-label">Current Level:</span>
          <RequirementIcon
            class="justify-content-center"
            :type="item.requirement?.type ?? 'requirement'"
            :unitId="item.id"
            v-if="item.id"
            currentLevel
          />
          <template v-else-if="item.tags && bestUnitByTag(item)">
            {{ bestUnitByTag(item)?.name }}:
            <RequirementIcon
              class="justify-content-center"
              :type="item.requirement?.type ?? 'requirement'"
              :unitId="bestUnitByTag(item)?.id"
              currentLevel
            />
          </template>
        </td>
        <td class="text-center align-middle" v-if="showCol('requirements')">
          <span class="row-label">Requirement:</span>
          <RequirementIcon
            class="justify-content-center"
            :value="item.requirement?.value"
            :type="item.requirement?.type ?? 'requirement'"
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
        :prerequisites="item?.prerequisites ?? []"
        :selectedColumns="selectedColumns"
        :simpleView="simpleView"
        :showRecommended="showRecommended"
        :parentIds="[item?.id ?? '', ...parentIds]"
      />
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

import { IPrerequisite } from "types/shards";
import { getPercent, getUnitsByTag, getUnit } from "types/unit";
import UnitIcon from "components/units/unitIcon.vue";
import RequirementIcon from "./requirementIcon.vue";
import { setupColumnEvents } from "utils";

export default defineComponent({
  name: "LegendaryRequirementRow",
  setup(props) {
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return { showCol };
  },
  components: { UnitIcon, RequirementIcon },
  props: {
    prerequisites: {
      type: Array as () => IPrerequisite[],
      required: true,
    },
    selectedColumns: {
      type: Array as () => string[],
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
    unitId: {
      type: String,
      default: null,
    },
  },
  methods: {
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

<style lang="scss" scoped>
.unit-icon {
  margin: 0rem 0.5rem 0 !important;

  &:not(.unit-icon-simple) {
    height: 130px;
  }
}
</style>
