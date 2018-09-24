<template>
  <div>
    <!-- <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component> -->
    <level-form :form-type="formType"
                :update-doc="updateDoc"
                @data-change="getData">
    </level-form>
    <!-- <time-form ></time-form> -->
    <!-- Table Data -->
    <data-tables :data="tableData"
                 :search-def="searchDef"
                 v-loading="loading"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label">
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
import LevelForm from './LevelForm.vue'
import {
  findLevel,
  removeLevel,
} from '/imports/modules/school/api/level/methods'

import TableAction from '/imports/client/components/TableAction.vue'
import removeMixin from '/imports/client/mixins/remove'

export default {
  name: 'LevelList',
  components: {
    TableAction,
    LevelForm,
  },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      formType: 'New',
      updateDoc: null,
      searchDef: {
        show: false,
      },
      tableData: [],
      titles: [{ label: 'ID', prop: '_id' }, { label: 'Level', prop: 'level' }],
      tableProps: {
        size: 'mini',
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
      findLevel
        .callPromise({})
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
        meteorMethod: removeLevel,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
  },
}
</script>

<style>
</style>
