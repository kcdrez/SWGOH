<template>
  <td
    :class="cell.classes"
    v-if="cell.show"
    :colspan="cell.colspan"
    :rowspan="cell.rowspan"
  >
    <span class="row-label mx-1" :class="cell.labelClasses" v-if="cell.label">{{
      cell.label
    }}</span>
    <div
      v-if="cell.zeroState?.show"
      class="text-center"
      :class="cell.zeroState?.classes"
    >
      {{ cell.zeroState.message }}
    </div>
    <template v-else>
      <template v-if="cell.type === 'link'">
        <router-link :to="cell.data">{{ cell.value }}</router-link>
      </template>
      <template v-else-if="cell.type === 'progress'">
        <ProgressBar :percent="cell.data" />
      </template>
      <template v-else-if="cell.type === 'unit'">
        <UnitIcon
          :unit="cell.data.unit ?? getUnit(cell.data.id)"
          :isLink="cell.data.isLink"
          :hideImage="cell.data.hideImage"
          :level="cell.data.level"
          :type="cell.data.type"
        />
      </template>
      <template v-else-if="cell.type === 'unitLevel'">
        <RequirementIcon
          :type="cell.data?.type"
          :unitId="cell.data.unitId"
          :value="cell.data?.value"
          :class="cell.data?.classes"
          :edit="cell.edit"
        />
      </template>
      <template v-else-if="cell.type === 'targetLevel'">
        <TargetLevel
          :value="cell.data.value"
          :type="cell.data.type"
          @dataChange="handleChange($event)"
        />
      </template>
      <template v-else-if="cell.type === 'buttons'">
        <div
          class="btn-group btn-group-sm text-center"
          role="group"
          :class="cell.data.groupClasses"
        >
          <template v-for="(button, index) in cell.data.buttons">
            <button
              :key="index"
              v-if="!button.hide"
              @click="button.click"
              :class="button.classes"
              :title="button.title"
              :disabled="button.disabled"
            >
              <i v-if="button.icon" :class="button.icon"></i>
              <span v-if="button.label">{{ button.label }}</span>
            </button>
          </template>
        </div>
      </template>
      <template v-else-if="cell.type === 'gear'">
        <GearIcon :gear="cell.data.gear" :showName="cell.data.showName" />
      </template>
      <template v-else-if="cell.type === 'gearList'">
        <GearIcon
          v-for="id in cell.data.ids"
          :key="id"
          :gearId="id"
          :showName="cell.data.showName"
        />
      </template>
      <template v-else-if="cell.type === 'relic'">
        <RelicIcon :item="cell.data" />
      </template>
      <template v-else-if="cell.type === 'gearOwned'">
        <GearOwned :salvage="cell.data" />
      </template>
      <template v-else-if="cell.type === 'relicOwned'">
        <RelicOwned :item="cell.data.item" :needed="cell.data.needed" />
      </template>
      <template v-else-if="cell.type === 'buttonToggle'">
        <button
          :class="cell.data.buttonClasses"
          data-bs-toggle="collapse"
          :href="`#${cell.data.id}`"
        >
          {{ cell.data.message }}
        </button>
        <template v-if="cell.data.type === 'list'">
          <ul
            class="collapse"
            :class="cell.data.listData.classes"
            :id="cell.data.id"
          >
            <li v-for="(l, index) in cell.data.listData.elements" :key="index">
              {{ l }}
            </li>
          </ul>
        </template>
        <template v-else> Unknown sub type for buttonToggle </template>
      </template>
      <template v-else-if="cell.type === 'list'">
        <div v-if="cell.show">
          <ul :class="cell.data.classes">
            <template v-for="el in cell.data.list" :key="el.id">
              <li v-if="!el.hidden" :class="el.classes">
                <Popper
                  v-if="el.popover"
                  :hover="el.popover.hover"
                  :arrow="el.popover.arrow"
                  :placement="el.popover.placement"
                  :class="el.popover.containerClasses"
                >
                  <router-link
                    v-if="el.type === 'link'"
                    :to="el.data"
                    :class="el.popover.classes"
                    >{{ el.message }}</router-link
                  >
                  <div v-else :class="el.popover.classes">{{ el.message }}</div>
                  <template #content>
                    <div
                      :class="el.popover.header.classes"
                      v-if="el.popover.header"
                    >
                      {{ el.popover.header.message }}
                    </div>
                    <template v-if="el.popover.list">
                      <div
                        v-for="popoverEl in el.popover.list"
                        :key="popoverEl.id"
                      >
                        <template v-if="popoverEl.type === 'gearText'">
                          <GearText :level="popoverEl.level" />:
                          <span class="ml-1">{{ popoverEl.amount }}</span>
                        </template>
                        <template v-else>{{ popoverEl.message }}</template>
                      </div>
                    </template>
                    <template v-else-if="el.popover.body">
                      <div :class="el.popover.body.classes">
                        {{ el.popover.body.message }}
                      </div>
                    </template>
                    <template v-else>Unknown popover type</template>
                    <div
                      v-if="el.popover.footer?.show"
                      :class="el.popover.footer.classes"
                    >
                      {{ el.popover.footer.message }}
                    </div>
                  </template>
                </Popper>
                <template v-else>{{ el.message }}</template>
              </li>
            </template>
          </ul>
        </div>
      </template>
      <template v-else-if="cell.type === 'time'">
        <Timestamp
          :timeLength="cell.data.timestamp"
          :displayText="cell.data.display"
          :title="cell.data.title"
          :displayClasses="cell.data.classes"
        />
      </template>
      <template v-else-if="cell.type === 'checkmark'">
        <i
          class="fa fa-check"
          :class="cell.data.classes"
          v-if="cell.data.checked"
        ></i>
        <i class="fa fa-times" :class="cell.data.classes" v-else></i>
      </template>
      <template v-else-if="cell.type === 'checkbox'">
        <input
          type="checkbox"
          :checked="cell.data.checked"
          :value="cell.data.value"
          @change="handleChange($event)"
          :class="cell.data.classes"
          :disabled="cell.data.disabled"
        />
      </template>
      <template v-else-if="cell.type === 'number'">
        <input
          type="number"
          class="form-control form-control-sm"
          v-model.number="_value"
          :min="cell.data.min"
          :max="cell.data.max"
          @change="handleChange($event)"
          @keypress.enter="handleEnter(_value)"
        />
      </template>
      <template v-else-if="cell.type === 'shardsOwned'">
        <div class="input-group input-group-sm">
          <span class="input-group-text row-label">Shards Owned:</span>
          <ShardsOwned :unit="cell.data.unit" class="shards-owned" />
        </div>
      </template>
      <template v-else-if="cell.type === 'priority'">
        <div class="input-group input-group-sm">
          <span class="input-group-text row-label">Priority:</span>
          <ShardPriority
            :unit="cell.data.unit"
            :nodeTableNames="cell.data.nodeTableNames"
            :class="cell.data.classes"
          />
        </div>
      </template>
      <template v-else-if="cell.type === 'nodes'">
        <NodesPerDay
          :unit="cell.data.unit"
          v-if="cell.data.unit.showNodesPerDay"
        />
      </template>
      <template v-else-if="cell.type === 'currencyList'">
        <template v-for="currency in cell.data.currencyTypes" :key="currency">
          <div
            class="input-group input-group-sm"
            v-if="cell.data.unit.currencyTypes.includes(currency)"
          >
            <span class="input-group-text row-label flex">
              Wallet
              <img
                class="currency-img"
                :src="`./images/${currency}.png`"
                v-if="['get1', 'get2', 'get3'].includes(currency)"
              />
            </span>
            <Wallet :currencyType="currency" class="wallet-input" />
          </div>
        </template>
      </template>
      <template v-else-if="cell.type === 'dailyCurrency'">
        <template v-for="currency in cell.data.currencyTypes" :key="currency">
          <template v-if="cell.data.unit.currencyTypes.includes(currency)">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">
                Daily Currency:
                <img
                  class="currency-img"
                  :src="`./images/${currency}.png`"
                  v-if="['get1', 'get2', 'get3'].includes(currency)"
                />
              </span>
              <DailyCurrency
                :currencyType="currency"
                :allowEdit="!['get1', 'get2', 'get3'].includes(currency)"
              />
            </div>
          </template>
        </template>
      </template>
      <template v-else-if="cell.type === 'remainingCurrency'">
        <template v-for="currency in cell.data.currencyTypes" :key="currency">
          <template v-if="cell.data.unit.currencyTypes.includes(currency)">
            <span class="row-label me-1">Remaining Currency:</span>
            <img class="currency-img" :src="`./images/${currency}.png`" />
            {{ remainingCurrency(cell.data.unit, currency) }}
          </template>
        </template>
      </template>
      <template v-else-if="cell.type === 'unitRequirement'">
        <div class="requirement-container">
          <template
            v-if="
              cell.data.childUnit?.id &&
              cell.data.childUnit.id !== cell.data.parentUnit.id
            "
          >
            <UnitIcon
              :unit="getUnit(cell.data.childUnit.id)"
              :isLink="cell.data.isLink"
              :hideImage="cell.data.hideImage"
              :level="cell.data.level"
              :type="cell.data.type"
            />
            <i class="fa fa-arrow-right"></i>
          </template>
          <UnitIcon
            :unit="getUnit(cell.data.childUnit.requirementId)"
            :isLink="cell.data.isLink"
            :hideImage="cell.data.hideImage"
            :level="cell.data.level"
            :type="cell.data.type"
          />
        </div>
      </template>
      <template v-else-if="cell.type === 'html'">
        <div v-html="cell.data"></div>
      </template>
      <template v-else-if="cell.type === 'mod'">
        <ModIcon :unitId="cell.data.id" :shape="cell.data.shape" />
      </template>
      <template v-else-if="cell.type === 'unitSearch'">
        <div class="input-group input-group-sm add-unit-container">
          <UnitSearch
            :list="cell.data.list"
            @select="_value = $event"
            @enterPress="handleClick($event)"
          />
          <button
            class="btn btn-sm btn-primary"
            :disabled="!_value"
            @click="handleClick(_value)"
          >
            Add Unit
          </button>
        </div>
      </template>
      <template v-else-if="cell.type === 'date'">
        <input
          class="form-control form-control-sm"
          type="date"
          v-model="_value"
          :min="cell.data.min"
          :max="cell.data.max"
          @keypress.enter="handleEnter(_value)"
          @change="handleChange($event)"
        />
      </template>
      <template v-else-if="cell.type === 'select'">
        <select
          class="form-control form-control-sm"
          v-model="_value"
          @keypress.enter="handleEnter(_value)"
          @change="handleChange($event)"
        >
          <option
            v-for="(option, index) in cell.data.options"
            :value="option.value"
            :key="index"
          >
            {{ option.label }}
          </option>
        </select>
      </template>
      <template v-else-if="cell.type === 'relicFarm'">
        <div class="container gear-container">
          <div
            class="row py-1"
            v-for="gear in cell.data.location.gear"
            :key="gear.id"
          >
            <div class="col-lg-2 col-md-5 align-self-center">
              <GearIcon :gear="gearData(gear.id)" showName />
            </div>
            <div class="col-lg-1 col-md-3 align-self-center">
              <div
                class="d-flex justify-content-center align-items-center"
                v-if="gear.cost"
              >
                <img
                  class="currency-img"
                  :src="`./images/${cell.data.location.currency}.png`"
                />
                <div class="text-small">{{ gear.cost }}</div>
              </div>
            </div>
            <div
              class="col-lg-2 col-md-4 d-flex justify-content-center align-items-center"
            >
              <div v-if="gear.scavenger">
                <div v-for="scavenger in gear.scavenger" :key="scavenger.id">
                  <RelicIcon :item="relicConfig[scavenger.id]" />
                  <div v-if="gear.cost && gear.amount">
                    <div class="text-small">
                      Amount Per Purchase:
                      {{ cell.data.getAmount(scavenger, gear) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-7 col-md-12 text-center-md text-center-sm text-left align-self-center"
            >
              {{ gear.notes }}
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="cell.type === 'loading'">
        <Loading
          state="LOADING"
          :message="cell.data?.message"
          :size="cell.data?.size ?? 'sm'"
          :displayText="cell.data?.label"
        />
      </template>
      <template v-else>
        <span v-if="cell.data.message" :class="cell.data.classes">{{
          cell.data.message
        }}</span>
        <Popper
          v-else-if="cell.data.popover"
          :hover="cell.data.popover.hover"
          :arrow="cell.data.popover.arrow"
          :placement="cell.data.popover.placement"
        >
          <span :class="cell.data.classes">{{ cell.data.label }}</span>
          <template #content>
            <div
              :class="cell.data.popover.header.classes"
              v-if="cell.data.popover.header"
            >
              {{ cell.data.popover.header.message }}
            </div>
            <template v-if="cell.data.popover.list">
              <div
                v-for="popoverEl in cell.data.popover.list"
                :key="popoverEl.id"
              >
                <template v-if="popoverEl.type === 'gearText'">
                  <GearText :level="popoverEl.level" />:
                  <span class="ml-1">{{ popoverEl.amount }}</span>
                </template>
                <template v-else-if="popoverEl.type === 'text'">
                  {{ popoverEl.label }}</template
                >
                <template v-else>Unknown popoverEl type</template>
              </div>
            </template>
            <template v-else-if="cell.data.popover.body">
              <div :class="cell.data.popover.body.classes">
                {{ cell.data.popover.body.message }}
              </div>
            </template>
            <template v-else>Unknown popover type</template>
            <div
              v-if="cell.data.popover.footer?.show"
              :class="cell.data.popover.footer.classes"
            >
              {{ cell.data.popover.footer.message }}
            </div>
          </template>
        </Popper>
        <template v-else>
          {{ cell.data }}
        </template>
      </template>
    </template>
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import _ from "lodash";

import { iTableCell } from "types/general";
import { getUnit, Unit } from "types/unit";
import { CurrencyTypeConfig } from "types/currency";
import UnitIcon from "components/units/unitIcon.vue";
import RequirementIcon from "components/shards/tables/legendary/requirementIcon.vue";
import GearIcon from "components/gear/gearIcon.vue";
import GearOwned from "components/gear/gearOwned.vue";
import RelicOwned from "components/relic/relicOwned.vue";
import RelicIcon from "components/relic/relicIcon.vue";
import Timestamp from "components/general/timestamp.vue";
import GearText from "components/gear/gearText.vue";
import ShardsOwned from "components/shards/shardsOwned.vue";
import NodesPerDay from "components/shards/nodesPerDay.vue";
import ShardPriority from "components/shards/shardPriority.vue";
import DailyCurrency from "components/shards/dailyCurrency.vue";
import Wallet from "components/shards/wallet.vue";
import ModIcon from "components/units/modIcon.vue";
import UnitSearch from "components/units/unitSearch.vue";
import TargetLevel from "components/units/targetLevel.vue";
import { Gear } from "types/gear";

export default defineComponent({
  name: "TableCell",
  components: {
    UnitIcon,
    RequirementIcon,
    GearIcon,
    GearOwned,
    RelicOwned,
    RelicIcon,
    Timestamp,
    GearText,
    ShardsOwned,
    NodesPerDay,
    ShardPriority,
    DailyCurrency,
    Wallet,
    ModIcon,
    UnitSearch,
    TargetLevel,
  },
  props: {
    cell: {
      type: Object as () => iTableCell,
      required: true,
    },
  },
  data() {
    return {
      _value: this.cell?.data?.value ?? null,
    };
  },
  computed: {
    ...mapState("currency", ["wallet"]),
    ...mapState("gear", ["gearList"]),
    ...mapState("relic", ["relicConfig"]),
  },
  watch: {
    _value(newVal) {
      this.handleChange(newVal);
    },
  },
  methods: {
    getUnit,
    handleChange(newVal: any) {
      const { change } = this.cell;
      if (change) {
        if (newVal instanceof Event) {
          newVal = (newVal.target as any).value;
        }

        let value = newVal;
        if (this.cell.type === "number") {
          value = Number(newVal);
        } else if (newVal === "true" || newVal === "false") {
          value = newVal === "true";
        }

        _.debounce(function () {
          change(value);
        }, 500)();
      }
    },
    handleClick: _.debounce(function (this: any, data: any) {
      if (this.cell.click) {
        this.cell.click(data);
      }
    }, 500),
    handleEnter: _.debounce(function (this: any, data: any) {
      if (this.cell.enter) {
        this.cell.enter(data);
      }
    }, 500),
    remainingCurrency(unit: Unit, currencyType: CurrencyTypeConfig) {
      const location = unit.whereToFarm.find(
        (l) => l.currencyType === currencyType
      );
      if (location) {
        const currentWallet = this.wallet[currencyType] ?? 0;
        const character = location.characters.find((c) => c.id === unit.id);
        let costPerShard = 0;
        if (character && character.shardCount && character.cost) {
          costPerShard = character.cost / character.shardCount;
        }
        const totalCost = unit.remainingShards * costPerShard;
        return Math.max(currentWallet - totalCost, 0);
      } else {
        return 0;
      }
    },
    gearData(id: string): Gear | undefined {
      return this.gearList.find((gear: Gear) => gear.id === id);
    },
  },
});
</script>

<style lang="scss" scoped>
.currency-img {
  max-width: 30px;
}
</style>
