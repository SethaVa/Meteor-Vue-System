<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- Table Data -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables :data="tableData"
                 :filters="tableFilters"
                 v-loading="loading"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'dob'">
            {{ scope.row.dob | date }}
          </span>
          <span v-else-if="title.prop === 'position'">
            {{ scope.row.position }}
          </span>
          <span v-else-if="title.prop === 'baseSalary'">
            {{ scope.row.baseSalary | number }}
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
import StaffForm from './StaffForm.vue'
// import StaffDetail from './staffDetail'
import {
  findStaff,
  removeStaff,
} from '/imports/modules/school/api/staffs/methods.js'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Staff',
  components: {
    StaffForm,
    // StaffDetail,
    TableAction,
    TableToolbar,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading:false,
      // Componemt
      currentModal: null,
      modalVisible: false,
      updateId: null,
      // Table prop
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'Name', prop: 'name' },
        { label: 'Gender', prop: 'gender' },
        { label: 'DOB', prop: 'dob' },
        { label: 'Email', prop: 'email' },
        { label: 'Telephone', prop: 'tel' },
        { label: 'Salary', prop: 'baseSalary' },
        { label: 'Position', prop: 'position' },
      ],
      tableProps: {
        size: 'mini',
        stripe: false,
        defaultSort: {
          prop: '_id',
          order: 'descending',
        },
      },
      tableFilters: [
        {
          prop: ['name', 'position'],
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
      findStaff
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
      this.currentModal = StaffForm
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
      this.currentModal = StaffForm
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeStaff,
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
        this.updateId = null
        this.currentModal = null
      })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    formateArr(val) {
      return val.map(val => {
        return val
      })
    },
  },
}
</script>

<style>
</style>
