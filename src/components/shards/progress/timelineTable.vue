<template>
  <ExpandableSection
    title="Timeline Planner"
    :idRef="storageKey"
    :options="expandOptions"
    class="my-2"
  >
    <div class="mx-3">
      <TimelineGearTable :goal="goal" :prerequisites="prerequisites" />
      <TimelineRelicTable :goal="goal" :prerequisites="prerequisites" />
    </div>
  </ExpandableSection>
  <Modal :isOpen="showEditModal">
    <template v-slot:header>Edit Goal Settings</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-2">
        <span
          class="input-group-text c-help"
          title="If enabled, the completion date will be automatically calculated for you based on your current progression. If disabled, you can enter the end date manually"
        >
          Calculate Completion Date Automatically:
        </span>
        <span class="input-group-text fill">
          <Toggle
            v-model="editSettings.calculateCompletion"
            onLabel="Yes"
            offLabel="No"
            class="border"
          />
        </span>
      </div>
      <div
        class="input-group input-group-sm mb-2"
        v-if="editSettings.calculateCompletion"
      >
        <span class="input-group-text">Estimated Completion Date:</span>
        <span class="input-group-text fill"
          >{{ daysFromNow(goal.daysRemaining) }} ({{
            goal.daysRemaining
          }}
          days)</span
        >
      </div>
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text">Current Progress:</span>
        <span class="input-group-text fill">
          <ProgressBar :percent="goal.progress" class="w-100" />
        </span>
      </div>
      <hr />
      <template v-if="editSettings.calculateCompletion">
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text">Start Date:</span>
          <input
            class="form-control"
            type="date"
            v-model="editSettings.startDate"
          />
        </div>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text">Start Percent:</span>
          <input
            class="form-control"
            type="number"
            v-model.number="editSettings.startPercent"
            min="0"
            :max="goal.progress - 0.01"
          />
        </div>
      </template>
      <div class="input-group input-group-sm mb-2" v-else>
        <span class="input-group-text">Target Completion Date:</span>
        <input
          class="form-control"
          type="date"
          v-model="editSettings.completionDate"
        />
      </div>
      <hr class="w-50 mx-auto" />
      <div>
        <div
          class="c-help"
          title="Enter the number of assault battle modes you are able to complete the given level"
        >
          Assault Battles
        </div>
        <div class="input-group input-group-sm mb-2">
          <span
            class="input-group-text c-help"
            title="The number of assault battles you can consistently complete Challenge Tier 1"
            >Challenge Tier 1:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="editSettings.assaultBattles.ct1"
            min="0"
            max="6"
          />
        </div>
        <div class="input-group input-group-sm mb-2">
          <span
            class="input-group-text c-help"
            title="The number of assault battles you can consistently complete Challenge Tier 2"
            >Challenge Tier 2:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="editSettings.assaultBattles.ct2"
            min="0"
            max="6"
          />
        </div>
        <div class="input-group input-group-sm mb-2">
          <span
            class="input-group-text c-help"
            title="The number of assault battles you can consistently complete Challenge Tier 3"
            >Challenge Tier 3:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="editSettings.assaultBattles.ct3"
            min="0"
            max="6"
          />
        </div>
      </div>
      <hr class="w-50 mx-auto" />
      <div>
        <div
          class="c-help"
          title="Enter the difficulty and average reward box you usually recieve"
        >
          Conquest
        </div>
      </div>
      <div class="input-group input-group-sm">
        <select class="form-control" v-model="editSettings.conquest.difficulty">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
        <select class="form-control" v-model="editSettings.conquest.box">
          <option value="box1">Light Blue Crate (Box 1)</option>
          <option value="box2">Bronze Crate (Box 2)</option>
          <option value="box3">Dark Blue Crate (Box 3)</option>
          <option value="box4">Gray Crate (Box 4)</option>
          <option value="box5">White Crate (Box 5)</option>
          <option value="box6">Gold Crate (Box 6)</option>
          <option value="box7">Red Crate (Box 7)</option>
        </select>
      </div>
      <hr class="w-50 mx-auto" />
      <div>
        <div
          class="c-help"
          title="Enter the average reward box you usually recieve from Galactic Challenges"
        >
          Galactic Challenges
        </div>
      </div>
      <div class="input-group input-group-sm">
        <select class="form-control" v-model="editSettings.gc.box">
          <option value="box1">Small Gold Crate (Box 1)</option>
          <option value="box2">Small White Crate (Box 2)</option>
          <option value="box3">Small Dark Blue Crate (Box 3)</option>
          <option value="box4">Dark Blue Crate (Box 4)</option>
          <option value="box5">Bronze Crate (Box 5)</option>
          <option value="box6">Silver/Dark Blue Crate (Box 6)</option>
          <option value="box7">Silver/Light Blue Crate (Box 7)</option>
          <option value="box8">Silver/Bronze Crate (Box 8)</option>
          <option value="box9">Gold Crate (Box 9)</option>
          <option value="box10">Red Crate (Box 10)</option>
        </select>
      </div>
      <hr class="w-50 mx-auto" />
      <div
        class="c-help"
        title="Enter the average placement in league, division, and weekly rank placement for your GAC"
      >
        Grand Arena (GAC)
      </div>
      <!-- <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help"
          title="The league you are currently in"
          >League:</span
        >
        <select class="form-control" v-model="editSettings.gac.league">
          <option value="kyber">Kyber</option>
          <option value="aurodium">Aurodium</option>
          <option value="chromium">Chromium</option>
          <option value="bronzium">Bronzium</option>
          <option value="carbonite">Carbonite</option>
        </select>
      </div>
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help"
          title="The division in the given league you are currently in"
          >Division:</span
        >
        <input
          type="number"
          min="1"
          max="5"
          class="form-control"
          v-model.number="editSettings.gac.division"
        />
      </div> -->
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help"
          title="Your average rank you get in GAC each week"
          >Rank:</span
        >
        <select class="form-control" v-model="editSettings.gac.rank">
          <option value="rank1">1</option>
          <option value="rank2">2</option>
          <option value="rank3">3</option>
          <option value="rank4">4</option>
          <option value="rank5">5</option>
          <option value="rank6">6</option>
          <option value="rank7">7</option>
          <option value="rank8">8</option>
        </select>
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="showEditModal = false"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import _ from "lodash";
import moment from "moment";

