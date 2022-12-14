<template>
  <div class="container swgoh-page">
    <div class="row">
      <div class="col-lg-6 col-sm-12">
        <div>
          <div>Unit Tag:</div>
          <div class="input-group input-group-sm">
            <SearchInput
              placeholder="Unit Tag"
              :list="allTags"
              :searchBy="['name']"
              id="name"
              v-model="tag.value"
            />
            <select v-model="tag.condition" class="form-control conditional">
              <option value="and">AND</option>
              <option value="or">OR</option>
              <option value="not">NOT</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              @click="add(tag)"
              :disabled="!tag.value.name"
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
              v-model="ability.value"
            />
            <select
              v-model="ability.condition"
              class="form-control conditional"
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
              <option value="not">NOT</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              @click="add(ability)"
              :disabled="!ability.value.name"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <div>Alignment:</div>
          <div class="input-group input-group-sm">
            <select
              class="form-control search-input"
              v-model="alignment.value.name"
            >
              <option
                :value="alignment.name"
                v-for="alignment in alignmentList"
                :key="alignment.name"
              >
                {{ alignment.name }}
              </option>
            </select>
            <select
              v-model="alignment.condition"
              class="form-control conditional"
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
              <option value="not">NOT</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              @click="add(alignment)"
              :disabled="!alignment.value.name"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <div>Unit Type:</div>
          <div class="input-group input-group-sm">
            <select
              class="form-control search-input"
              v-model="unitType.value.name"
            >
              <option value="Unit">Unit</option>
              <option value="Ship">Ship</option>
            </select>
            <select
              v-model="unitType.condition"
              class="form-control conditional"
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
              <option value="not">NOT</option>
            </select>
            <button
              class="btn btn-primary"
              type="button"
              @click="add(unitType)"
              :disabled="!unitType.value.name"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-sm-12">
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
        <div class="btn-group btn-group-sm w-100">
          <button @click="navigate()" class="btn btn-success">Search</button>
          <button @click="clear()" class="btn btn-warning">Clear</button>
        </div>
      </div>
    </div>
    <div class="row mt-2" v-if="showResults">
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

import { Unit } from "types/unit";
import UnitIcon from "components/units/unitIcon.vue";
import { unvue } from "utils";

interface dataModel {
  tag: tCriteria;
  ability: tCriteria;
  unitType: tCriteria;
  alignment: tCriteria;
  criteria: tCriteria[];
  results: Unit[];
  showResults: boolean;
}

type tCriteria = {
  type: string;
  key: string;
  label: string;
  value: { name: string };
  condition: "and" | "or" | "not";
};

