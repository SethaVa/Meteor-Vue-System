<template>
  <div>
    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-id="updateId"
               @modal-close="handleClose"></component>

    <data-tables v-loading="loading"
                 :data="tableData"
                 :action-col-def="actionColDef"
                 :actions-def="actionsDef"
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

    </data-tables>
  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'

import { findUsers, removeUser } from '../../api/users/methods'

import UserNew from './UserNew.vue'
import UserEdit from './UserEdit.vue'

export default {
  name: 'User',
  component: { UserNew, UserEdit },
  // mixins: [dataTablesMixin, softRemoveMixin, restoreMixin, removeMixin],
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
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'Add New',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.currentDialog = UserNew
            },
          },
        ],
      },
      actionColDef: {
        label: 'Action',
        width: '100',
        def: [
          {
            icon: 'fas fa-edit',
            handler: row => {
              this.updateId = row._id
              this.visibleDialog = true
              this.currentDialog = UserEdit
            },
          },
          {
            icon: 'fas fa-trash',
            handler: row => {
              let id = row._id
              this.$confirm('Do you want delete this record?', 'Warning')
                .then(result => {
                  removeUser
                    .callPromise({ _id: id })
                    .then(result => {
                      this.$message({
                        message: 'Delete Successfull',
                        type: 'success',
                      })
                    })
                    .catch(err => {
                      this.$message(err.reason)
                    })
                  this.getData()
                })
                .catch(err => {
                  this.$message({
                    message: 'Cacel Delete',
                    type: 'error',
                  })
                })
            },
          },
        ],
      },
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
    // Get data
    getData() {
      this.loading = true

      findUsers
        .callPromise({
          selector: { username: { $ne: 'admin' } },
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
