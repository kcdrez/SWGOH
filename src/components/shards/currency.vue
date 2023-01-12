<template>
  <div>
    <div class="input-group input-group-sm">
      <span
        class="input-group-text wallet-count c-help"
        :title="`The amount of ${currencyType} you currently own`"
        >Wallet:</span
      >
      <input
        class="form-control owned-count"
        type="number"
        v-model.number="walletValue"
        min="0"
        @keydown.enter="saveWallet"
        @blur="saveWallet"
        @change="saveWallet"
      />
    </div>
    <div class="input-group input-group-sm mt-2">
      <span
        class="input-group-text wallet-count c-help"
        :title="`The average amount of ${currencyType} gained per day`"
        >Daily Avg:</span
      >
      <input
        v-if="allowEditAvg"
        class="form-control owned-count"
        type="number"
        v-model.number="dailyAvg"
        min="0"
        @keydown.enter="saveDailyAverage"
        @blur="saveDailyAverage"
        @change="saveDailyAverage"
      />
      <span class="input-group-text daily-count" v-else>{{ dailyAvg }}</span>
    </div>
    <div class="input-group input-group-sm mt-2">
      <span
        class="input-group-text wallet-count c-help"
        :title="`The amount of ${currencyType} needed to fully 7 star this unit`"
        >Remaining:</span
      >
      <span class="input-group-text daily-count">{{ remainingCurrency }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Currency",
  props: {
    currencyType: {
      type: String,
      required: true,
    },
    allowEditAvg: {
      type: Boolean,
      default: false,
    },
    remainingCurrency: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dailyAvg: 0,
      walletValue: 0,
    };
  },
  computed: {
    ...mapState("currency", ["wallet", "dailyCurrency"]),
  },
  methods: {
    saveWallet() {
      this.wallet[this.currencyType] = this.walletValue;
    },
    saveDailyAverage() {
      this.dailyCurrency[this.currencyType] = this.dailyAvg;
    },
    resetValue() {
      this.walletValue = this.wallet[this.currencyType];
    },
    resetAvg() {
      this.dailyAvg = this.dailyCurrency[this.currencyType];
    },
  },
  watch: {
    wallet: {
      handler(val) {
        this.resetValue();
      },
      deep: true,
    },
    dailyCurrency: {
      handler(val) {
        this.resetAvg();
      },
      deep: true,
    },
  },
  created() {
    this.resetValue();
    this.resetAvg();
  },
});
</script>

<style lang="scss" scoped>
.daily-count {
  flex: 1 1 auto;
}
.wallet-count {
  width: 90px;
}
</style>
