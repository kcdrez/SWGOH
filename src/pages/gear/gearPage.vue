<template>
  <div class="swgoh-page container mb-2" v-if="selected">
    <div class="row mt-2">
      <div class="col">
        <GearIcon :gear="selected" />
        <h4 class="text-center">{{ selected.name }}</h4>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table
          class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
        >
          <!-- <thead></thead> -->
          <tbody class="align-middle">
            <tr>
              <td>ID:</td>
              <td>{{ selected.id }}</td>
            </tr>
            <tr>
              <td>Name:</td>
              <td>{{ selected.name }}</td>
            </tr>
            <tr>
              <td>Mark:</td>
              <td>{{ selected.mark }}</td>
            </tr>
            <tr>
              <td>Locations:</td>
              <td>
                <ul>
                  <li v-for="loc in selected.locationLabels" :key="loc">
                    {{ loc }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Recipes:</td>
              <td>{{ selected.recipes }}</td>
            </tr>
            <tr>
              <td>Ingredients:</td>
              <td>{{ selected.ingredients }}</td>
            </tr>
            <tr>
              <td>Amount Owned:</td>
              <td>
                <OwnedAmount :salvage="selected" />
              </td>
            </tr>
            <tr>
              <td>Needed By</td>
              <td>
                <div class="container">
                  <div class="row">
                    <div v-for="unit in neededBy" :key="unit.id" class="col">
                      <div class="border-bottom mb-1 text-center">
                        <router-link
                          :to="{
                            name: 'UnitPage',
                            params: { unitId: unit.id },
                          }"
                          >{{ unit.name }}</router-link
                        >
                      </div>
                      <div v-for="tier in unit.gearLevels" :key="tier.level">
                        <GearText :level="tier.level" />:
                        <span class="ml-1">{{ tier.amount }}</span>
                      </div>
                      <div
                        class="border-top mt-1"
                        v-if="unit.gearLevels.length > 1"
                      >
                        Total: {{ unit.totalAmount }}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { Gear, INeededBy } from "types/gear";
import GearIcon from "components/gear/gearIcon.vue";
import GearText from "components/gear/gearText.vue";
import OwnedAmount from "components/gear/gearOwned.vue";
import { Unit } from "types/unit";

const storageKey = "gearPage";

interface dataModel {
  storageKey: string;
  selected: null | Gear;
}

export default defineComponent({
  name: "GearPage",
  components: { GearIcon, GearText, OwnedAmount },
  data() {
    return {
      storageKey,
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapGetters("planner", ["fullUnitList"]),
    neededBy(): INeededBy[] | null {
      if (this.selected) {
        const list: INeededBy[] = [];
        this.fullUnitList.forEach((unit: Unit) => {
          unit.fullSalvageList.forEach((gear: Gear) => {
            if (gear.id === this.selected?.id) {
              list.push(...gear.neededBy);
              this.selected.totalAmount += gear.totalAmount;
            }
          });
        });
        return list;
      } else {
        return null;
      }
    },
  },
  created() {
    if (this.$route.params.id) {
      const match = this.gearList.find(
        (x: Gear) => x.id === this.$route.params.id
      );
      if (match) {
        this.selected = match;
      } else {
        this.$router.push({ name: "GearList" });
      }
    } else {
      this.$router.push({ name: "GearList" });
    }
  },
});
</script>

<style lang="scss" scoped>
::v-deep(.gear-border) {
  max-width: 105px;
  img {
    width: 100px;
    max-width: 100px;
  }
}
</style>
