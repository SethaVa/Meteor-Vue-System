<template>
  <div>
    <!-- Form -->
    <exchange-form :form-type="formType"
                   :update-doc="updateDoc"
                   @form-change="handleFormChange"></exchange-form>

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
          <span v-if="title.prop === 'exDate'">
            {{ scope.row.exDate | date }}
          </span>
          <span v-else>{{ scope.row[title.prop] | number }}</span>
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

import ExchangeForm from './ExchangeForm'
import {
  findExchanges,
  removeExchange,
} from '/imports/api/exchanges/methods.js'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

export default {
  // name: 'Exchange',
  components: { ExchangeForm, TableToolbar, TableAction },
  mixins: [removeMixin],
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
        { label: 'THB', prop: 'thb' },
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
        meteorMethod: removeExchange,
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
