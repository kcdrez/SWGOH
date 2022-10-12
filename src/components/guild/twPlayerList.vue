<template>
  <table
    v-if="players"
    class="table table-bordered table-dark table-sm table-striped swgoh-table"
  >
    <thead class="sticky-header show-on-mobile align-middle text-center">
      <tr>
        <th>
          <div class="c-pointer" @click="sortBy('name')">
            Name
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </div>
          <input
            class="form-control form-control-sm mx-auto my-1 w-75"
            placeholder="Search"
            v-model="searchText"
          />
        </th>
        <th @click="sortBy('joined')" class="c-pointer">
          <span>Has Joined?</span>
          <i class="fas mx-1" :class="sortIcon('joined')"></i>
        </th>
        <template v-for="unit in units" :key="unit.id">
          <th
            v-if="showCol(unit.id)"
            @click="sortBy(unit.id)"
            class="c-pointer"
          >
            <span>{{ unit.name }}</span>
            <i class="fas mx-1" :class="sortIcon(unit.id)"></i>
          </th>
        </template>
        <th @click="sortBy('omicrons')" class="c-pointer">
          <span>TW Omicrons</span>
          <i class="fas mx-1" :class="sortIcon('omicrons')"></i>
        </th>
      </tr>
    </thead>
    <tbody class="align-center text-center">
      <tr v-for="player in filteredPlayers" :key="player.allyCode">
        <td>{{ player.name }}</td>
        <td>
          <template v-if="accessLevel >= 3">
            <input
              type="checkbox"
              v-model="_playersJoined"
              :value="player.allyCode"
            />
          </template>
          <template v-else>
            <i
              class="fa fa-check text-success"
              v-if="_playersJoined.includes(player.allyCode)"
            ></i>
            <i class="fa fa-times text-danger" v-else></i>
          </template>
        </td>
        <template v-for="unit in units" :key="unit.id">
          <th v-if="showCol(unit.id)">
            <i
              class="fa fa-check text-success"
              v-if="player.units.some((x) => x.base_id === unit.id)"
            ></i>
            <i class="fa fa-times text-danger" v-else></i>
          </th>
        </template>
        <td class="text-left">
          <ul class="m-0">
            <li v-for="unitName in getOmicrons(player)" :key="unitName">
              {{ unitName }}
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapState } from "vuex";

import { setupColumnEvents, setupSorting } from "utils";
import { Unit } from "types/unit";

interface dataModel {
  _playersJoined: string[];
}

export default defineComponent({
  name: "TWPlayerList",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      showCol,
    };
  },
  props: {
    storageKey: {
      type: String,
      required: true,
    },
    players: {
      required: true,
      type: Array as () => { allyCode: string; name: string; units: any[] }[],
    },
    units: {
      required: true,
      type: Array as () => Unit[],
    },
    playersJoined: {
      required: true,
      type: Array as () => string[],
    },
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
  },
  data() {
    return {
      _playersJoined: this.playersJoined,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["accessLevel"]),
    filteredPlayers() {
      return this.players
        .filter((player: any) => {
          const name = player.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: any, b: any) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "joined") {
            const aJoined = this._playersJoined.includes(a.allyCode);
            if (this.sortDir === "asc") {
              return aJoined ? -1 : 1;
            } else {
              return aJoined ? 1 : -1;
            }
          } else if (this.sortMethod === "omicrons") {
            const aOmis = this.getOmicrons(a);
            const bOmis = this.getOmicrons(b);
            if (this.sortDir === "asc") {
              return aOmis.length > bOmis.length ? 1 : -1;
            } else {
              return aOmis.length > bOmis.length ? -1 : 1;
            }
          } else if (this.units.some((x) => x.id === this.sortMethod)) {
            const aUnit = a.units.some(
              (x: any) => x.base_id === this.sortMethod
            );
            if (this.sortDir === "asc") {
              return aUnit ? -1 : 1;
            } else {
              return aUnit ? 1 : -1;
            }
          }
          return 0;
        });
    },
  },
  watch: {
    _playersJoined(newVal) {
      this.$emit("joined", newVal);
    },
  },
  methods: {
    getOmicrons(player: any): string[] {
      return player.units.reduce((list: string[], unit: any) => {
        if (unit.omicron_abilities.length > 0) {
          list.push(unit.name);
        }
        return list;
      }, []);
    },
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 396px;
}
</style>
