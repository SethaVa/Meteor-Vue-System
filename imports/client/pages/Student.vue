<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- table Data -->
    <data-tables :data="tableData"
                 :action-col-def="actionColDef"
                 :actions-def="actionsDef">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       :sortable="title.sort">
        <!-- <template slot-scope="scope" v-if="title.prop=='dob'">
            {{formatDate(scope.row.prop)}}
          </template> -->
      </el-table-column>
      <!-- <el-table-column prop="name" label="Name" width="120">
        </el-table-column>
        <el-table-column prop="address" label="Address">
        </el-table-column> -->
    </data-tables>
  </div>
</template>

<script>
import { findStudents, removeStudent } from '../../api/students/methods.js'
import StudentInsert from './StudentInsert.vue'
import StudentUpdate from './StudentUpdate.vue'

import moment from 'moment'

export default {
  name: 'student',
  meta: {
    headerTitle: 'Student'
  },
  component: {
    StudentInsert,
    StudentUpdate
  },
  data() {
    return {
      currentModal: null,
      updateId: null,
      modalVisible: false,
      titles: [
        { label: 'First Name', prop: 'name.first', sort: 'custom' },
        { label: 'Last Name', prop: 'name.last' },
        { label: 'Gender', prop: 'gender' },
        { label: 'DOB', prop: 'dob' },
        { label: 'Tel', prop: 'tel' }
      ],
      tableData: [],
      actionColDef: {
        label: 'Action',
        width: '100px',
        tableColProps: {
          align: 'center'
        },
        def: [
          {
            icon: 'el-icon-edit',
            handler: row => {
              this.currentModal = StudentUpdate
              // this.$router.push({
              //   name: "studentUpdate",
              //   params: { _id: row._id }
              // });
            }
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              this.handleRemove(row)
            }
          }
        ]
      },
      actionsDef: {
        colProps: {
          span: 19
        },
        def: [
          {
            name: 'New',
            icon: 'el-icon-plus',
            handler: () => {
              this.currentModal = StudentInsert
              console.log(this.currentModal)
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    routerView() {
      return this.$route.meta.routerView
    }
  },
  methods: {
    getData() {
      findStudents
        .callPromise()
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          console.log(err.reason)
        })
    },
    handleRemove(row) {
      let _id = row._id
      this.$confirm('Do you want to delete this record?', 'Warning')
        .then(() => {
          removeStudent
            .callPromise({ _id })
            .then(result => {
              this.$message({
                message: 'Delete Successfull',
                type: 'success'
              })
              this.getData()
            })
            .catch(err => {
              console.log(err.reason)
            })
        })
        .catch(() => {
          this.$message({
            message: 'Delete is Cancel',
            type: 'error'
          })
        })
    },
    formatDate(cellValue) {
      return moment(cellValue).format('YYYY/MM/DD')
    },
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
    }
  }
}
</script>

<style>

</style>
