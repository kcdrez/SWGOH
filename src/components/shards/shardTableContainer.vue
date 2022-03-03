<template>
  <div class="mb-3">
    <MultiSelect
      class="select-columns my-2"
      :options="cols"
      storageKey="shardTable"
      @checked="selectedColumns = $event"
    />
    <template v-if="standardHoloTable.length > 0">
      <div class="collapse-header section-header">
        <h3 class="w-100" data-bs-toggle="collapse" href="#holoTableSection">
          <div class="d-inline">Light & Dark Side Battles</div>
        </h3>
      </div>
      <ShardTable
        id="holoTableSection"
        class="collapse"
        ref="holoTableSection"
        :units="standardHoloTable"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Light Side', 'Dark Side']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="fleet.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#fleetSection">
          <div class="d-inline">Fleet Battles</div>
        </h3>
      </div>
      <ShardTable
        id="fleetSection"
        class="collapse"
        ref="fleetSection"
        :units="fleet"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Fleet']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="cantina.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#cantinaSection">
          <div class="d-inline">Cantina Battles</div>
        </h3>
      </div>
      <ShardTable
        id="cantinaSection"
        class="collapse"
        ref="cantinaSection"
        :units="cantina"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Cantina']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="territoryBattles.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#territoryBattlesSection"
        >
          <div class="d-inline">Territory Battle Units</div>
        </h3>
      </div>
      <TerritoryBattleShardTable
        id="territoryBattlesSection"
        class="collapse"
        ref="territoryBattlesSection"
        :units="territoryBattles"
        :selectedColumns="selectedColumns"
        showUnitName
      />
    </template>
    <template v-if="raids.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#raidsSection">
          <div class="d-inline">Raid Units</div>
        </h3>
      </div>
      <ShardTable
        id="raidsSection"
        class="collapse"
        ref="raidsSection"
        :units="raids"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Raids']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="conquest.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#conquestSection">
          <div class="d-inline">Conquest Units</div>
        </h3>
      </div>
      <ShardTable
        id="conquestSection"
        class="collapse"
        ref="conquestSection"
        :units="conquest"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Conquest']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="cantinaStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#cantinaStoreSection">
          <div class="d-inline">Cantina Store</div>
        </h3>
      </div>
      <ShardTable
        id="cantinaStoreSection"
        class="collapse"
        ref="cantinaStoreSection"
        :units="cantinaStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Cantina Battles Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="guildStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#guildStoreSection">
          <div class="d-inline">Guild Store</div>
        </h3>
      </div>
      <ShardTable
        id="guildStore"
        class="collapse"
        ref="guildStore"
        :units="guildStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Guild Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="squadArenaStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#squadArenaStoreSection"
        >
          <div class="d-inline">Squad Arena Store</div>
        </h3>
      </div>
      <ShardTable
        id="squadArenaStoreSection"
        class="collapse"
        ref="squadArenaStoreSection"
        :units="squadArenaStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Squad Arena Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="galacticWarStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#galacticWarStoreSection"
        >
          <div class="d-inline">Galactic War Store</div>
        </h3>
      </div>
      <ShardTable
        id="galacticWarStoreSection"
        class="collapse"
        ref="galacticWarStoreSection"
        :units="galacticWarStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Galactic War Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="fleetArenaStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#fleetArenaStoreSection"
        >
          <div class="d-inline">Fleet Arena Store</div>
        </h3>
      </div>
      <ShardTable
        id="fleetArenaStoreSection"
        class="collapse"
        ref="fleetArenaStoreSection"
        :units="fleetArenaStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Fleet Arena Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="guildEventsStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildEventsStoreSection"
        >
          <div class="d-inline">Guild Events Store</div>
        </h3>
      </div>
      <ShardTable
        id="guildEventsStoreSection"
        class="collapse"
        ref="guildEventsStoreSection"
        :units="guildEventsStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="[
          'Guild Events Store (Mk 1)',
          'Guild Events Store (Mk 2)',
        ]"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="shardStore.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#shardStoreSection">
          <div class="d-inline">Shard Store</div>
        </h3>
      </div>
      <ShardTable
        id="shardStoreSection"
        class="collapse"
        ref="shardStoreSection"
        :units="shardStore"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Shard Store']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="legendary.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#legendarySection">
          <div class="d-inline">Legendary Units</div>
        </h3>
      </div>
      <ShardTable
        id="legendarySection"
        class="collapse"
        ref="legendarySection"
        :units="legendary"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Legendary Events']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
    <template v-if="galacticLegends.length > 0">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#galacticLegendsSection"
        >
          <div class="d-inline">Galactic Legends</div>
        </h3>
      </div>
      <ShardTable
        id="galacticLegendsSection"
        class="collapse"
        ref="galacticLegendsSection"
        :units="galacticLegends"
        :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
        :nodeTableNames="['Galactic Legend Events']"
        :selectedColumns="selectedColumns"
        showUnitName
        showPriority
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import ShardTable from "./shardTable.vue";
import TerritoryBattleShardTable from "./territoryBattleShardTable.vue";
import { Unit } from "../../types/unit";
import { setupEvents } from "../../utils";

