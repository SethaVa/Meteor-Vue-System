<template>
  <div>

    <room-form :form-type="formType"
               :update-doc="updateDoc"
               @data-change="getData"></room-form>

    <!-- Table Data -->
    <!-- <TableToolbar v-model="tableFilters"
                  @new="addNew">
    </TableToolbar> -->
    <!-- :filters="tableFilters" -->
    <data-tables :data="tableData"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.value"
                       :label="title.label"
                       :prop="title.prop"
                       :sortable="title.sort"></el-table-column>
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
import Notify from '/imports/client/lib/notify'
import {
  findRoom,
  removeRoom,
} from '/imports/modules/school/api/rooms/methods.js'

import RoomForm from './RoomForm.vue'
// Table Action
// import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

export default {
  // name: 'Room',
  components: { RoomForm, TableAction },
  minxns: [removeMixin],
  data() {
    return {
      formType: 'New',
      updateDoc: null,
      tableData: [],
      titles: [
        { label: 'Name', prop: 'name', sort: 'custom' },
        { label: 'Describe', prop: 'des' },
      ],
      tableProps: {
        size: 'mini',
        border: false,
      },
      tableFilters: [
        {
          prop: ['roomName'],
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
      findRoom
        .callPromise({ selector: {}, options: { sort: { _id: -1 } } })
        .then(result => {
          this.tableData = result
          this.formType = 'New'
        })
        .catch(err => {
          Notify.error({ message: err })
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
      // this.updateDoc = row._id
      this.updateDoc = row
      this.formType = 'Update'
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeRoom,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
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

