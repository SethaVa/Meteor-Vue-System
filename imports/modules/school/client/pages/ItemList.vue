<template>
  <div>

    <sub-item-form :form-type="formType"
                   :update-doc="updateDoc"
                   @data-change="getData">
    </sub-item-form>
    <!-- <time-form ></time-form> -->
    <!-- Table Data -->
    <data-tables :data="tableData"
                 :search-def="searchDef"
                 v-loading="loading"
                 :action-col-def="actionColDef"
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
import Msg from '/imports/client/lib/message'
import SubItemForm from './ItemForm'
import PositionUpdate from './PositionUpdate.vue'
import { findItems, removeItems } from '/imports/modules/school/api/items/methods'
import moment from 'moment'
import _ from 'lodash'
export default {
  // name: 'TimeStudy',
  components: {
    SubItemForm,
    PositionUpdate,
  },
  data() {
    return {
      loading: false,
      formType: 'Add New',
      updateDoc: null,
      searchDef: {
        show: false,
      },
      tableData: [],
      titles: [
        { label: 'ID', prop: '_id' },
        { label: 'Name', prop: 'name' },
        { label: 'Category', prop: 'categoryDoc.name' },
        { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'mini',
      },
      actionColDef: {
        label: 'Action',
        def: [
          {
            icon: 'el-icon-edit',
            buttonProps: {
              size: 'mini',
              type: 'primary',
            },
            handler: row => {
              this.updateDoc = row
              this.formType = 'Update'
            },
          },
          {
            icon: 'el-icon-delete',
            buttonProps: {
              size: 'mini',
              type: 'danger',
            },
            handler: row => {
              this.$confirm('Do you want to Delete this record?', 'Warning')
                .then(() => {
                  let id = row._id
                  removeItems
                    .callPromise({ _id: id })
                    .then(result => {
                      if (result) {
                        Msg.success('Delete Successfull')
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
      findItems
        .callPromise({})
        .then(result => {
          this.tableData = result
          this.formType = 'Add New'
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    formatTime(val) {
      return val
        .map(o => {
          return moment(o).format('hh:mm a')
        })
        .join('-')
      // return data
    },
  },
}
</script>

<style>
</style>
