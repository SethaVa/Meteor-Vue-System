<template>
  <div>
    <!-- Form -->
    <exchange-form :form-type="formType"
                   :update-doc="updateDoc"
                   @form-change="handleFormChange"></exchange-form>

    <!-- Data Table -->
    <data-tables v-loading="loading"
                 :data="tableData"
                 :table-props="tableProps"
                 :action-col-def="actionColDef">
      <el-table-column v-for="title in tableTitles"
                       :prop="title.prop"
                       :label="title.label"
                       :key="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'exDate'">
            {{ dateFormatter(scope.row.exDate) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
    </data-tables>

  </div>
</template>

<script>
import moment from 'moment'

import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'

import ExchangeForm from '/imports/client/pages/ExchangeForm'
import { findExchanges, removeExchange } from '../../api/exchanges/methods'

export default {
  name: 'Exchange',
  components: { ExchangeForm },
  data() {
    return {
      loading: false,
      formType: 'New',
      updateDoc: null,
      tableData: [],
      tableTitles: [
        { label: 'Date', prop: 'exDate' },
        { label: 'USD', prop: 'usd' },
        { label: 'KHR', prop: 'khr' },
      ],
      tableProps: {
        border: false,
        size: 'small',
      },
      actionColDef: {
        label: 'Action',
        def: [
          {
            icon: 'el-icon-edit',
            buttonProps: {
              size: 'mini',
            },
            handler: row => {
              this.formType = 'Update'
              this.updateDoc = row
            },
          },
          {
            icon: 'el-icon-delete',
            buttonProps: {
              size: 'mini',
            },
            handler: row => {
              this.$confirm('Are you sur to detlete this record?', {
                type: 'warning',
              })
                .then(result => {
                  if (result) {
                    removeExchange
                      .callPromise({ _id: row._id })
                      .then(result => {
                        Msg.success()
                        this.getData()
                      })
                      .catch(error => {
                        Notify.error({ message: error })
                      })
                  }
                })
                .catch(error => {
                  Notify.error({ message: error })
                })
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
      findExchanges
        .callPromise()
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Format
    dateFormatter(row, column, cellValue) {
      return moment(cellValue).format('DD/MM/YYYY')
    },
    handleFormChange() {
      this.formType = 'New'
      this.updateDoc = null
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '../styles/main.less';
</style>
