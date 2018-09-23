<template>
  <div>
    <component :is="currentModal"
               :update-id="updateId"
               :visible="modalVisible"
               @modal-close="handleModalClose"></component>
    <!-- table Data -->
    <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar>
    <data-tables :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps"
                 v-loading="loading">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'tranDate'">
            {{ formatDate(scope.row.tranDate) }}
          </span>
          <span v-else-if="title.prop === 'totalUsd'">
            {{ formatNum(scope.row.totalUsd)+' $' }}
          </span>
          <span v-else-if="title.prop === 'totalKhr'">
            {{ formatNum(scope.row.totalKhr) + ' ៛' }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
      <!-- Action -->
      <el-table-column :render-header="renderTableMoreHeader"
                       align="center"
                       fixed="right"
                       width="70">
        <template slot-scope="scope">
          <table-action :actions="actionsList(scope.row)"
                        :row="scope.row"
                        @action-click="tableActionClick"></table-action>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import { findIncome, removeIncome } from '/imports/modules/school/api/Income/methods'
import IncomeInsert from './IncomeInsert.vue'
import IncomeUpdate from './IncomeUpdate.vue'

// Table Action
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export default {
  // name: 'IncomeLis',
  meta: {
    headerTitle: 'Student',
  },
  components: {
    IncomeInsert,
    IncomeUpdate,
    TableAction,
    TableToolbar,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      currentModal: null,
      updateId: null,
      modalVisible: false,
      titles: [
        { label: 'Date', prop: 'tranDate' },
        { label: 'Type', prop: 'referenceType' },
        { label: 'Total USD', prop: 'totalUsd' },
        { label: 'Total KHR', prop: 'totalKhr' },
      ],
      tableData: [],
      tableProps: {
        border: false,
        size: 'mini',
      },
      tableFilters: [
        {
          prop: ['tranDate', 'referenceType'],
          value: '',
        },
      ],
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
              this.currentModal = IncomeInsert
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
    renderTableMoreHeader(h, { column, $index }) {
      return h('h2', { class: 'el-icon-menu popover-icon' })
    },
    getData() {
      this.loading = true
      let options = {
        sort: { _id: -1 },
      }
      findIncome
        .callPromise({ options: options })
        .then(result => {
          _.forEach(result, o => {
            if (o.referenceType === 'Expend') {
              o.totalUsd = -o.totalUsd
              o.totalKhr = -o.totalKhr
            }
          })

          this.tableData = result
          this.loading = false
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    // Add new
    addNew() {
      this.modalVisible = true
      this.currentModal = IncomeInsert
    },
    // Table Action
    actionsList() {
      return ['edit', 'remove']
    },
    tableActionClick(command) {
      this[command.action](command.row)
    },
    // Edit Data
    edit(row) {
      if (row.referenceType !== 'Income' && row.referenceType !== 'Expend') {
        Notify.warning({
          message: 'This recorde is not Income or Expend !',
        })
      } else {
        this.updateId = row._id
        this.modalVisible = true
        this.currentModal = IncomeUpdate
      }
    },
    remove(row) {
      if (row.referenceType !== 'Income' && row.referenceType !== 'Expend') {
        Notify.warning({ message: 'This recorde is not Income or Expend !' })
      } else {
        this.$_removeMixin({
          meteorMethod: removeIncome,
          selector: { _id: row._id },
          successMethod: 'getData',
          loading: 'loading',
          title: row.title,
        })
      }
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    formatNum(val) {
      return numeral(val).format('0,0.00')
    },
    handleModalClose() {
      this.getData()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
    },
  },
}
</script>

<style>
</style>
