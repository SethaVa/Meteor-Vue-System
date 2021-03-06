<template>
  <div>

    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables v-loading="loading"
                 :data="tableData"
                 :filters="tableFilters"
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

import Notify from '/imports/client/lib/notify'
import Msg from '/imports/client/lib/message'
import RegisterInsert from './RegisterInsert.vue'
import RegisterUpdate from './RegisterUpdate.vue'
import RegisterInsertOld from './RegisterInsertOld.vue'

import { findPayment, removePayment } from '/imports/modules/school/api/payment/methods'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import numeral from 'numeral'

export default {
  // name: 'RegisterList',
  components: {
    RegisterInsert,
    RegisterUpdate,
    RegisterInsertOld,
    TableToolbar,
    TableAction,
  },
  minxins: [removeMixin],
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
        border: false,
      },
      tableFilters: [
        {
          prop: ['classId', 'studentId'],
          value: '',
        },
      ],
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
      findPayment
        .callPromise({
          selector: { refType: 'New' },
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
    // Add new
    addNew() {
      // this.currentDialog = UserNew
      this.$router.push({ name: 'sch.registerNew'})
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
      this.$router.push({
            name: 'sch.registerEdit',
            params: { id: row._id },
          })
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removePayment,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
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

