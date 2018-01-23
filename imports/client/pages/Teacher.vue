<template>
  <div>
      <component
        :is="currentModal"
        :update-id="updateId"
        :visible="modalVisible"
        @modal-close="handleModalClose"
      ></component>
      <!-- Table Data -->
      <data-tables 
        :data="tableData"
        :actions-def="actionsDef"
        :action-col-def="actionColDef"
        :table-size="tableSize"
        :pagination-def="paginationDef"
        :table-props="tableProps"
      >
      <el-table-column
        v-for="title in titles"
        :key="title.prop"
        :prop="title.prop"
        :label="title.label"
        :sortable="title.sort"
        
      >
      </el-table-column>
      </data-tables>
  </div>
</template>

<script>
import TeacherInsert from "./TeacherInsert.vue";
import TeacherUpdate from "./TeacherUpdate.vue";
import { findTeacher, removeTeacher } from "../../api/Teachers/methods.js";
import moment from 'moment';
import _ from 'lodash';
export default {
  name: "Teacher",
  component: {
    TeacherInsert
  },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize:'mini',
      tableData: [],
      titles: [
        { label: "First Name", prop: "first", sort: "custom" },
        { label: "Last Name", prop: "last", sort: "custom" },
        { label: "Gender", prop: "gender" },
        { label: "DOB", prop: "dob" },
        { label: "Email", prop: "email" },
        { label: "Telephone", prop: "tel" }
      ],
      tableProps:{
        size:'small'
      },
      paginationDef:{
        pageSize: 1,
        pageSizes: [5, 10, 20],
      },
      actionsDef: {
        colProps: {
          span: 19
        },
        def: [
          {
            name: "New",
            icon: "el-icon-plus",
            buttonProps:{
              size:'mini'
            },
            handler: () => {
              this.currentModal = TeacherInsert;
            }
          }
        ]
      },
      actionColDef: {
        label: "Action",
        def: [
          {
            icon: "el-icon-edit",
            handler: row => {
              this.updateId = row._id;
              this.currentModal = TeacherUpdate;
            }
          },
          {
            icon: "el-icon-delete",
            handler: row => {
              this.$confirm("Do you want to Delete this record?", "Warning")
                .then(() => {
                  // let _id = row._id;
                  removeTeacher
                    .callPromise(row._id)
                    .then(result => {
                      this.$message({
                        message: "Delete Successfull",
                        type: "success"
                      });
                      this.getData();
                    })
                    .catch(err => {
                      console.log(err.reason);
                    });
                })
                .catch(() => {
                  this.$message({
                    message: "Delete Cancel",
                    type: "error"
                  });
                });
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      findTeacher
        .callPromise({sort:-1})
        .then(result => {
          this.tableData = result;
          _.forEach(this.tableData,o=>{
              o.dob = this.formatDate(o.dob);
          })
          // this.tableData[0].dob = this.formatDate(this.tableData[0].dob);
          // console.log()
        })
        .catch(err => {
          console.log(err.reason);
        });
    },
    dialog() {
      console.log(this.currentModal);
    },
    handleModalClose() {
      this.getData();
      this.modalVisible = false;
      this.$nextTick(() => {
        this.currentModal = null;
      });
    },
    formatDate(val){
      return moment(val).format('DD/MM/YYYY')
    }
  }
};
</script>

<style>

</style>
