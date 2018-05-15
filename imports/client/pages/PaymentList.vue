<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-doc="updateDoc"
               @modal-close="handleClose"></component>

    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables v-loading="loading"
                 :data="tableData"
                 :actions-def="actionsDef"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort">
        <template slot-scope="scope">
          <span v-if="title.prop === 'payDate'">
            {{ formatDate(scope.row.payDate) }}
          </span>
          <span v-else-if="title.prop === 'endPayDate'">
            {{ formatDate(scope.row.endPayDate) }}
          </span>
          <span v-else-if="title.prop === 'usd'">
            {{ formatNumber(scope.row.usd) + ' $' }}
          </span>
          <span v-else-if="title.prop === 'khr'">
            {{ formatNumber(scope.row.khr) +' ៛' }}
          </span>
          <span v-else-if="title.prop === 'remaining'">
            {{ formatNumber(scope.row.remaining) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>

        </template>
      </el-table-column>
      <el-table-column width="60px"
                       label="Action">
        <template slot-scope="scope">
          <el-dropdown trigger="click"
                       @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="fa fa-align-justify"></i>
            </span>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item :command="{action: 'edit', row: scope.row}">
                Edit
              </el-dropdown-item>

              <el-dropdown-item :command="{action: 'remove', row: scope.row}">
                Remove
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </data-tables>
  </div>
</template>

<script>
import moment from 'moment'

import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import PaymentInsert from './PaymentInsert.vue'
import PaymentUpdate from './PaymentUpdate.vue'
import Refund from './RefundInsert.vue'
import StudentPayUpdate from './StudentPayUpdate.vue'
import compareDate from '/imports/libs/compare-date'

import { findPayment, removePayment } from '../../api/payment/methods'

var numeral = require('numeral')

export default {
  name: 'PaymentList',
  components: { PaymentInsert, PaymentUpdate, Refund },
  data() {
    return {
      loading: false,
      currentDialog: null,
      visibleDialog: false,
      updateDoc: null,
      tableData: [],
      titles: [
        { label: 'Class', prop: 'classId', sort: 'custom' },
        { label: 'Student', prop: 'studentId' },
        { label: 'Pay Date', prop: 'payDate', sort: 'custom' },
        { label: 'End Date', prop: 'endPayDate', sort: 'custom' },
        { label: 'USD', prop: 'usd' },
        { label: 'KHR', prop: 'khr' },
        { label: 'Remaining', prop: 'remaining' },
      ],
      tableProps: {
        size: 'mini',
        // border: false,
      },
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'New',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.visibleDialog = true
              this.currentDialog = PaymentInsert
              compareDate()
              // this.$router.push({ name: 'NewPayment' })
            },
          },
          // {
          //   name: 'Refund',
          //   // icon: 'el-icon-plus',
          //   buttonProps: {
          //     size: 'mini',
          //   },
          //   handler: () => {
          //     this.visibleDialog = true
          //     this.currentDialog = Refund
          //     compareDate()
          //     // this.$router.push({ name: 'NewPayment' })
          //   },
          // },
        ],
      },
      actionColDef: {
        label: 'Action',
        width: '100',
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      findPayment
        .callPromise({
          selector: { refType: 'Payment' },
          option: { sort: { _id: -1 } },
        })
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(err => {
          this.$message(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        if (command.row.status !== 'Paid' && command.row.status !== 'Debt') {
          Notify.warning({
            message: 'This recorde is ' + command.row.status + " can't edit!",
          })
        } else {
          this.updateDoc = command.row
          this.visibleDialog = true
          this.currentDialog = PaymentUpdate
        }
      } else if (command.action === 'remove') {
        if (command.row.status !== 'Paid' && command.row.status !== 'Debt') {
          Notify.warning({
            message: 'This recorde is ' + command.row.status + " can't remove!",
          })
        } else {
          this.$confirm('Do you want delete this record?', 'Warning', {
            type: 'warning',
          })
            .then(result => {
              if (result) {
                let id = command.row._id
                let lastId = command.row.lastId
                removePayment
                  .callPromise({
                    selector: {
                      _id: id,
                      referenceType: 'Payment',
                      lastId: lastId,
                    },
                  })
                  .then(result => {
                    if (result) {
                      Msg.success()
                      this.getData()
                    }
                  })
                  .catch(err => {
                    Notify.error({ message: err.reason + 'Error' })
                  })
                this.getData()
              }
            })
            .catch(err => {
              Notify.error({ message: err })
            })
        }
      }
    },
    handleClose() {
      this.getData()
      this.visibleDialog = false
      this.$nextTick(() => {
        this.currentDialog = null
      })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    formatNumber(val) {
      return numeral(val).format('0,0.00')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 10px;
}
</style>

