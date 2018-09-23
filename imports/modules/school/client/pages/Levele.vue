<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-id="updateId"
               @modal-close="handleClose"></component>

    <!-- Table Data -->
    <data-tables :data="tableData"
                 :action-col-def="actionColDef"
                 :actions-def="actionsDef"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort"></el-table-column>

    </data-tables>
  </div>
</template>
<script>
import LeveleInsert from './LeveleInsert'
import LevelUpdate from './LevelEdit.vue'
import { findLeveleStudy, removeLevelStudy } from '/imports/modules/school/api/level/methods.js'
export default {
  name: 'Levele',
  components: { LeveleInsert, LevelUpdate },
  data() {
    return {
      currentDialog: null,
      visibleDialog: false,
      updateId: null,
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Level', prop: 'leveleStudy', sort: 'leveleStudy' },
        { label: 'Describe', prop: 'des' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
      },
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'Add New',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.currentDialog = LeveleInsert
            },
          },
        ],
      },
      actionColDef: {
        label: 'Action',
        width: '100',
        def: [
          {
            icon: 'el-icon-edit',
            handler: row => {
              this.updateId = row._id
              this.visibleDialog = true
              this.currentDialog = LevelUpdate
            },
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              let id = row._id
              this.$confirm('Do you want delete this record?', 'Warning')
                .then(result => {
                  removeLevelStudy
                    .callPromise({ _id: id })
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
                    message: err.reason,
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
      findLeveleStudy
        .callPromise({})
        .then(result => {
          this.tableData = result
        })
        .catch(error => {
          // this.$message.error(error.reason)
          console.log(error.reason)
        })
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

</style>

