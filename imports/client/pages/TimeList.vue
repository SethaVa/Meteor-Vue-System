<template>
  <div>
    <!-- <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component> -->
    <sub-time-form :form-type="formType"
                   :update-doc="updateDoc"
                   @data-change="getData">

    </sub-time-form>
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
        <template slot-scope="scope">
          <span v-if="title.prop === 'timeStudy'">
            {{ formatTime(scope.row.timeStudy) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import Msg from '/imports/client/libs/message'
import SubTimeForm from './TimeForm'
import PositionUpdate from './PositionUpdate.vue'
import { findTimeStudy, removeTimeStudy } from '../../api/time//methods'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'TimeStudy',
  components: {
    SubTimeForm,
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
        { label: 'Time', prop: 'timeStudy' },
      ],
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
                  removeTimeStudy
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
      findTimeStudy
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
      let data = val
        .map(o => {
          return moment(o).format('hh:mm a')
        })
        .join('-')
      return data
    },
  },
}
</script>

<style>

</style>
