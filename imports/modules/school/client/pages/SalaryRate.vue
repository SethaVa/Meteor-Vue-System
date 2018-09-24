<template>
  <div>
    <!-- Form -->

    <salary-rate-form :form-type="formType"
                      :update-doc="updateDoc"
                      @form-change="handleFormChange"></salary-rate-form>

    <!-- Data Table -->
    <data-tables v-loading="loading"
                 :data="tableData"
                 :table-props="tableProps">
      <el-table-column v-for="title in tableTitles"
                       :prop="title.prop"
                       :label="title.label"
                       :key="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'rate' ||title.prop === 'amount' ">
            {{ scope.row[title.prop] | number }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
      <!-- Action -->
      <el-table-column :render-header="renderTableMoreHeader"
                       align="center"
                       fixed="right"
                       width="70">
        <template slot-scope="scope">
          <table-action :actions="actionsList(scope.row)"
                        :row="scope.row"
                        @action-click="tableActionClick"></table-action>
        </template>
      </el-table-column>
    </data-tables>

  </div>
</template>

<script>
import moment from 'moment'

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import SalaryRateForm from './SalaryRateForm.vue'
import {
  findRateSalary,
  removeRateSalary,
} from '/imports/modules/school/api/rate-salary/methods'

export default {
  // name: 'SalaryRate',
  components: { SalaryRateForm, TableAction },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      formType: 'New',
      updateDoc: null,
      tableData: [],
      tableTitles: [
        { label: 'Name', prop: 'name' },
        { label: 'Rate', prop: 'rate' },
        { label: 'Amount', prop: 'amount' },
      ],
      tableProps: {
        border: false,
        size: 'small',
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    renderTableMoreHeader(h, { column, $index }) {
      return h('h2', { class: 'el-icon-menu popover-icon' })
    },
    getData() {
      this.loading = true
      findRateSalary
        .callPromise({})
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    // Table Action
    actionsList() {
      return ['edit', 'remove']
    },
    tableActionClick(command) {
      this[command.action](command.row)
    },
    // Edit Data
    edit(row) {
      this.formType = 'Update'
      this.updateDoc = row
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeRateSalary,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
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