import Modal from "components/general/modal.vue";
import TimelineGearTable from "./timelineGearTable.vue";
import TimelineRelicTable from "./timelineRelicTable.vue";
import { Unit } from "types/unit";
import { Goal, ISettings } from "types/goals";
import { daysFromNow, setupColumnEvents, setupSorting } from "utils";
import { iExpandOptions } from "types/general";

export default defineComponent({
  name: "TimelineTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      selectedColumns,
      showCol,
    };
  },
  components: { Modal, TimelineGearTable, TimelineRelicTable },
  props: {
    goal: {
      type: Object as () => Goal,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
    prerequisites: {
      required: true,
      type: Object as () => {
        list: Unit[];
        relicTargets: Object;
        gearTargets: Object;
      },
    },
  },
  data() {
    return {
      showEditModal: false,
      editSettings: {
        calculateCompletion: this.goal.settings?.calculateCompletion ?? false,
        completionDate:
          this.goal.settings?.completionDate ??
          moment().add(1, "days").format("YYYY-MM-DD"),
        startDate:
          this.goal.settings?.startDate ?? moment().format("YYYY-MM-DD"),
        startPercent: this.goal.settings?.startPercent ?? 0,
        assaultBattles: this.goal.settings?.assaultBattles ?? 0,
        conquest: this.goal.settings?.conquest ?? {
          difficulty: "easy",
          box: "box1",
        },
        gc: this.goal.settings?.gc ?? {
          box: "box1",
        },
        gac: this.goal.settings?.gac ?? {
          league: "carbonite",
          division: 1,
          rank: "rank8",
        },
      },
    } as any;
  },
  computed: {
    expandOptions(): iExpandOptions {
      const options: iExpandOptions = {
        buttons: [
          {
            classes: "fas fa-cog text-small mx-1",
            title: "Edit Settings",
            click: () => {
              this.showEditModal = true;
            },
          },
        ],
      };

      return options;
    },
  },
  methods: {
    daysFromNow,
  },
  watch: {
    goal: {
      handler(newGoal: Goal) {
        if (!_.isEqual(this.editSettings, newGoal.settings)) {
          this.editSettings = newGoal.settings;
        }
      },
      deep: true,
    },
    editSettings: {
      deep: true,
      handler(newVal: ISettings) {
        const { ct1, ct2, ct3 } = newVal.assaultBattles;
        if (ct3 > ct2) {
          this.editSettings.assaultBattles.ct2 = ct3;
        }
        if (ct3 > ct1) {
          this.editSettings.assaultBattles.ct1 = ct3;
        }
        if (ct2 > ct1) {
          this.editSettings.assaultBattles.ct1 = ct2;
        }

        this.goal.saveSettings(newVal);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

::v-deep(i.text-small) {
  cursor: pointer;

  &:hover {
    transform: scale(1.5);

    &.fa-edit,
    &.fa-plus {
      color: $primary;
    }
    &.fa-ban {
      color: $warning;
    }
    &.fa-save {
      color: $success;
    }
    &.fa-trash {
      color: $danger;
    }
  }
}
.total-progress-bar {
  display: flex;
  margin: 0.5rem;
  justify-content: center;

  .progress {
    flex-basis: 33.33%;

    @media only screen and (max-width: 768px) {
      flex-basis: 100%;
    }
  }
}

hr {
  opacity: 1;
}

.input-group-text.fill {
  flex: 1 1 auto;
}
</style>
