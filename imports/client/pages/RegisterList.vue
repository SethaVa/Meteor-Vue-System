<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-id="updateId"
               @modal-close="handleClose"></component>

    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables v-loading="loading"
                 :data="tableData"
                 :actions-def="actionsDef"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort"></el-table-column>
      <el-table-column width="60px"
                       label="Action">
        <template slot-scope="scope">
          <el-dropdown trigger="click"
                       @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="fa fa-align-justify"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="edit">Edit</el-dropdown-item> -->
              <!-- <el-dropdown-item command="remove">Remove</el-dropdown-item> -->

              <el-dropdown-item :command="{action: 'edit', row: scope.row}">
                Edit
              </el-dropdown-item>

              <el-dropdown-item :command="{action: 'remove', row: scope.row}">
                Remove
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </data-tables>
  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import RegisterInsert from './RegisterInsert.vue'
import RegisterUpdate from './RegisterUpdate.vue'
import { findRegister, removeRegister } from '../../api/register/methods.js'
export default {
  name: 'RegisterList',
  components: { RegisterInsert, RegisterUpdate },
  data() {
    return {
      loading: false,
      currentDialog: null,
      visibleDialog: false,
      updateId: null,
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Class', prop: 'classId', sort: 'custom' },
        { label: 'Student', prop: 'studentId' },
      ],
      tableProps: {
        size: 'mini',
        // border: false,
      },
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'New',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.visibleDialog = true
              this.currentDialog = RegisterInsert
            },
          },
        ],
      },
      actionColDef: {
        label: 'Action',
        width: '100',
        def: [
          {
            // icon: 'el-icon-edit',
            // handler: row => {
            //   this.updateId = row._id
            //   this.currentDialog = RegisterUpdate
            // },
          },
          // {
          //   icon: 'el-icon-delete',
          //   handler: row => {
          //     let id = row._id
          //     this.$confirm('Do you want delete this record?', 'Warning')
          //       .then(result => {
          //         removeRoom
          //           .callPromise(id)
          //           .then(result => {
          //             this.$message({
          //               message: 'Delete Successfull',
          //               type: 'success',
          //             })
          //           })
          //           .catch(err => {
          //             this.$message(err.reason)
          //           })
          //         this.getData()
          //       })
          //       .catch(err => {
          //         this.$message({
          //           message: 'Cacel Delete',
          //           type: 'error',
          //         })
          //       })
          //   },
          // },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      findRegister
        .callPromise({})
        .then(result => {
          this.loading = false
          this.tableData = result
        })
        .catch(err => {
          this.$message(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // this.route({ name: 'register-new' })
        this.visibleDialog = true
        this.currentDialog = RegisterUpdate
        // this.updateId = command.row._id
        // this.currentDialog = RegisterUpdate
      } else if (command.action === 'remove') {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            if (result) {
              let id = command.row._id
              removeRegister
                .callPromise({ _id: id, referenceType: 'New' })
                .then(result => {
                  if (result) {
                    Msg.success()
                  }
                })
                .catch(err => {
                  Notify.error({ message: err.reason + 'Error' })
                })
              this.getData()
            }
          })
          .catch(err => {
            Notify.error({ message: 'Cacel Delete' })
            // this.$message({
            //   message: 'Cacel Delete',
            //   type: 'error',
            // })
          })
      }
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 10px;
}
</style>

