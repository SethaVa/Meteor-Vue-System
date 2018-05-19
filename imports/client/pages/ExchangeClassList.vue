<template>
  <div>
    <component :is="currentModal"
               :update-doc="updateDoc"
               :visible="modalVisible"
               @modal-close="handleModalClose">
    </component>
    <!-- Table Data -->
    <!-- :action-col-def="actionColDef" -->
    <data-tables :data="tableData"
                 :actions-def="actionsDef"
                 :table-size="tableSize"
                 :table-props="tableProps">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <!-- <label v-if="scope.props='classDate'">{{ formatDate(scope.props.classDate) }}</label>
          <label v-else></label> -->
          <span v-if="title.prop === 'classDate'">
            {{ formatDate(scope.row.classDate) }}
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
import ExchangeClassInsert from '../pages/ExchangeClassInsert.vue'
export default {
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
      tableSize: 'mini',
      tableData: [],
      titles: [
        // { label: 'ID', prop: '_id' },
        { label: 'Date', prop: 'classDate' },
        { label: 'Room', prop: 'roomName' },
        { label: 'Teacher', prop: 'teacher' },
        { label: 'Subject', prop: 'subject' },
        { label: 'Time', prop: 'timeStudy' },
        { label: 'Type', prop: 'type' },
        { label: 'Status', prop: 'status' },
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
  methods: {
    handleModalClose() {
      // this.getData()
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
