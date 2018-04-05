<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-id="updateId"
               @modal-close="handleClose"></component>

    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort"></el-table-column>
      <el-table-column label="Action">
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
import RoomInsert from './RoomInsert.vue'
import RoomUpdate from './RoomUpdate.vue'
import { findRoom, removeRoom } from '../../api/rooms/methods.js'
export default {
  name: 'RegisterList',
  components: { RoomInsert, RoomUpdate },
  data() {
    return {
      currentDialog: null,
      visibleDialog: false,
      updateId: null,
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Name', prop: 'roomName', sort: 'custom' },
        { label: 'Describe', prop: 'des' },
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
              this.currentDialog = RoomInsert
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
            //   this.currentDialog = RoomUpdate
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
      findRoom
        .callPromise({})
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // this.updateId = command.row._id
        // this.currentDialog = RoomUpdate
      } else if (command.action === 'remove') {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            removeRoom
              .callPromise(command.row.id)
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

