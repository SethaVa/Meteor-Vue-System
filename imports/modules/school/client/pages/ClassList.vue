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
            {{ scope.row.classDate | date }}
          </span>
          <span v-else-if="title.prop === 'time'">
            {{ formatTime(scope.row.time) }}
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

import { mapState } from 'vuex'

import {
  findClassStudy,
  removeClassStudy,
} from '/imports/modules/school/api/class-study/methods'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import _ from 'lodash'
export default {
  // name: 'ClassList',
  components: {
    TableAction,
    TableToolbar,
  },
  mixins: [removeMixin],
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'Code', prop: 'code' },
        { label: 'Date', prop: 'classDate' },
        { label: 'Room', prop: 'room' },
        { label: 'Teacher', prop: 'staffName' },
        { label: 'Subject', prop: 'subjectName' },
        { label: 'Time', prop: 'time' },
        { label: 'Type', prop: 'type' },
        { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
        stripe: false,
        defaultSort: {
          prop: 'code',
          order: 'descending',
        },
      },
      tableFilters: [
        {
          prop: ['room', 'staffName', 'time', 'type', 'code'],
          value: '',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      currentBranchId(state) {
        return state.app && state.app.currentBranch._id
      },
    }),
  },
  mounted() {
    this._getData()
  },
  methods: {
    renderTableMoreHeader(h, { column, $index }) {
      return h('h2', { class: 'el-icon-menu popover-icon' })
    },
    _getData() {
      findClassStudy
        .callPromise({ selector: { branchId: this.currentBranchId } })
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    // Add new
    addNew() {
      this.$router.push({ name: 'sch.classForm', params: { type: 'new' } })
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
        name: 'sch.classForm',
        params: { type: 'new', id: row._id },
      })
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeClassStudy,
        selector: { _id: row._id },
        successMethod: '_getData',
        loading: 'loading',
        title: row.title,
      })
    },
    dialog() {
      this.$message.error(this.currentModal)
    },
    handleModalClose() {
      this._getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.updateId = null
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
