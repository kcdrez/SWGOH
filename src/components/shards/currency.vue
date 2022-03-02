<template>
  <div>
    <div class="input-group input-group-sm">
      <span class="input-group-text wallet-count">Wallet:</span>
      <input
        class="form-control owned-count"
        type="number"
        v-model.number="wallet"
        min="0"
        @keydown.enter="save"
        @blur="save"
        ref="saveButton"
      />
    </div>
    <div class="input-group input-group-sm mt-2">
      <span
        class="input-group-text wallet-count c-help"
        title="The remaining shards needed to get this character to 7 stars"
        >Daily Avg:</span
      >
      <span class="input-group-text daily-count">{{ dailyAvg }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { Unit } from "../../types/unit";
import { unvue } from "../../utils";

export default defineComponent({
  name: "Currency",
  props: {
    currencyType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dailyAvg: 0,
    };
  },
  computed: {
    ...mapGetters("currency", ["dailyAvgGET1", "dailyAvgGET2"]),
    ...mapState("currency", ["wallet"]),
  },
  methods: {
    save() {},
    edit() {
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
  },
  created() {
    if (this.currencyType === "GET1") {
      this.dailyAvg = this.dailyAvgGET1;
    } else if (this.currencyType === "GET2") {
      this.dailyAvg = this.dailyAvgGET2;
    }
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
