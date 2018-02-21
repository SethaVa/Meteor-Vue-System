<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :action-col-def="actionColDef"
                 :table-size="tableSize"
                 :pagination-def="paginationDef"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       :sortable="title.sort">
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import PositionInsert from './PositionInsert.vue'
import PositionUpdate from './PositionUpdate.vue'
import { findPosition, removePosition } from '../../api/positions/methods'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Position',
  component: {
    PositionInsert,
    PositionUpdate
  },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id', sort: 'custom' },
        { label: 'Position', prop: 'position', sort: 'custom' },
        { label: 'Description', prop: 'des' },
        { label: 'Status', prop: 'status' }
      ],
      tableProps: {
        size: 'small'
      },
      paginationDef: {
        pageSize: 1,
        pageSizes: [5, 10, 20]
      },
      actionsDef: {
        colProps: {
          span: 19
        },
        def: [
          {
            name: 'New',
            icon: 'el-icon-plus',
            buttonProps: {
              size: 'mini'
            },
            handler: () => {
              this.currentModal = PositionInsert
            }
          }
        ]
      },
      actionColDef: {
        label: 'Action',
        def: [
          {
            icon: 'el-icon-edit',
            handler: row => {
              this.updateId = row._id
              this.currentModal = PositionUpdate
            }
          },
          {
            icon: 'el-icon-delete',
            handler: row => {
              this.$confirm('Do you want to Delete this record?', 'Warning')
                .then(() => {
                  let id = row._id
                  removePosition
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
                    type: 'error'
                  })
                })
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      findPosition
        .callPromise({})
        .then(result => {
          this.tableData = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    dialog() {
      console.log(this.currentModal)
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
    }
  }
}
</script>

<style>

</style>
