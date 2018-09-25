<template>
  <div>
    <position-form :form-type="formType"
                   :update-doc="updateDoc"
                   @modal-close="getData">
    </position-form>

    <data-tables :data="tableData"
                 :filters="tableFilters"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       :sortable="title.sort">
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
import PositionForm from './PositionInsert.vue'
import {
  findPosition,
  removePosition,
} from '/imports/modules/school/api/positions/methods'

// Table Action
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

import moment from 'moment'
import _ from 'lodash'
export default {
  // name: 'Position',
  components: {
    PositionForm,
    TableAction,
  },
  mixins: [removeMixin],
  data() {
    return {
      formType: 'New',
      updateDoc: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        { label: 'Position', prop: 'position', sort: 'custom' },
        { label: 'Description', prop: 'des' },
      ],
      tableProps: {
        size: 'small',
      },
      tableFilters: [
        {
          prop: ['position'],
          value: '',
        },
      ],
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
      findPosition
        .callPromise({ selector: {}, options: { sort: { _id: -1 } } })
        .then(result => {
          this.tableData = result
          this.formType = 'New'
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
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
      this.updateDoc = row
      this.formType = 'Update'
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removePosition,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    dialog() {
      this.$message.error(this.currentModal)
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

<style>
</style>
