<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-doc="updateDoc"
               @modal-close="handleClose"></component>

    <!-- Table Data -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort">
      </el-table-column>
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
import SubjectInsert from './SubjectInsert.vue'
import SubjectUpdate from './SubjectUpdate.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'
// import TableToolbar from '../components/TableToolbar'
// import TableAction from '../components/TableAction'

import { findSubject, removeSubject } from '/imports/modules/school/api/subject/methods.js'
export default {
  // name: 'Subject',
  components: { SubjectInsert, TableAction, TableToolbar },
  mixins: [removeMixin],
  data() {
    return {
      currentDialog: null,
      visibleDialog: false,
      updateDoc: null,
      tableData: [],
      titles: [
        { label: 'Title', prop: 'title', sort: 'custom' },
        { label: 'Level', prop: 'level' },
        { label: 'Type', prop: 'type' },
      ],
      tableProps: {
        size: 'mini',
      },
      tableFilters: [
        {
          prop: ['title'],
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
      findSubject
        .callPromise({ selector: {}, options: { sort: { _id: -1 } } })
        .then(result => {
          this.tableData = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Add new
    addNew() {
      this.visibleDialog = true
      this.currentDialog = SubjectInsert
    },
    // Table Action
    actionsList(row) {
      return ['edit', 'remove']
    },
    tableActionClick(command) {
      this[command.action](command.row)
    },
    // Edit Data
    edit(row) {
      this.updateDoc = row
      this.visibleDialog = true
      this.currentDialog = SubjectUpdate
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeSubject,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    handleClose() {
      this.getData()
      ;(this.visibleDialog = false),
        this.$nextTick(() => {
          this.currentDialog = null
        })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>

