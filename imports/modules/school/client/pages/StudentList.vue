<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
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
            {{ scope.row.dob | date }}
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
import { findStudents, removeStudent } from '/imports/modules/school/api/students/methods.js'
import StudentForm from './StudentForm.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import { mapState } from 'vuex';

export default {
  // name: 'StudentList',
  meta: {
    headerTitle: 'Student',
  },
  components: {
    StudentForm,
    TableAction,
    TableToolbar,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      currentModal: null,
      updateId: null,
      modalVisible: false,
      titles: [
        { label: 'Code', prop: 'code' },
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
          prop: ['code','enName', 'khName', 'gender'],
          value: '',
        },
      ],
    }
  },
  computed:{
    ...mapState({
      currentBranchId(state){
        return state.app && state.app.currentBranch._id
      }
    })
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
        branchId:this.currentBranchId
      }
      findStudents
        .callPromise({ selector: selector })
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(err => {
          this.loading=false
          Notify.error({ message: err })
        })
    },
    // Add new
    addNew() {
      this.modalVisible = true
      this.currentModal = StudentForm
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
      this.currentModal = StudentForm
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
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.updateId=null
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
