<template>
  <SwgohTable :table="{ header, body }" v-if="players" />
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapState } from "vuex";

import { setupColumnEvents, setupSorting } from "utils";
import { Unit } from "types/unit";
import { iHeaderCell, iTableBody, iTableCell, iTableHead } from "types/general";

interface dataModel {
  _playersJoined: string[];
  showJoined: boolean;
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
      showJoined: false,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["accessLevel"]),
    header(): iTableHead {
      const unitHeaders: iHeaderCell[] = this.units.map((unit) => {
        return {
          label: unit.name,
          show: this.showCol(unit.id),
          icon: this.sortIcon(unit.id),
          click: () => {
            this.sortBy(unit.id);
          },
        };
      });

      return {
        classes: "sticky-header show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Name",
                show: true,
                icon: this.sortIcon("name"),
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  value: this.searchText,
                  click: () => {
                    this.sortBy("name");
                  },
                },
              },
              {
                label: "Has Joined?",
                show: true,
                icon: this.sortIcon("joined"),
                click: () => {
                  this.sortBy("joined");
                },
                input: {
                  type: "checkbox",
                  placeholder: "Show/Hide Joined",
                  value: false,
                  click: (val: any) => {
                    this.showJoined = val;
                  },
                },
              },
              ...unitHeaders,
              {
                label: "TW Omicrons",
                show: true,
                icon: this.sortIcon("omicrons"),
                click: () => {
                  this.sortBy("omicrons");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.filteredPlayers.map((player: any) => {
          const unitCells: iTableCell[] = this.units.map((unit: Unit) => {
            return {
              show: this.showCol(unit.id),
              type: "checkmark",
              label: unit.name,
              labelClasses: "mx-2",
              data: {
                classes: player.units.some((x: any) => x.base_id === unit.id)
                  ? "text-success"
                  : "text-danger",
                checked: player.units.some((x: any) => x.base_id === unit.id),
              },
            };
          });

          return {
            cells: [
              {
                show: true,
                data: player.name,
              },
              {
                type: "checkbox",
                show: this.accessLevel >= 3,
                label: "Has Joined?",
                data: {
                  value: player.allyCode,
                  checked: this._playersJoined.includes(player.allyCode),
                },
                change: (allyCode: any) => {
                  const index = this._playersJoined.findIndex(
                    (x) => x === allyCode
                  );
                  if (index >= 0) {
                    this._playersJoined.splice(index, 1);
                  } else {
                    this._playersJoined.push(allyCode);
                  }
                },
              },
              {
                type: "checkmark",
                show: this.accessLevel < 3,
                data: {
                  checked: this._playersJoined.includes(player.allyCode),
                  classes: this._playersJoined.includes(player.allyCode)
                    ? "text-success"
                    : "text-danger",
                },
              },
              ...unitCells,
              {
                show: true,
                classes: "text-left text-center-sm",
                label: "Omicrons:",
                // labelClasses: "text-center-sm",
                data: {
                  classes: "m-0 no-bullets-sm text-center-sm",
                  list: this.getOmicrons(player).map((unit) => {
                    return {
                      id: unit,
                      message: unit,
                    };
                  }),
                },
                type: "list",
              },
            ],
          };
        }),
      };
    },
    filteredPlayers() {
      return this.players
        .filter((player: any) => {
          const name = player.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          if (this.showJoined) {
            return (
              name.includes(compare) &&
              this._playersJoined.includes(player.allyCode)
            );
          } else {
            return name.includes(compare);
          }
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
    playersJoined(newVal) {
      this._playersJoined = newVal;
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
  top: 316px;
}
</style>
