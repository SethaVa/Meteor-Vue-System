<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- table Data -->
    <!-- :action-col-def="actionColDef" -->

    <data-tables v-loading="loading"
                 :data="tableData"
                 :actions-def="actionsDef"
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
      <el-table-column width="60px"
                       label="Action">
        <template slot-scope="scope">
          <el-dropdown trigger="click"
                       @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="fa fa-align-justify"></i>
            </span>
            <el-dropdown-menu slot="dropdown">

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
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import { findStudents, removeStudent } from '../../api/students/methods.js'
import StudentInsert from './StudentInsert.vue'
import StudentUpdate from './StudentUpdate.vue'

import moment from 'moment'

export default {
  name: 'StudentList',
  meta: {
    headerTitle: 'Student',
  },
  component: {
    StudentInsert,
    StudentUpdate,
  },
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
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'New Student',
            icon: 'el-icon-circle-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.modalVisible = true
              this.currentModal = StudentInsert
            },
          },
        ],
      },
      // actionColDef: {
      //   label: 'Action',
      //   width: '100px',
      //   tableColProps: {
      //     align: 'center',
      //   },
      //   def: [
      //     {
      //       icon: 'el-icon-edit',
      //       handler: row => {
      //         this.updateDoc = row
      //         this.modalVisible = true
      //         this.currentModal = StudentUpdate
      //         // this.$router.push({
      //         //   name: 'studentUpdate',
      //         //   params: { _id: row._id },
      //         // })
      //       },
      //     },
      //     {
      //       icon: 'el-icon-delete',
      //       handler: row => {
      //         this.handleRemove(row)
      //       },
      //     },
      //   ],
      // },
    }
  },
  // computed: {
  //   routerView() {
  //     return this.$route.meta.routerView
  //   },
  // },
  mounted() {
    this.getData()
  },

  methods: {
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
          console.log(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // this.route({ name: 'register-new' })
        this.updateDoc = command.row
        this.modalVisible = true
        this.currentModal = StudentUpdate
      } else if (command.action === 'remove') {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            if (result) {
              let id = command.row._id
              removeStudent
                .callPromise({ _id: id })
                .then(result => {
                  if (result) {
                    Msg.success()
                  }
                })
                .catch(err => {
                  Notify.error({ message: err.reason + ' Error' })
                })
              this.getData()
            }
          })
          .catch(err => {
            Notify.error({ message: err.reason })
          })
      }
    },
    handleRemove(row) {
      let _id = row._id
      this.$confirm('Do you want to delete this record?', 'Warning', {
        type: 'warning',
      })
        .then(() => {
          removeStudent
            .callPromise({ _id })
            .then(result => {
              Msg.success()
              this.getData()
            })
            .catch(err => {
              Notify.error({ message: err })
            })
        })
        .catch(() => {
          this.$message({
            message: 'Delete is Cancel',
            type: 'error',
          })
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
