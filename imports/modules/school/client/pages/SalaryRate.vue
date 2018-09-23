<template>
  <div>
    <!-- Form -->

    <salary-rate-form :form-type="formType"
                      :update-doc="updateDoc"
                      @form-change="handleFormChange"></salary-rate-form>

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

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import SalaryRateForm from './SalaryRateForm.vue'
import { findSalaryRate, removeSalaryRate } from '/imports/modules/school/api/salary-rate/methods'

export default {
  // name: 'SalaryRate',
  components: { SalaryRateForm },
  data() {
    return {
      loading: false,
      formType: 'New',
      updateDoc: null,
      tableData: [],
      tableTitles: [
        { label: 'Date', prop: 'exDate' },
        { label: 'Student', prop: 'base' },
        { label: 'Part Time (%)', prop: 'partTime' },
        { label: 'Full Time ($)', prop: 'fullTime' },
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
                    removeSalaryRate
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
      findSalaryRate
        .callPromise({})
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    // Format
    dateFormatter(val) {
      return moment(val).format('DD/MM/YYYY')
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
