<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables :data="tableData"
                 v-loading="loading"
                 :actions-def="actionsDef"
                 :table-size="tableSize"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <!-- <label v-if="scope.props='tranDate'">{{ formatDate(scope.props.tranDate) }}</label>
          <label v-else></label> -->
          <span v-if="title.prop === 'tranDate'">
            {{ formatDate(scope.row.tranDate) }}
          </span>
          <span v-else-if="title.prop === 'timeStudy'">
            {{ formatTime(scope.row.timeStudy) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>

        </template>
      </el-table-column>
      <el-table-column width="60px"
                       label="Action">
        <template slot-scope="scope">
          <el-dropdown trigger="click"
                       @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="fa fa-align-justify"></i>
            </span>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item :command="{action: 'edit', row: scope.row}">
                Edit
              </el-dropdown-item>

              <el-dropdown-item :command="{action: 'remove', row: scope.row}">
                Remove
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import MsgBox from '/imports/client/libs/message'
import moment from 'moment'
//
import ExchangeClassInsert from '../pages/ExchangeClassInsert.vue'
import ExchangeClassUpdate from '../pages/ExchangeClassUpdate.vue'
import {
  findExchangeClass,
  removeExchangeClass,
} from '../../api/exchange-class/methods'
export default {
  data() {
    return {
      loading: false,
      currentModal: null,
      modalVisible: false,
      updateId: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        // { label: 'ID', prop: '_id' },
        { label: 'Date', prop: 'tranDate' },
        { label: 'From', prop: 'fromRoom' },
        { label: 'To', prop: 'toRoom' },
        { label: 'Student', prop: 'name' },
        // { label: 'Type', prop: 'type' },
        // { label: 'Status', prop: 'status' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
        stripe: false,
        defaultSort: {
          prop: '_id',
          order: 'ascending',
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
              this.currentModal = ExchangeClassInsert
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
      this.loading = true
      findExchangeClass
        .callPromise({})
        .then(result => {
          this.tableData = result
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleCommand(command) {
      if (command.action === 'edit') {
        // this.route({ name: 'register-new' })
        this.updateId = command.row._id
        this.modalVisible = true
        this.currentModal = ExchangeClassUpdate

        // this.modalVisible = true
        // this.currentModal = ClassUpdate
        // this.updateId = command.row._id
        // this.currentDialog = RegisterUpdate
      } else if (command.action === 'remove') {
        this.$confirm('Do you want delete this record?', 'Warning', {
          type: 'warning',
        })
          .then(result => {
            if (result) {
              let id = command.row._id
              removeExchangeClass
                .callPromise({ _id: id })
                .then(result => {
                  if (result) {
                    MsgBox.success()
                  }
                })
                .catch(err => {
                  Notify.error({ message: err.reason + 'Error' })
                })
              this.getData()
            }
          })
          .catch(err => {
            Notify.error({ message: err.reason })
          })
      }
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

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 10px;
}
</style>