export default defineComponent({
  name: "UnitSearchPage",
  components: { UnitIcon },
  data() {
    return {
      tag: {
        value: { name: "" },
        condition: "and",
        type: "tag",
        label: "Tags",
        key: "categories",
      },
      ability: {
        value: { name: "" },
        condition: "and",
        type: "ability",
        label: "Abilities",
        key: "abilityClasses",
      },
      unitType: {
        value: { name: "" },
        condition: "and",
        type: "unitType",
        label: "Unit Type",
        key: "unitType",
      },
      alignment: {
        value: { name: "" },
        condition: "and",
        type: "alignment",
        label: "Unit Alignment",
        key: "alignment",
      },
      criteria: [],
      results: [],
      showResults: false,
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
    alignmentList(): { name: string }[] {
      return this.unitList.reduce((list: { name: string }[], unit: Unit) => {
        const exists = list.some(
          (alignment) => alignment.name === unit.alignment
        );
        if (!exists) {
          list.push({ name: unit.alignment });
        }
        return list;
      }, []);
    },
  },
  methods: {
    add(criterion: tCriteria) {
      const exists = this.criteria.some((x) => {
        return (
          x.key === criterion.key &&
          x.condition === criterion.condition &&
          x.value === criterion.value
        );
      });
      if (!exists) {
        this.criteria.push(unvue(criterion));
      } else {
        console.warn("Criterion already exists", criterion);
      }
    },
    navigate() {
      const queryList = this.criteria.reduce(
        (
          acc: {
            condition: "and" | "or" | "not";
            type: string;
            value: string;
          }[],
          criterion
        ) => {
          acc.push({
            condition: criterion.condition,
            type: criterion.type,
            value: criterion.value.name,
          });
          return acc;
        },
        []
      );
      const tagSearches = queryList.filter((x) => x.type === "tag");
      const unitTypeSearches = queryList.filter((x) => x.type === "unitType");
      const abilitySearches = queryList.filter((x) => x.type === "ability");
      const alignmentSearches = queryList.filter((x) => x.type === "alignment");
      const query: any = {};

      if (tagSearches.length) {
        query.tag = this.getSearchSyntax(tagSearches);
      }
      if (unitTypeSearches.length) {
        query.unitType = this.getSearchSyntax(unitTypeSearches);
      }
      if (abilitySearches.length) {
        query.ability = this.getSearchSyntax(abilitySearches);
      }
      if (alignmentSearches.length) {
        query.alignment = this.getSearchSyntax(alignmentSearches);
      }

      this.$router.push({ query });
    },
    getSearchSyntax(
      arr: { condition: "and" | "or" | "not"; type: string; value: string }[]
    ): string {
      const and = arr.filter((x) => x.condition === "and").map((x) => x.value);
      const or = arr.filter((x) => x.condition === "or").map((x) => x.value);
      const not = arr.filter((x) => x.condition === "not").map((x) => x.value);

      let str = "";
      str += and.length > 0 ? `+[${and.join(",")}]` : "";
      str += or.length > 0 ? `|[${or.join(",")}]` : "";
      str += not.length > 0 ? `-[${not.join(",")}]` : "";
      return encodeURI(str);
    },
    search() {
      Object.entries(this.$route.query).forEach(([queryKey, value]) => {
        if (queryKey in this && value) {
          const { type, label, key } = (this as any)[queryKey];
          const searchValues = decodeURI(value?.toString()).split(
            /(?:=[\+\-\|])/g
          );

          (searchValues ?? []).forEach((searchValue) => {
            const regex = /(?=\+|\-|\|)/g;
            const searchTerms = searchValue.split(regex);
            searchTerms?.forEach((searchPhrase) => {
              const condition = (function () {
                const key = searchPhrase.charAt(0);
                if (key === "|") {
                  return "or";
                } else if (key === "-") {
                  return "not";
                } else {
                  return "and";
                }
              })();
              const searchTermFull = /\[(.*?)\]/g.exec(searchPhrase);
              if (searchTermFull) {
                const searchTerm = searchTermFull[1];
                searchTerm.split(",").forEach((x) => {
                  this.add({
                    value: { name: x.trim() },
                    condition,
                    type,
                    label,
                    key,
                  });
                });
              }
            });
          });
        }
      });

      if (this.criteria.length === 0) {
        return;
      }
      const andConditions = this.criteria.filter((x) => x.condition === "and");
      const orConditions = this.criteria.filter((x) => x.condition === "or");
      const notConditions = this.criteria.filter((x) => x.condition === "not");
      this.results = this.unitList.filter((unit: any) => {
        const and = andConditions.every((criterion) => {
          return Array.isArray(unit[criterion.key])
            ? unit[criterion.key].includes(criterion.value.name)
            : unit[criterion.key] === criterion.value.name;
        });
        const or =
          orConditions.some((criterion) => {
            return Array.isArray(unit[criterion.key])
              ? unit[criterion.key]?.includes(criterion.value.name)
              : unit[criterion.key] === criterion.value.name;
          }) || orConditions.length === 0;
        const not = notConditions.every((criterion) => {
          return Array.isArray(unit[criterion.key])
            ? !unit[criterion.key].includes(criterion.value.name)
            : unit[criterion.key] !== criterion.value.name;
        });
        return and && or && not;
      });
      this.showResults = true;
    },
    clear() {
      this.criteria = [];
      this.showResults = false;
    },
    removeCriterion(index: number): void {
      this.criteria.splice(index, 1);
      this.navigate();
      this.showResults = this.criteria.length > 0;
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

      text += ` <i>${criterion.value.name}</i> in <strong>${criterion.label}</strong>`;
      return text;
    },
  },
  watch: {
    "$route.query"(newVal) {
      this.criteria = [];
      this.search();
    },
  },
  async created() {
    this.search();
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.search-criterion {
  cursor: pointer;
  list-style-type: none;

  &:hover {
    color: $danger-text-dark;
  }
}

.search-input {
  flex: 1 1 auto;
}
select.conditional {
  max-width: 100px;
}
</style>
