<template>
  <div>
    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-id="updateId"
               @modal-close="handleClose"></component>
    <!-- Table  -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables v-loading="loading"
                 :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps">

      <el-table-column prop="profile.fullName"
                       label="Full Name"
                       sortable="custom">
      </el-table-column>

      <el-table-column prop="username"
                       label="Username"
                       sortable="custom">
      </el-table-column>

      <el-table-column prop="emails[0].address"
                       label="Email"
                       sortable="custom">
      </el-table-column>

      <el-table-column prop="profile.status"
                       label="Status"
                       sortable="custom">
      </el-table-column>
      <!-- :formatter="arrFormatter" -->
      <el-table-column prop="roles"
                       label="Roles">
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

import { findUsers, removeUser } from '../../api/users/methods'

import UserNew from './UserNew.vue'
import UserEdit from './UserEdit.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

export default {
  name: 'User',
  components: { UserNew, UserEdit, TableAction, TableToolbar },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      currentDialog: null,
      visibleDialog: false,
      updateId: null,
      titles: [
        { label: 'Full Name', prop: 'profile.fullName', sort: 'custom' },
        { label: 'Username', prop: 'username', sort: 'custom' },
        { label: 'Email', prop: 'emails[0].address' },
        { label: 'Status', prop: 'profile.status' },
        { label: 'Role', prop: 'roles' },
      ],
      tableData: [],
      tableProps: {
        size: 'mini',
        border: false,
      },
      tableFilters: [
        {
          prop: ['username', 'profile.status', 'profile.fullName'],
          value: '',
        },
      ],
    }
  },
  computed: {
    routerView() {
      return this.$route.meta.routerView
    },
    userIsInSuperRole() {
      return this.$store.getters['userIsInRole'](['super'])
    },
    userIsInSuperAdminRole() {
      return this.$store.getters['userIsInRole'](['super', 'admin'])
    },
  },
  watch: {
    routerView(val) {
      if (!val) {
        this.getData()
      }
    },
  },
  created() {
    // Extend data tables props (Mixin)
    this.tableProps.defaultSort = {
      prop: 'profile.fullName',
      order: 'ascending',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    renderTableMoreHeader(h, { column, $index }) {
      return h('h2', { class: 'el-icon-menu popover-icon' })
    },
    // Get data
    getData() {
      this.loading = true

      findUsers
        .callPromise({
          selector: { roles: { $ne: 'admin' } },
          options: { sort: { fullName: 1 } },
        })
        .then(result => {
          this.tableData = result
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          Notify.error({ message: error })
        })
    },
    // Add new
    addNew() {
      this.currentDialog = UserNew
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
      this.visibleDialog = true
      this.currentDialog = UserEdit
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeUser,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    arrFormatter(row, column, cellValue) {
      return JSON.stringify(cellValue)
    },
    handleClose() {
      this.getData()
      this.visibleDialog = false
      this.$nextTick(() => {
        this.currentDialog = null
      })
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '../styles/main.scss';
</style>
