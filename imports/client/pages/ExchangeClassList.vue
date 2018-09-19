<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables :data="tableData"
                 v-loading="loading"
                 :filters="tableFilters"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <!-- <label v-if="scope.props='tranDate'">{{ formatDate(scope.props.tranDate) }}</label>
          <label v-else></label> -->
          <span v-if="title.prop === 'tranDate'">
            {{ formatDate(scope.row.tranDate) }}
          </span>
          <span v-else-if="title.prop === 'timeStudy'">
            {{ formatTime(scope.row.timeStudy) }}
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
import Notify from '/imports/client/lib/notify'
import MsgBox from '/imports/client/lib/message'
import moment from 'moment'
//
import ExchangeClassInsert from '../pages/ExchangeClassInsert.vue'
import ExchangeClassUpdate from '../pages/ExchangeClassUpdate.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import {
  findExchangeClass,
  removeExchangeClass,
} from '../../api/exchange-class/methods'
export default {
  components: {
    ExchangeClassInsert,
    ExchangeClassUpdate,
    TableToolbar,
    TableAction,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        // { label: 'ID', prop: '_id' },
        { label: 'Date', prop: 'tranDate' },
        { label: 'From', prop: 'fromRoom' },
        { label: 'To', prop: 'toRoom' },
        { label: 'Student', prop: 'name' },
        // { label: 'Type', prop: 'type' },
        // { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
        stripe: false,
        defaultSort: {
          prop: '_id',
          order: 'ascending',
        },
      },
      tableFilters: [
        {
          prop: ['name', 'tranDate'],
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
      findExchangeClass
        .callPromise({})
        .then(result => {
          this.tableData = result
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Add new
    addNew() {
      this.modalVisible = true
      this.currentModal = ExchangeClassInsert
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
      this.updateId = row._id
      this.modalVisible = true
      this.currentModal = ExchangeClassUpdate
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeExchangeClass,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },

    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
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
