<template>
  <!-- <el-form ref="form"
           :model="form"
           rules="rules">
    <el-form-item label="Total Pay"
                  prop="totalPay">
      <el-input type="totalPay"
                v-model.number="form.totalPay"
                auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="Dis Val"
                  prop="discountVal">
      <el-input type="discountVal"
                v-model.number="form.discountVal"
                auto-complete="off">

      </el-input>
    </el-form-item>
    <el-form-item label="USD"
                  prop="usd">
      <el-input type="number"
                v-model.number="form.usd"
                auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="KHR"
                  prop="khr">
      <el-input type="number"
                v-model.number="form.khr"
                auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="Remaining"
                  prop="remaining">
      <label>{{ formatNumer(remaining) }}</label>
    </el-form-item>
  </el-form> -->
  <el-form :model="form"
           ref="form"
           v-loading.body="loading">
    <el-table :data="form.items"
              size="mini"
              style="width: 100%">
      <slot v-if="amountProp">
        <el-table-column prop="amount"
                         label="Amount">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.amount'"
                          :prop="'items.' + scope.$index +'.amount'"
                          :rules="rules.amount"
                          class="form-item">
              <el-input disabled
                        v-model="scope.row.amount"
                        type="number"
                        size="small"
                        style="width:100%"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </slot>
      <slot v-if="totalPayProp">
        <el-table-column prop="totalPay"
                         label="Total Pay">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.totalPay'"
                          :prop="'items.' + scope.$index +'.totalPay'"
                          :rules="rules.totalPay"
                          class="form-item">
              <el-input v-model="scope.row.totalPay"
                        type="number"
                        size="small"
                        style="width:100%"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </slot>
      <el-table-column prop="discountVal"
                       label="Dis Val">
        <template slot-scope="scope">
          <el-form-item :key="scope.$index + '.discountVal'"
                        :prop="'items.' + scope.$index + '.discountVal'"
                        :rules="rules.discountVal"
                        class="form-item">
            <el-input v-model.number="scope.row.discountVal"
                      size="small"
                      type="number">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="usd"
                       label="USD">
        <template slot-scope="scope">
          <el-form-item :key="scope.$index + '.usd'"
                        :prop="'items.' + scope.$index + '.usd'"
                        :rules="rules.usd"
                        class="form-item">
            <el-input v-model.number="scope.row.usd"
                      size="small"
                      type="number">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="khr"
                       label="KHR">
        <template slot-scope="scope">
          <el-form-item :key="scope.$index + '.khr'"
                        :prop="'items.' + scope.$index + '.khr'"
                        :rules="rules.khr"
                        class="form-item">
            <el-input v-model.number="scope.row.khr"
                      size="small"
                      type="number">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="remaining"
                       label="Remaining">
        <template slot-scope="scope">
          <el-form-item :key="scope.$index + '.remaining'"
                        :prop="'items.' + scope.$index + '.remaining'"
                        :rules="rules.remaining"
                        class="form-item">
            <el-input v-model.number="scope.row.remaining"
                      size="small"
                      type="number">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="itemId"
                       label="Action"
                       width="80px">
        <template slot-scope="scope">
          <el-button v-if="form.items.length > 1"
                     type="text"
                     icon="el-icon-delete"
                     @click="deleteItem(scope.row)">
          </el-button>
          <el-button v-if="(form.items.length - 1) === scope.$index"
                     type="text"
                     icon="el-icon-plus"
                     @click="addItem">
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </el-form>
</template>

<script>
const numeral = require('numeral')
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'SubPayment',
  props: {
    itemsProp: {
      type: Array,
      default: function() {
        return []
      },
    },
    saveEvent: {
      type: Number,
      default: 0,
    },
    amountProp: {
      type: Boolean,
      default: false,
    },
    totalPayProp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        items: this.itemsProp,
      },
      rules: {
        usd: [{ required: true }],
        khr: [{ required: true }],
        totalPay: [{ required: true }],
      },
    }
  },
  watch: {
    itemsProp(val) {
      this.form.items = val
      this.emitToParent()
    },
    saveEvent(val) {
      this.saveForm()
    },
  },
  methods: {
    emitToParent() {
      this.$emit('sub-payment', _.cloneDeep(this.form))
    },
    saveForm() {
      this.$refs['form'].validate(valid => {
        this.$emit('save-form', valid)
      })
    },
    formatNum(val) {
      return numeral(val).format('0,0.00')
    },
  },
}
</script>

<style>
.form-item {
  margin-bottom: 0px;
}
</style>
