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
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import ClassInsert from './ClassInsert'
import PositionUpdate from './PositionUpdate.vue'
import { findClassStudy, removeClassStudy } from '../../api/classStudy/methods'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'ClassList',
  component: {
    ClassInsert,
    PositionUpdate,
  },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id' },
        { label: 'Room', prop: 'roomId' },
        { label: 'Time', prop: 'time' },
        { label: 'Date', prop: 'classDate' },
      ],
      tableProps: {
        size: 'small',
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
              this.currentModal = PositionUpdate
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
                      if (result) {
                        this.$message.success('Delete Successfull')
                        this.getData()
                      }
                    })
                    .catch(err => {
                      this.$message.error(err.reason)
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
  },
}
</script>

<style>

</style>
