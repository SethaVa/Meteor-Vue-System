<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
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
                       sortable="custom">
        <template slot-scope="scope">
          <!-- <label v-if="scope.props='classDate'">{{ formatDate(scope.props.classDate) }}</label>
          <label v-else></label> -->
          <span v-if="title.prop === 'classDate'">
            {{ formatDate(scope.row.classDate) }}
          </span>
          <span v-else-if="title.prop === 'timeStudy'">
            {{ formatTime(scope.row.timeStudy) }}
          </span>
          <!-- <span v-else-if="title.prop[title.prop] === 'Closed'">
            {{ 1+1 }}
          </span> -->
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
import MsgBox from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import ClassInsert from './ClassInsert'
import ClassUpdate from './ClassUpdate'
import {
  findClassStudy,
  removeClassStudy,
  finishClassStudy,
  updateClassStudyStatus,
} from '../../api/classStudy/methods'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'ClassList',
  components: {
    ClassInsert,
    ClassUpdate,
    TableAction,
    TableToolbar,
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
        // { label: 'ID', prop: '_id' },
        { label: 'Date', prop: 'classDate' },
        { label: 'Room', prop: 'roomName' },
        { label: 'Teacher', prop: 'teacher' },
        { label: 'Subject', prop: 'subject' },
        { label: 'Time', prop: 'timeStudy' },
        { label: 'Type', prop: 'type' },
        { label: 'Status', prop: 'status' },
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
          prop: ['roomName', 'teacher','timeStudy','type'],
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
      findClassStudy
        .callPromise({})
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
      this.currentModal = ClassInsert
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
      this.currentModal = ClassUpdate
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeClassStudy,
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
    formatTime(val) {
      let data = _.map(val)
        .map(o => {
          return moment(o).format('LT')
        })
        .join('-')
      return data
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
