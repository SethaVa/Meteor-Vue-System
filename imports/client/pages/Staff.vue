<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- Table Data -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :action-col-def="actionColDef"
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
    </data-tables>
  </div>
</template>

<script>
import StaffInsert from './StaffInsert.vue'
import StaffUpdate from './StaffUpdate.vue'
import { findStaff, removeStaff } from '../../api/Staffs/methods.js'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Teacher',
  component: {
    StaffInsert,
    StaffUpdate,
  },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'Name', prop: 'name' },
        { label: 'Gender', prop: 'gender' },
        { label: 'DOB', prop: 'dob' },
        { label: 'Email', prop: 'email' },
        { label: 'Telephone', prop: 'tel' },
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
              this.currentModal = StaffInsert
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
              this.updateId = row._id
              this.currentModal = StaffUpdate
            },
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              this.$confirm('Do you want to Delete this record?', 'Warning')
                .then(() => {
                  removeStaff
                    .callPromise(row._id)
                    .then(result => {
                      if (result) {
                        this.$message({
                          message: 'Delete Successfull',
                          type: 'success',
                        })
                      }
                      this.getData()
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
      findStaff
        .callPromise()
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
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
