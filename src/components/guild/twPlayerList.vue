<template>
  <div>
    <div class="collapse-header section-header extended-1">
      <h3>
        <div data-bs-toggle="collapse" href="#player-list">Player List</div>
      </h3>
      <div class="toggles-container">
        <MultiSelect
          class="select-columns"
          :options="cols"
          :storageKey="storageKey + 'PlayerColumns'"
          @checked="selectedColumns = $event"
        />
      </div>
    </div>
    <div id="player-list" class="collapse" ref="playerList">
      <table
        v-if="players"
        class="table table-bordered table-dark table-sm table-striped swgoh-table"
      >
        <thead class="sticky-header show-on-mobile align-middle text-center">
          <tr>
            <th v-if="showCol('name')">
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
            <th
              v-if="showCol('joined')"
              @click="sortBy('joined')"
              class="c-pointer"
            >
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
            <th
              v-if="showCol('omicrons')"
              @click="sortBy('omicrons')"
              class="c-pointer"
            >
              <span>TW Omicrons</span>
              <i class="fas mx-1" :class="sortIcon('omicrons')"></i>
            </th>
          </tr>
        </thead>
        <tbody class="align-center text-center">
          <tr v-for="player in filteredPlayers" :key="player.allyCode">
            <td v-if="showCol('name')">{{ player.name }}</td>
            <td v-if="showCol('joined')">
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
            <td v-if="showCol('omicrons')" class="text-left">
              <ul class="m-0">
                <li v-for="unitName in getOmicrons(player)" :key="unitName">
                  {{ unitName }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { mapActions, mapState } from "vuex";

import { Gear } from "types/gear";
import OwnedAmount from "components/gear/gearOwned.vue";
import GearIcon from "components/gear/gearIcon.vue";
import Timestamp from "components/timestamp.vue";
import GearText from "components/gear/gearText.vue";
import { setupColumnEvents, setupSorting } from "utils";
import { Unit } from "types/unit";

interface dataModel {
  selectedColumns: string[];
  _playersJoined: string[];
}

export default defineComponent({
  name: "TWPlayerList",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );
    // const list = toRefs(props).selectedColumns;
    // const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      // showCol,
    };
  },
  components: {},
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
  },
  data() {
    return {
      selectedColumns: [],
      _playersJoined: this.playersJoined,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["accessLevel"]),
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Player Name",
          value: "name",
        },
        {
          text: "Has Joined?",
          value: "joined",
        },
        {
          text: "TW Omicrons",
          value: "omicrons",
        },
      ];
      return [
        ...list,
        ...this.units.map((unit: Unit) => {
          return {
            text: unit.name,
            value: unit.id,
          };
        }),
      ];
    },
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
            // const bJoined = this._playersJoined.includes(b.allyCode);
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
            // const bUnit = b.units.some(
            //   (x: any) => x.base_id === this.sortMethod
            // );
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
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
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
.empty-search {
  font-size: 1.5rem;
  text-align: center;
}
</style>
