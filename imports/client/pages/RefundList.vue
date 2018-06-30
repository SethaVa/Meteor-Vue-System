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

              <!-- <el-dropdown-item :command="{action: 'edit', row: scope.row}">
                Edit
              </el-dropdown-item> -->

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
import _ from 'lodash'
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import RefundInsert from './RefundInsert.vue'
import RefundUpdate from './RefundUpdate.vue'
import compareDate from '/imports/libs/compare-date'

import { findRefund, removeRefund } from '../../api/Refund/methods'
import { findExchanges } from '../../api/exchanges/methods'

var numeral = require('numeral')

export default {
  name: 'PaymentList',
  components: { RefundInsert, RefundUpdate },
  data() {
    return {
      loading: false,
      currentDialog: null,
      visibleDialog: false,
      updateDoc: null,
      tableData: [],
      exchangeRate: 0,

      titles: [
        { label: 'Class', prop: 'classId', sort: 'custom' },
        { label: 'Student', prop: 'studentId' },
        { label: 'USD', prop: 'usd' },
        { label: 'KHR', prop: 'khr' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
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
              this.currentDialog = RefundInsert
              compareDate()
              // this.$router.push({ name: 'NewPayment' })
            },
          },
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
    // this.getExchangeRate()
  },
  methods: {
    getData() {
      this.loading = true
      // this.exchangeRate = 0
      // findExchanges
      //   .callPromise({})
      //   .then(result => {
      //     console.log(result)
      //     if (result) {
      //       this.exchangeRate = result[0].khr
      //     }
      //   })
      //   .catch(error => {
      //     Notify.error({ message: error })
      //   })

      findRefund
        .callPromise({
          option: { sort: { _id: -1 } },
        })
        .then(result => {
          if (result) {
            // _.forEach(result, o => {
            //   o.totalRecieve = o.usd + o.khr / this.exchangeRate
            // })
            this.loading = false
            this.tableData = result
          }
        })
        .catch(err => {
          this.$message(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // if (command.row.status !== 'Paid' && command.row.status !== 'Debt') {
        //   Notify.warning({
        //     message: 'This recorde is ' + command.row.status + " can't edit!",
        //   })
        // } else {
        this.updateDoc = command.row
        this.visibleDialog = true
        this.currentDialog = RefundUpdate
        // }
      } else if (command.action === 'remove') {
        // if (command.row.status !== 'Paid' && command.row.status !== 'Debt') {
        //   Notify.warning({
        //     message: 'This recorde is ' + command.row.status + " can't remove!",
        //   })
        // } else {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            if (result) {
              // let id = command.row._id
              // let lastId = command.row.lastId
              removeRefund
                .callPromise({
                  doc: command.row,
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
        // }
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

