<template>
  <div>

    <component :is="currentDialog"
               :visible="visibleDialog"
               :update-doc="updateDoc"
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
import Notify from '/imports/client/libs/notify'
import MsgBox from '/imports/client/libs/message'
import SubjectInsert from './SubjectInsert.vue'
import SubjectUpdate from './SubjectUpdate.vue'
import { findSubject, removeSubject } from '../../api/subject/methods.js'
export default {
  name: 'Subject',
  components: { SubjectInsert },
  data() {
    return {
      currentDialog: null,
      visibleDialog: false,
      updateDoc: null,
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Title', prop: 'title', sort: 'custom' },
        { label: 'Level', prop: 'level' },
        { label: 'Type', prop: 'type' },
      ],
      tableProps: {
        size: 'mini',
      },
      actionsDef: {
        colProps: {
          span: 19,
        },
        def: [
          {
            name: 'new',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini',
            },
            handler: () => {
              this.visibleDialog = true
              this.currentDialog = SubjectInsert
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
              this.updateDoc = row
              this.visibleDialog = true
              this.currentDialog = SubjectUpdate
            },
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              let id = row._id
              this.$confirm('Do you want delete this record?', 'Warning')
                .then(result => {
                  if (result) {
                    removeSubject
                      .callPromise(id)
                      .then(result => {
                        if (result) {
                          MsgBox.success('Delete Success')
                        }
                      })
                      .catch(err => {
                        this.$message(err.reason)
                      })
                    this.getData()
                  }
                })
                .catch(err => {
                  MsgBox.warning('Delete has been ' + err)
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
      findSubject
        .callPromise({})
        .then(result => {
          this.tableData = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleClose() {
      this.getData()
      ;(this.visibleDialog = false),
        this.$nextTick(() => {
          this.currentDialog = null
        })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

