<template>
  <div class="container general-planner-page">
    <table class="table table-bordered table-dark table-sm table-striped">
      <thead>
        <tr class="text-center align-middle">
          <th width="5%">Priority</th>
          <th width="20%">
            <div class="c-pointer" @click="sortBy('name')">
              Unit Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchName"
            />
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('curLevel')">
            Current Level
            <i class="fas mx-1" :class="sortIcon('curLevel')"></i>
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('targetLevel')">
            Target Level
            <i class="fas mx-1" :class="sortIcon('targetLevel')"></i>
          </th>
          <!-- <th width="20%" class="c-pointer" @click="sortBy('zeta')">
            Zetas
            <i class="fas mx-1" :class="sortIcon('zeta')"></i>
          </th> -->
          <!-- <th width="10%" class="c-pointer" @click="sortBy('unlock')">
            Est. 7*
            <i class="fas mx-1" :class="sortIcon('unlock')"></i>
          </th> -->
          <!-- <th width="10%" class="c-pointer" @click="sortBy('estZeta')">
            Est. Zetas
            <i class="fas mx-1" :class="sortIcon('estZeta')"></i>
          </th> -->
          <th width="15%" class="c-pointer" @click="sortBy('estGear')">
            Est. Gear Level
            <i class="fas mx-1" :class="sortIcon('estGear')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('estRelic')">
            Est. Relic Level
            <i class="fas mx-1" :class="sortIcon('estRelic')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('completed')">
            Est. Completed Date
            <i class="fas mx-1" :class="sortIcon('completed')"></i>
          </th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">1</td>
          <td class="text-center">Jedi Knight Luke</td>
          <td class="text-center">Gear 10</td>
          <td class="text-center">Relic 7</td>
          <td class="text-center">01/01/22 (10 days)</td>
          <td class="text-center">01/01/22 (10 days)</td>
          <td class="text-center">01/01/22 (10 days)</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import Loading from "../components/loading.vue";
import Error from "../components/error.vue";

export default defineComponent({
  name: "GeneralPlannerPage",
  components: { Loading, Error },
  data() {
    return {
      sortDir: "",
      sortMethod: "",
    };
  },
  computed: {},
  methods: {
    sortBy(type: string): void {
      if (this.sortMethod === type) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortDir = "asc";
      }
      this.sortMethod = type;
    },
    sortIcon(type: string): string {
      if (this.sortMethod === type) {
        return this.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
  },
  async created() {},
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.general-planner-page {
  max-width: 90%;
}
</style>