export default defineComponent({
  name: "ShardTableContainer",
  components: { ShardTable, TerritoryBattleShardTable },
  data() {
    return {
      selectedColumns: [],
    };
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Attempts",
          value: "attempts",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
        {
          text: "Priority",
          value: "priority",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
    standardHoloTable(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Light Side" || node.table === "Dark Side"
        );
      });
    },
    fleet(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Fleet");
      });
    },
    cantina(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Cantina");
      });
    },
    legendary(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Legendary Events"
        );
      });
    },
    galacticLegends(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Galactic Legend Events"
        );
      });
    },
    territoryBattles(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Territory Battles"
        );
      });
    },
    raids(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Raids");
      });
    },
    conquest(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Conquest");
      });
    },
    cantinaStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Cantina Battles Store"
        );
      });
    },
    guildStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Guild Store");
      });
    },
    squadArenaStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Squad Arena Store"
        );
      });
    },
    galacticWarStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Galactic War Store"
        );
      });
    },
    fleetArenaStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Fleet Arena Store"
        );
      });
    },
    guildEventsStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) =>
            node.table === "Guild Events Store (Mk 1)" ||
            node.table === "Guild Events Store (Mk 2)"
        );
      });
    },
    shardStore(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => node.table === "Shard Store");
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      setupEvents(
        (this.$refs?.holoTableSection as any)?.$el as HTMLElement,
        "holoTableSection"
      );
      setupEvents(
        (this.$refs?.cantinaSection as any)?.$el as HTMLElement,
        "cantinaSection"
      );
      setupEvents(
        (this.$refs?.fleetSection as any)?.$el as HTMLElement,
        "fleetSection"
      );
      setupEvents(
        (this.$refs?.legendarySection as any)?.$el as HTMLElement,
        "legendarySection"
      );
      setupEvents(
        (this.$refs?.territoryBattlesSection as any)?.$el as HTMLElement,
        "territoryBattlesSection"
      );
      setupEvents(
        (this.$refs?.raidsSection as any)?.$el as HTMLElement,
        "raidsSection"
      );
      setupEvents(
        (this.$refs?.conquestSection as any)?.$el as HTMLElement,
        "conquestSection"
      );
      setupEvents(
        (this.$refs?.cantinaStoreSection as any)?.$el as HTMLElement,
        "cantinaStoreSection"
      );
      setupEvents(
        (this.$refs?.guildStoreSection as any)?.$el as HTMLElement,
        "guildStoreSection"
      );
      setupEvents(
        (this.$refs?.galacticWarStoreStore as any)?.$el as HTMLElement,
        "galacticWarStoreStore"
      );
      setupEvents(
        (this.$refs?.fleetArenaStoreSection as any)?.$el as HTMLElement,
        "fleetArenaStoreSection"
      );
      setupEvents(
        (this.$refs?.guildEventsStoreSection as any)?.$el as HTMLElement,
        "guildEventsStoreSection"
      );
      setupEvents(
        (this.$refs?.shardStoreSection as any)?.$el as HTMLElement,
        "shardStoreSection"
      );
    });
  },
});
</script>

<style lang="scss" scoped>
</style>
