<template>
  <div class="swgoh-page container my-2">
    <div class="row">
      <div class="col">
        <table
          class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
        >
          <thead>
            <tr>
              <th colspan="100%">Carbonite Circuit Board</th>
            </tr>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Needed By</th>
            </tr>
          </thead>
          <tbody class="align-middle">
            <tr v-for="gear in circuitBoards" :key="gear.data.id">
              <td>
                <GearIcon :gear="gear.data" />
              </td>
              <td>{{ gear.data.name }}</td>
              <td>{{ gear.scavenger.count }}</td>
              <td>{{ gear.data.neededBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { Gear, INeededBy } from "../types/gear";
import GearIcon from "../components/gear/gearIcon.vue";
import UnitData from "../components/units/unitData.vue";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";

export default defineComponent({
  name: "ScavengerPage",
  components: { GearIcon },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapGetters("planner", ["fullUnitList"]),
    circuitBoards() {
      return this.gearList.reduce((acc: any[], gear: Gear) => {
        const match = gear.scavenger.find(
          (x) => x.id === "carbonite_circuit_board"
        );
        if (match) {
          acc.push({
            data: gear,
            scavenger: match,
          });
        }
        return acc;
      }, []);
    },
  },
  methods: {},
  created() {
    this.fullUnitList.forEach((unit: Unit) => {
      unit.fullSalvageList.forEach((gear: Gear) => {
        const match: Gear = this.gearList.find((x: Gear) => x.id === gear.id);

        if (match) {
          gear.neededBy.forEach((x) => {
            const el = match.neededBy.find((y) => y.id === x.id);
            if (el) {
              el.totalAmount += x.totalAmount;
              el.gearLevels.push(...x.gearLevels);
            } else {
              match.neededBy.push(x);
            }
          });
          // match.neededBy = gear.neededBy;
          // match.neededBy.push({
          //   id: unit.id,
          //   name: unit.name,
          //   totalAmount: gear.totalAmount,
          //   gearLevels: gear.neededBy,
          // });
          // list.push(...match.neededBy);
          // this.selected.totalAmount += gear.totalAmount;
        }
      });
    });
  },
});
</script>

<style lang="scss" scoped></style>
