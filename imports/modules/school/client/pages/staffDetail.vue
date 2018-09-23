<template>
  <el-dialog :close-on-click-modal="false" title="Staff Detail"
             width="80%"
             :before-close="handleClose"
             :visible="visible">
    <b>
      <el-row :gutter="10">
        <el-col :span="8">
          <label>
            Name : {{ name }}
          </label>
        </el-col>
        <el-col :span="8">
          <span>Email : {{ email }}</span>
        </el-col>
        <el-col :span="8">
          <span>Telephone : {{ tel }}</span>
        </el-col>
      </el-row>
    </b>
    <el-table v-loading="loading"
              :data="tableData">
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
  </el-dialog :close-on-click-modal="false">
</template>

<script>
import { findOneStaffDetails } from '/imports/modules/school/api/Staffs/methods'
import moment from 'moment'

export default {
  name:'StaffDetails',
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
      loading: false,
      name: '',
      email: '',
      tel: '',
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
      this.loading = true
      findOneStaffDetails
        .callPromise({ selector })
        .then(result => {
          this.loading = false
          this.name = result[0].name
          this.email = result[0].email
          this.tel = result[0].tel
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
