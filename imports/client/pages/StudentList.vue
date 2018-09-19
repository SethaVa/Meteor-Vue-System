<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>

    <!-- table Data -->
    <!-- :action-col-def="actionColDef" -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables v-loading="loading"
                 :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'dob'">
            {{ formatDate(scope.row.dob) }}
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
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import { findStudents, removeStudent } from '../../api/students/methods.js'
import StudentInsert from './StudentInsert.vue'
import StudentUpdate from './StudentUpdate.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'

export default {
  name: 'StudentList',
  meta: {
    headerTitle: 'Student',
  },
  components: {
    StudentInsert,
    StudentUpdate,
    TableAction,
    TableToolbar,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      currentModal: null,
      updateDoc: null,
      modalVisible: false,
      titles: [
        { label: 'Kh Name', prop: 'khName' },
        { label: 'En Name', prop: 'enName' },
        { label: 'Gender', prop: 'gender' },
        { label: 'DOB', prop: 'dob' },
        { label: 'Tel', prop: 'tel' },
      ],
      tableData: [],
      tableProps: {
        border: false,
        size: 'mini',
      },
      tableFilters: [
        {
          prop: ['enName', 'khName', 'gender'],
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
      let selector = {
        remove: false,
      }
      findStudents
        .callPromise({ selector: selector })
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    // Add new
    addNew() {
      this.modalVisible = true
      this.currentModal = StudentInsert
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
      this.currentModal = StudentUpdate
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeStudent,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
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
