<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :table-size="tableSize"
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
            {{ formatDate(scope.row.classDate) }}
          </span>
          <span v-else-if="title.prop === 'timeStudy'">
            {{ formatTime(scope.row.timeStudy) }}
          </span>
          <!-- <span v-else-if="title.prop[title.prop] === 'Closed'">
            {{ 1+1 }}
          </span> -->
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
              <el-dropdown-item :command="{action: 'finish', row: scope.row}">
                Finish
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import MsgBox from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import ClassInsert from './ClassInsert'
import ClassUpdate from './ClassUpdate'
import {
  findClassStudy,
  removeClassStudy,
  finishClassStudy,
} from '../../api/classStudy/methods'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'ClassList',
  component: {
    ClassInsert,
    ClassUpdate,
  },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        // { label: 'ID', prop: '_id' },
        { label: 'Date', prop: 'classDate' },
        { label: 'Room', prop: 'roomName' },
        { label: 'Teacher', prop: 'teacher' },
        { label: 'Subject', prop: 'subject' },
        { label: 'Time', prop: 'timeStudy' },
        { label: 'Type', prop: 'type' },
        { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
        stripe: false,
        defaultSort: {
          prop: '_id',
          order: 'ascending',
        },
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
              this.modalVisible = true
              this.currentModal = ClassInsert
            },
          },
          {
            name: 'Finish Class',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              // this.modalVisible = true
              // this.currentModal = ClassInsert
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      findClassStudy
        .callPromise({})
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // this.route({ name: 'register-new' })
        this.updateDoc = command.row
        this.modalVisible = true
        this.currentModal = ClassUpdate

        // this.modalVisible = true
        // this.currentModal = ClassUpdate
        // this.updateId = command.row._id
        // this.currentDialog = RegisterUpdate
      } else if (command.action === 'remove') {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            if (result) {
              let id = command.row._id
              removeClassStudy
                .callPromise({ _id: id })
                .then(result => {
                  if (result) {
                    MsgBox.success()
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
      } else if (command.action === 'finish') {
        this.$confirm('Are you sure ?', 'Warning', { type: 'warning' })
          .then(result => {
            let _id = command.row._id
            finishClassStudy
              .callPromise({ _id })
              .then(result => {
                if (result) {
                  MsgBox.success()
                  this.getData()
                }
              })
              .catch(error => {
                Notify.error({ message: error })
              })
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }
    },
    dialog() {
      this.$message.error(this.currentModal)
    },
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
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
