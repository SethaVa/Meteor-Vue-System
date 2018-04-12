<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :action-col-def="actionColDef"
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
          <span v-else>{{ scope.row[title.prop] }}</span>

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
import { findClassStudy, removeClassStudy } from '../../api/classStudy/methods'
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
        ],
      },
      actionColDef: {
        label: 'Action',
        def: [
          {
            icon: 'el-icon-edit',
            handler: row => {
              this.updateDoc = row
              this.modalVisible = true
              this.currentModal = ClassUpdate
            },
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              this.$confirm('Do you want to Delete this record?', 'Warning')
                .then(() => {
                  let id = row._id
                  removeClassStudy
                    .callPromise({ _id: id })
                    .then(result => {
                      MsgBox.success('Delete Successfull')
                      this.getData()
                    })
                    .catch(err => {
                      Notify.error({ message: err })
                    })
                })
                .catch(() => {
                  this.$message({
                    message: 'Delete Cancel',
                    type: 'error',
                  })
                })
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
          console.log(result)
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
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

<style>

</style>
