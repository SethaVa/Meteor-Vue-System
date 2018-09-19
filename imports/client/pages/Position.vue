<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       :sortable="title.sort">
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
import PositionInsert from './PositionInsert.vue'
import PositionUpdate from './PositionUpdate.vue'
import { findPosition, removePosition } from '../../api/positions/methods'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Position',
  components: {
    PositionInsert,
    PositionUpdate,
    TableToolbar,
    TableAction,
  },
  mixins: [removeMixin],
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Position', prop: 'position', sort: 'custom' },
        { label: 'Description', prop: 'des' },
        { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'small',
      },
      tableFilters: [
        {
          prop: ['position'],
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
      findPosition
        .callPromise({ selector: {}, options: { sort: { _id: -1 } } })
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    // Add new
    addNew() {
      this.modalVisible = true
      this.currentModal = PositionInsert
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
      this.updateDoc = row
      this.modalVisible = true
      this.currentModal = PositionUpdate
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removePosition,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    dialog() {
      this.$message.error(this.currentModal)
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

<style>
</style>
