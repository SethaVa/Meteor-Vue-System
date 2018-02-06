<template>
  <div>

      <component
        :is="currentDialog"
        :visible="visibleDialog"
        :update-id="updateId"
        @modal-close="handleClose"
      ></component>

      <!-- Table Data -->
      <data-tables
        :data="tableData"
        :action-col-def="actionColDef"
        :actions-def="actionsDef"
        :table-prop="tableProp"
      >
      <el-table-column
        v-for="title in titles" 
        :key="title.value"
        :label="title.label"
        :prop="title.prop"
        :sortable="title.sort"
      ></el-table-column>

      </data-tables>
  </div>
</template>

<script>
import SubjectInsert from "./SubjectInsert.vue";
import SubjectUpdate from './SubjectUpdate.vue';
import { findSubject, removeSubject } from "../../api/subject/methods.js";
export default {
  name: "Subject",
  components: { SubjectInsert },
  data() {
    return {
      currentDialog: null,
      visibleDialog: false,
      updateId: null,
      tableData: [{ code: "002", title: "Hip Hip 2", SubjectType: "Full Time" }],
      titles: [
        { label: "Code", prop: "code", sort: "custom" },
        { label: "Title", prop: "title", sort: "custom" },
        { label: "Type", prop: "typeId" }
      ],
      tableProp: {
        size: "mini"
      },
      actionsDef: {
        colProps: {
          span: 19
        },
        def: [
          {
            name: "new",
            icon: "el-icon-plus",
            handler: () => {
              this.currentDialog = SubjectInsert;
            }
          }
        ]
      },
      actionColDef: {
        label: "Action",
        width: "100",
        def: [
          {
            icon: "el-icon-edit",
            handler: row => {
                this.updateId = row._id;
                this.currentDialog = SubjectUpdate;
            }
          },
          {
            icon: "el-icon-delete",
            handler: row => {
              let id = row._id;
              this.$confirm("Do you want delete this record?", "Warning")
                .then(result => {
                  removeSubject
                    .callPromise(id)
                    .then(result => {
                      this.$message({
                        message: "Delete Successfull",
                        type: "success"
                      });
                    })
                    .catch(err => {
                      this.$message(err.reason);
                    });
                    this.getData();
                })
                .catch(err => {
                    this.$message({
                        message:'Cacel Delete',
                        type:'error'
                    })
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
      findSubject
        .callPromise({})
        .then(result => {
          this.tableData = result;
        })
        .catch(err => {
          this.$message(err.reason);
        });
    },
    handleClose() {
      this.getData();
      (this.visibleDialog = false),
        this.$nextTick(() => {
          this.currentDialog = null;
        });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

