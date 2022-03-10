<template>
  <input
    class="form-control form-control-sm"
    type="number"
    v-model.number="walletValue"
    min="0"
    @keydown="save"
    @change="save"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import _ from "lodash";

export default defineComponent({
  name: "Wallet",
  props: {
    currencyType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      walletValue: 0,
    };
  },
  computed: {
    ...mapState("currency", ["wallet", "dailyCurrency"]),
  },
  methods: {
    save: _.debounce(function (this: any) {
      this.wallet[this.currencyType] = this.walletValue;
    }, 1000),
    resetValue() {
      this.walletValue = this.wallet[this.currencyType];
    },
  },
  watch: {
    wallet: {
      handler(val) {
        this.resetValue();
      },
      deep: true,
    },
  },
  created() {
    this.resetValue();
  },
});
</script>

<style lang="scss" scoped></style>
