<template>
  <el-dialog title="Staff Detail"
             width="80%"
             :before-close="handleClose"
             :visible="visible">
    <span>Name : {{ name }}</span>
    <el-table :data="tableData">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       sortable="custom">
        <template slot-scope="scope">
          <span v-if="title.prop === 'time'">
            {{ formatTime(scope.row.time) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { findOneStaffDetails } from '../../api/Staffs/methods'
import moment from 'moment'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    updateId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      name: '',
      tableData: [],
      titles: [
        { label: 'Rome', prop: 'room' },
        { label: 'Time', prop: 'time' },
        { label: 'Subject', prop: 'subject' },
        { label: 'Type', prop: 'type' },
      ],
    }
  },
  mounted() {
    this.getOneStaff()
  },
  methods: {
    getOneStaff() {
      let selector = {
        staffId: this.updateId,
      }
      findOneStaffDetails
        .callPromise({ selector })
        .then(result => {
          this.name = result[0].name
          this.tableData = result[0].teacherDetail
        })
        .catch(err => {
          console.log(err.reason)
        })
    },
    handleClose() {
      this.$emit('modal-close')
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
