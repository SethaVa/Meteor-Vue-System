<template>
  <div>
    <!--Table List-->
    <el-form :model="form"
             ref="form"
             v-loading.body="loading">
      <el-table :data="form.items"
                style="width: 100%">
        <el-table-column prop="details"
                         label="Details">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.details'"
                          :prop="'items.' + scope.$index +'.details'"
                          :rules="rules.details"
                          class="form-item">
              <el-input v-model="scope.row.details"
                        placeholder="Items Details"
                        size="small"
                        style="width:100%"></el-input>
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
                        @change.native="changeTotalUSD(scope.row)"
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
                        @change.native="changeTotalKHR(scope.row)"
                        type="number">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="itemId"
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
        </el-table-column>
      </el-table>
    </el-form>

  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import _ from 'lodash'
const numeral = require('numeral')
export default {
  name: 'SubForm',
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
  },
  data() {
    return {
      loading: false,
      deleteAction: false,
      items: [],
      form: {
        items: this.itemsProp,
      },
      rules: {
        details: [{ required: true }],
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
    addItem() {
      this.form.items.push({
        details: '',
        usd: 0,
        khr: 0,
      })
    },
    deleteItem(item) {
      const index = this.form.items.indexOf(item)

      if (index !== -1) {
        this.deleteAction = index < this.form.items.length - 1 ? true : false

        this.$nextTick(() => {
          this.form.items.splice(index, 1)
          this.emitToParent()
        })
      }
    },
    changeTotalKHR(row) {
      if (row.khr < 0) {
        Notify.warning({ message: "KHR can't negative number!" })
        row.khr = 0
      }
      row.khr
      this.emitToParent()
    },
    changeTotalUSD(row) {
      if (row.usd < 0) {
        Notify.warning({ message: "USD can't negative number!" })
        row.usd = 0
      }
      row.usd
      this.emitToParent()
    },
    emitToParent() {
      this.$emit('sub-form-change', this.form.items)
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

<style scoped>
.form-item {
  margin-bottom: 0px;
}
</style>
