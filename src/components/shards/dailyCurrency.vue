<template>
  <input
    v-if="allowEdit"
    class="form-control form-control-sm"
    type="number"
    v-model.number="dailyAvg"
    min="0"
    @keydown.enter="saveDailyAverage"
    @blur="saveDailyAverage"
    @change="saveDailyAverage"
  />
  <span v-else>{{ dailyAvg }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "DailyCurrency",
  props: {
    currencyType: {
      type: String,
      required: true,
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dailyAvg: 0,
    };
  },
  computed: {
    ...mapState("currency", ["dailyCurrency"]),
  },
  methods: {
    saveDailyAverage() {
      this.dailyCurrency[this.currencyType] = this.dailyAvg;
    },
    resetAvg() {
      this.dailyAvg = this.dailyCurrency[this.currencyType];
    },
  },
  watch: {
    dailyCurrency: {
      handler(val) {
        this.resetAvg();
      },
      deep: true,
    },
  },
  created() {
    this.resetAvg();
  },
});
</script>

<style lang="scss" scoped></style>
