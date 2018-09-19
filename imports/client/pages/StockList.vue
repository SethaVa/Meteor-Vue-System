<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- table Data -->
    <data-tables :data="tableData"
                 :action-col-def="actionColDef"
                 :actions-def="actionsDef"
                 :table-props="tableProps"
                 v-loading="loading">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'tranDate'">
            {{ formatDate(scope.row.tranDate) }}
          </span>
          <span v-else-if="title.prop === 'totalUsd'">
            {{ formatNum(scope.row.totalUsd)+' $' }}
          </span>
          <span v-else-if="title.prop === 'totalKhr'">
            {{ formatNum(scope.row.totalKhr) + ' ៛' }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import { findIncome, removeIncome } from '../../api/Income/methods'
import StockInsert from './StockInsert.vue'
import StockUpdate from './StockUpdate.vue'
import _ from 'lodash'
import moment from 'moment'
const numeral = require('numeral')
export default {
  name: 'IncomeList',
  meta: {
    headerTitle: 'Student',
  },
  component: {
    StockInsert,
    StockUpdate,
  },
  data() {
    return {
      loading: false,
      currentModal: null,
      updateId: null,
      modalVisible: false,
      titles: [
        { label: 'Date', prop: 'tranDate' },
        { label: 'Type', prop: 'referenceType' },
        { label: 'Total USD', prop: 'totalUsd' },
        { label: 'Total KHR', prop: 'totalKhr' },
      ],
      tableData: [],
      tableProps: {
        border: false,
        size: 'mini',
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
              this.modalVisible = true
              this.currentModal = StockInsert
            },
          },
        ],
      },
      actionColDef: {
        label: 'Action',
        width: '100px',
        tableColProps: {
          align: 'center',
        },
        def: [
          {
            icon: 'el-icon-edit',
            handler: row => {
              if (
                row.referenceType !== 'Income' &&
                row.referenceType !== 'Expend'
              ) {
                Notify.warning({
                  message: 'This recorde is not Income or Expend !',
                })
              } else {
                this.updateId = row._id
                this.modalVisible = true
                this.currentModal = StockUpdate
              }
            },
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              this.handleRemove(row)
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      this.loading = true
      let options = {
        sort: { _id: -1 },
      }
      findIncome
        .callPromise({ options: options })
        .then(result => {
          _.forEach(result, o => {
            if (o.referenceType === 'Expend') {
              o.totalUsd = -o.totalUsd
              o.totalKhr = -o.totalKhr
            }
          })

          this.tableData = result
          this.loading = false
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    handleRemove(row) {
      if (row.referenceType !== 'Income' && row.referenceType !== 'Expend') {
        Notify.warning({ message: 'This recorde is not Income or Expend !' })
      } else {
        let _id = row._id
        this.$confirm('Do you want to delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(() => {
            removeIncome
              .callPromise({ _id })
              .then(result => {
                Msg.success()
                this.getData()
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          })
          .catch(() => {
            this.$message({
              message: 'Delete is Cancel',
              type: 'error',
            })
          })
      }
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    formatNum(val) {
      return numeral(val).format('0,0.00')
    },
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
    },
  },
}
</script>

<style>
</style>
