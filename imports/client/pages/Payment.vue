<template>
  <div>
    <component :is="currentModal"
               :modal-doc="modalDoc"
               :visible="modalVisible"
               @modal-close="handleClose">
    </component>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             size="mini"
             label-position="left"
             label-width="50px">
      <el-row>
        <!-- <el-col :span="6"></el-col> -->
        <el-col :span="18">
          <el-form-item label="Class"
                        prop="classId">
            <el-select v-model="form.classId"
                       clearable
                       placeholder="Select Class">
              <el-option v-for="doc in classIdOpts"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value">
                <span style="float: left">{{ doc.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ doc.labelRight }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary"
                       @click="handleSubmit">Submit</el-button>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6"></el-col> -->
      </el-row>
    </el-form>
    <data-tables :data="dataTable"
                 :action-col-def="actionColDef"
                 :table-props="tableProps"
                 v-loading="loading">
      <el-table-column v-for="title in titles"
                       :key="title.prop"
                       :prop="title.prop"
                       :label="title.label"
                       :sortable="title.sort">
        <template slot-scope="scope">
          <span v-if="title.prop === 'payDate'">
            {{ formatDate(scope.row.payDate) }}
          </span>
          <span v-else-if="title.prop === 'endPayDate'">
            {{ formatDate(scope.row.endPayDate) }}
          </span>
          <span v-else>{{ scope.row[title.prop] }}</span>

        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import moment from 'moment'
import _ from 'lodash'
import { lookupClass } from '/imports/libs/lookup-methods'
import { findPaymentForClass } from '/imports/api/payment/methods'
import StudentPay from './StudentPay.vue'
export default {
  name: 'Payment',
  components: { StudentPay },
  data() {
    return {
      currentModal: null,
      modalVisible: false,
      modalDoc: null,
      loading: false,
      classIdOpts: [],
      classId: '',
      form: {
        classId: '',
      },
      rules: {
        classId: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
      },
      dataTable: [],
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      tableProps: {
        size: 'small',
      },
      actionColDef: {
        label: 'Action',
        def: [
          {
            type: 'primary',
            name: 'Pay',
            buttonProps: {
              size: 'mini',
            },
            handler: row => {
              this.modalDoc = row
              this.modalVisible = true
              this.currentModal = StudentPay
            },
          },
        ],
      },
    }
  },
  computed: {
    // 'form.classId'(val) {
    //   this.classId = val
    //   return this.classId
    // },
  },
  mounted() {
    this.getClassData()
  },
  methods: {
    getClassData() {
      lookupClass
        .callPromise({})
        .then(result => {
          this.classIdOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let selector = {
            classId: this.form.classId,
            status: { $in: ['Expire', '$classDetail'] },
          }
          this.loading = true
          findPaymentForClass
            .callPromise({ selector: selector })
            .then(result => {
              if (result.length > 0) {
                this.dataTable = []
                _.forEach(result[0].classDetail, o => {
                  this.dataTable = result[0].classDetail
                })
              } else {
                this.dataTable = []
              }
              this.loading = false
            })
            .catch(error => {
              Notify.error({ message: error.reason })
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.handleSubmit()
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
