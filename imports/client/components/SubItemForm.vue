<template>
  <div>
    <!--Table List-->
    <el-form :model="form"
             ref="form"
             v-loading.body="loading">
      <el-table :data="form.items"
                size="mini"
                style="width: 100%">
        <el-table-column prop="itemId"
                         label="Name">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.itemId'"
                          :prop="'items.' + scope.$index +'.itemId'"
                          :rules="rules.itemId"
                          class="form-item">
              <el-select v-model="scope.row.itemId"
                         size="small"
                         filterable
                         @change="changeItemRow(scope.row)">
                <el-option v-for="doc in items"
                           :key="doc._id"
                           :label="doc.name"
                           :value="doc._id">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="qty"
                         label="Qty">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.qty'"
                          :prop="'items.' + scope.$index + '.qty'"
                          :rules="rules.qty"
                          class="form-item">
              <el-input v-model.number="scope.row.qty"
                        size="small"
                        type="number"
                        @change="changeRowQty(scope.row)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="categoryId"
                         label="Category">
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + '.categoryId'"
                          :prop="'items.' + scope.$index + '.categoryId'"
                          :rules="rules.categoryId"
                          class="form-item">
              <label>{{ scope.row.categoryName }}</label>
            </el-form-item>
          </template>
        </el-table-column>
        <template v-if="false">
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
        </template>
        <el-table-column prop="itemId"
                         label="Action"
                         width="80px">
          <template slot-scope="scope">
            <el-button v-if="form.items.length > 1"
                       type="text"
                       icon="fas fa-trash"
                       @click="deleteItem(scope.row)">
            </el-button>
            <el-button v-if="(form.items.length - 1) === scope.$index"
                       type="text"
                       icon="fas fa-plus-circle"
                       @click="addItem">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

  </div>
</template>

<script>
import Notify from '/imports/client/lib/notify'
import _ from 'lodash'
const numeral = require('numeral')
import { findItems } from '/imports/api/items/methods'
export default {
  // name: 'SubItemForm',
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
        name: [{ required: true }],
        qty: [{ required: true }],
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
  mounted() {
    this.getItemData()
  },
  methods: {
    addItem() {
      this.form.items.push({
        itemId: '',
        qty: 1,
        categoryId: '',
        categoryName: '',
        usd: 0,
        khr: 0,
      })
    },
    getItemData() {
      findItems
        .callPromise({})
        .then(result => {
          this.items = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    changeItemRow(row) {
      let Category = _.find(this.items, { _id: row.itemId })
      row.categoryName = Category.categoryDoc.name
      row.categoryId = Category.categoryId

      this.emitToParent()
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
    changeRowQty(row) {
      if (row.qty < 0) {
        Notify.warning({ message: "KHR can't negative number!" })
        row.qty = 0
      }

      this.emitToParent()
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
