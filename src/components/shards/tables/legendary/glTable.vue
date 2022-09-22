<template>
  <LegendarySummaryTable
    v-if="unitList.length > 0"
    :unitList="glUnitList"
    :storageKey="storageKey + 'Table'"
    header="Galactic Legends"
    nodeKey="galactic_legends"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Unit } from "types/unit";
import LegendarySummaryTable from "./legendarySummaryTable.vue";
import { FarmingNode, NodeCharacter } from "types/shards";

const storageKey = "glUnits";

export default defineComponent({
  name: "GLTable",
  components: { LegendarySummaryTable },
  data() {
    return {
      storageKey,
    };
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("player", ["player"]),
    ...mapState("unit", ["unitList"]),
    glUnitList(): (Unit | NodeCharacter)[] {
      return this.shardFarming.reduce(
        (characterList: (Unit | NodeCharacter)[], node: FarmingNode) => {
          if (node.id === "galactic_legends") {
            node.characters.forEach((char) => {
              const playerUnit = this.player.units.find(
                (u: Unit) => u.id === char.id
              );
              if (playerUnit) {
                if (
                  (playerUnit.isGL && !playerUnit.hasUlt) ||
                  playerUnit.stars < 7
                ) {
                  characterList.push(playerUnit);
                }
              } else {
                const unownedUnit = this.unitList.find(
                  (x: Unit) => x.id === char.id
                );
                if (unownedUnit) {
                  characterList.push(unownedUnit);
                } else {
                  characterList.push(char);
                }
              }
            });
          }
          return characterList;
        },
        []
      );
    },
  },
});
</script>
