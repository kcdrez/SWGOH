<template>
  <div class="container">
    <div class="row">
      <div class="col">
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
          <select
            class="form-control"
            v-model="editSettings.conquest.difficulty"
          >
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
        <div class="input-group input-group-sm mb-2">
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
        <div class="input-group input-group-sm mb-2">
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
        </div>
        <div class="input-group input-group-sm mb-2">
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
        <hr class="w-50 mx-auto" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { ISettings } from "types/player";
import { unvue } from "utils";

type dataModel = {
  editSettings: ISettings;
};

export default defineComponent({
  name: "SettingsPage",
  data() {
    return {
      editSettings: {
        calculateCompletion: false,
        completionDate: moment().add(1, "days").format("YYYY-MM-DD"),
        startDate: moment().format("YYYY-MM-DD"),
        startPercent: 0,
        assaultBattles: {
          ct0: 0,
          ct1: 0,
          ct2: 0,
          ct3: 0,
        },
        conquest: {
          difficulty: "easy",
          box: "box1",
        },
        gc: {
          box: "box1",
        },
        gac: {
          league: "carbonite",
          division: 1,
          rank: "rank8",
        },
      },
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
  },
  methods: {
    ...mapActions("player", ["saveSettings"]),
  },
  watch: {
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

        this.saveSettings(newVal);
      },
    },
  },
  created() {
    if (this.player.settings) {
      this.editSettings = unvue(this.player.settings);
    }
  },
});
</script>

<style lang="scss" scoped></style>
