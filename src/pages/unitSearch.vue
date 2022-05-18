<template>
  <div class="container swgoh-page">
    <div class="row">
      <div class="col-8">
        <div>
          <div>Unit Tag:</div>
          <div class="input-group input-group-sm">
            <SearchInput
              placeholder="Unit Tag"
              :list="allTags"
              :searchBy="['name']"
              id="name"
              v-model="tag.searchValue"
            />
            <button
              class="btn btn-primary"
              type="button"
              @click="
                add(
                  'tag',
                  'categories',
                  'Tags',
                  tag.searchValue.name,
                  tag.condition
                )
              "
              :disabled="!tag.searchValue"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <div>Ability:</div>
          <div class="input-group input-group-sm">
            <SearchInput
              placeholder="Ability Tag"
              :list="allAbilityTags"
              :searchBy="['name']"
              id="name"
              v-model="ability.searchValue"
            />
            <button
              class="btn btn-primary"
              type="button"
              @click="
                add(
                  'ability',
                  'abilityClasses',
                  'Abilities',
                  ability.searchValue.name,
                  ability.condition
                )
              "
              :disabled="!ability.searchValue"
            >
              Add
            </button>
          </div>
        </div>
        <!-- <div>
          <div>Unit Type:</div>
          <div class="input-group input-group-sm">
            <select class="form-control" v-model="unitType.searchValue">
              <option :value="false">Unit</option>
              <option :value="true">Ship</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              @click="
                add(
                  'unitType',
                  'isShip',
                  'Unit Type',
                  unitType.searchValue,
                  unitType.condition
                )
              "
              :disabled="unitType.searchValue === null"
            >
              Add
            </button>
          </div>
        </div> -->
      </div>
      <div class="col">
        <h4>Search Criteria:</h4>
        <ul>
          <li
            v-for="(criterion, index) in criteria"
            :key="criterion.type + criterion.condition"
            class="search-criterion"
            title="Remove this condition"
            @click="removeCriterion(index)"
          >
            <i class="fa fa-times-circle me-2"></i>
            <span v-html="searchText(criterion)"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="row mt-2" v-if="criteria.length > 0">
      <div class="col">
        <table
          class="table table-bordered table-dark table-sm table-striped swgoh-table"
        >
          <thead class="text-center">
            <tr>
              <th><h4 class="m-0">Results</h4></th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-if="results.length === 0">
              <td>There are no units that meet that search criteria.</td>
            </tr>
            <tr v-for="unit in results" :key="unit.id">
              <td><UnitIcon :unit="unit" isLink hideImage /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Unit } from "../types/unit";
import UnitIcon from "../components/units/unitIcon.vue";

interface dataModel {
  tag: {
    searchValue: { name: string } | null;
    condition: "and" | "or" | "not";
  };
  ability: {
    searchValue: { name: string } | null;
    condition: "and" | "or" | "not";
  };
  unitType: {
    searchValue: { name: string } | string | null;
    condition: "and" | "or" | "not";
  };
  criteria: tCriteria[];
}

type tCriteria = {
  type: string;
  key: string;
  label: string;
  value: any;
  condition: "and" | "or" | "not";
};

export default defineComponent({
  name: "UnitSearchPage",
  components: { UnitIcon },
  data() {
    return {
      tag: {
        searchValue: null,
        condition: "and",
      },
      ability: {
        searchValue: null,
        condition: "and",
      },
      unitType: {
        searchValue: null,
        condition: "and",
      },
      criteria: [],
    } as dataModel;
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    allTags(): { name: string }[] {
      return this.unitList.reduce((list: { name: string }[], unit: Unit) => {
        unit.categories.forEach((category) => {
          const exists = list.some((tag) => tag.name === category);
          if (!exists) {
            list.push({ name: category });
          }
        });
        return list;
      }, []);
    },
    allAbilityTags(): { name: string }[] {
      return this.unitList.reduce((list: { name: string }[], unit: Unit) => {
        unit.abilityClasses.forEach((ability) => {
          const exists = list.some((tag) => tag.name === ability);
          if (!exists) {
            list.push({ name: ability });
          }
        });
        return list;
      }, []);
    },
    results(): Unit[] {
      if (this.criteria.length === 0) {
        return [];
      }
      return this.unitList.filter((unit: any) => {
        return this.criteria.every((criterion) => {
          if (criterion.condition === "and") {
            return Array.isArray(unit[criterion.key])
              ? unit[criterion.key]?.includes(criterion.value)
              : unit[criterion.key] === criterion.value;
          } else if (criterion.condition === "or") {
          } else if (criterion.condition === "not") {
            return Array.isArray(unit[criterion.key])
              ? !unit[criterion.key].includes(criterion.value)
              : unit[criterion.key] !== criterion.value;
          } else {
            return true;
          }
        });
      });
    },
  },
  methods: {
    add(
      type: string,
      key: string,
      label: string,
      value: any,
      condition: "and" | "or" | "not"
    ) {
      const exists = this.criteria.some((x) => {
        return x.key === key && x.condition === condition && x.value === value;
      });
      if (!exists) {
        this.criteria.push({ type, key, value, condition, label });
      } else {
        console.warn("Criterion already exists", {
          type,
          key,
          value,
          condition,
        });
      }
    },
    removeCriterion(index: number): void {
      this.criteria.splice(index, 1);
    },
    searchText(criterion: tCriteria): string {
      let text = "";
      if (criterion.condition === "and") {
        text += "DOES contain";
      } else if (criterion.condition === "or") {
        text += "OR contains";
      } else if (criterion.condition === "not") {
        text += "does NOT contain";
      }

      text += ` <i>${criterion.value}</i> in <strong>${criterion.label}</strong>`;
      return text;
    },
  },
  watch: {},
  async created() {},
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.search-criterion {
  cursor: pointer;
  list-style-type: none;

  &:hover {
    color: $danger-text-dark;
  }
}
</style>
