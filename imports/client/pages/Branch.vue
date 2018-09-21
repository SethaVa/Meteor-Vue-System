<template>
  <div>
    <!--Modal Form-->
    <component
      :is="currentModal"
      :update-doc="updateDoc"
      :visible="modalVisible"
      @modal-close="handleModalClose"
    >
    </component>

    <!-- Toolbar -->
    <TableToolbar
      v-model="tableFilters"
      @new="addNew"
    >
    </TableToolbar>

    <!-- Datatable -->
    <data-tables
      v-loading="loading"
      :data="tableData"
      :filters="tableFilters"
      :table-props="tableProps"
    >
      <el-table-column
        v-for="title in tableTitles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span :class="softRemoveClassName(scope.row.removed)">
            <span v-if="title.prop === 'postDate'">
              {{ $moment(scope.row.postDate).format('DD/MM/YYY') }}
            </span>
            <span v-else>{{ scope.row[title.prop] }}</span>
          </span>
        </template>
      </el-table-column>

      <!-- Table Action -->
      <el-table-column
        label="Actions"
        align="center"
        fixed="right"
        width="70"
      >
        <template slot-scope="scope">
          <table-action
            :actions="actionsList(scope.row)"
            :row="scope.row"
            @action-click="tableActionClick"
          ></table-action>
        </template>
      </el-table-column>
    </data-tables>

  </div>
</template>

<script>
// Message
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

// Mixin
// import dataTablesMixin from '/imports/client/mixins/data-tables'
// import softRemoveMixin from '/imports/client/mixins/soft-remove'
// import restoreMixin from '/imports/client/mixins/restore'
import removeMixin from '/imports/client/mixins/remove'

// Table
import TableToolbar from '/imports/client/components/TableToolbar.vue'
import TableAction from '/imports/client/components/TableAction.vue'

import {
  findBranches,
  removeBranch,
} from '../../api/branches/methods'

import branchNew from './BranchNew'
import branchEdit from './BranchEdit'

export default {
  name: 'Branch',
  components: { TableToolbar, TableAction, branchNew, branchEdit },
  mixins: [removeMixin],
  data() {
    return {
      loading: false,
      tableData: [],
      tableTitles: [
        { label: 'ID', prop: '_id' },
        { label: 'Name', prop: 'name' },
        { label: 'Short Name', prop: 'shortName' },
        { label: 'Address', prop: 'address' },
        { label: 'Telephone', prop: 'telephone' },
        { label: 'Email', prop: 'email' },
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
      tableFilters: [
        {
          prop: ['_id', 'name', 'shortName'],
          value: '',
        },
      ],
      // Modal
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
    }
  },
  computed: {
    userIsInRole() {
      return this.$store.getters['userIsInRole'](['super'])
    },
  },
  created() {
    // Extend data tables props (Mixin)
    // this.tableProps.defaultSort = {
    //   prop: '_id',
    //   order: 'ascending',
    // }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      findBranches
        .callPromise({})
        .then(result => {
          this.tableData = result
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          Notify.error({ message: error })
        })
    },
    // Add new
    addNew() {
      this.currentModal = branchNew
      this.$nextTick(() => {
        this.modalVisible = true
      })
    },

    // Toble Formatter
    softRemoveClassName(removed) {
      return removed ? 'soft-remove' : ''
    },

    // Table Action
    actionsList(row) {
      let actions = ['edit']
      if (row.removed) {
        // actions.push('restore')
        // actions.push('remove')
      } else {
        // actions.push('softRemove')
        actions.push('remove')
      }

      return actions
    },
    tableActionClick(command) {
      this[command.action](command.row)
    },
    edit(row) {
      this.updateDoc = row
      this.currentModal = branchEdit
      this.$nextTick(() => {
        this.modalVisible = true
      })
    },
    // softRemove(row) {
    //   this.$_softRemoveMixin({
    //     meteorMethod: softRemoveBranch,
    //     selector: { _id: row._id },
    //     successMethod: 'getData',
    //     loading: 'loading',
    //     title: row.title,
    //   })
    // },
    // restore(row) {
    //   this.$_restoreMixin({
    //     meteorMethod: restoreBranch,
    //     selector: { _id: row._id },
    //     successMethod: 'getData',
    //     loading: 'loading',
    //     title: row.title,
    //   })
    // },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeBranch,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    handleModalClose() {
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
        this.getData()
      })
    },
    // // Add new
    // addNew() {
    //   this.$router.push({ name: 'app.branchNew' })
    // },
    // // Action
    // handleTableAction(command) {
    //   this[command.action](command.row)
    // },
    // edit(row) {
    //   this.$router.push({
    //     name: 'app.branchEdit',
    //     params: { _id: row._id },
    //   })
    // },
    // remove(row) {
    //   this.$_removeMixin({
    //     meteorMethod: removeBranch,
    //     selector: { _id: row._id },
    //     successMethod: 'getData',
    //     loading: 'loading',
    //     title: row._id,
    //   })
    // },
  },
}
</script>

<style lang="scss" scoped>
// @import '~imports/client/styles/main.scss';
</style>
