<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New Income"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               size="mini"
               label-position="left"
               label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Date"
                          prop="tranDate">
              <el-date-picker v-model="form.tranDate"
                              style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Type"
                          prop="referenceType">
              <el-select v-model="form.referenceType"
                         clearable
                         placeholder="Select Type">
                <el-option v-for="doc in referenceTypeOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <sub-acc @save-form="saveForm"
                 :save-event="saveEvent"
                 :items-prop="itemsProp"
                 @sub-form-change="handleSubFormChange"></sub-acc>
        <el-row :gutter="50">
          <el-col :span="16">
            &nbsp;
          </el-col>
          <el-col :span="8">
            <div class="label-total">
              <label>Total USD : {{ formatNum(totalUsd) }} $</label><br><br>
              <label>Total KHR : {{ formatNum(totalKhr) }} ៛</label>
            </div>
          </el-col>
        </el-row>
        <!-- <el-form-item style="float: right">
          <el-button type="primary"
                     @click="saveEvent++">Save</el-button>
          <el-button @click="cancelForm">Cancel</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="saveEvent++"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import SubAcc from '../../components/SubAccounting.vue'
const numeral = require('numeral')
//=============================================================
import { insertIncome } from '../../api/Income/methods'
export default {
  name: 'IncomeInsert',
  components: { SubAcc },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      saveEvent: 0,
      referenceTypeOpts: [
        { label: 'Income', value: 'Income' },
        { label: 'Expend', value: 'Expend' },
      ],
      totalUsd: 0,
      totalKhr: 0,
      itemsProp: this.initItems(),
      items: [],
      form: {
        tranDate: moment().toDate(),
        referenceType: '',
        totalUsd: 0,
        totalKhr: 0,
      },
      rules: {
        tranDate: { required: true },
        referenceType: { required: true },
      },
    }
  },
  methods: {
    initItems() {
      return [
        {
          name: '',
          usd: 0,
          khr: 0,
        },
      ]
    },
    handleSubFormChange(item) {
      let totalKHR = 0,
        totalUSD = 0
      _.forEach(item, o => {
        totalKHR += o.khr
        totalUSD += o.usd
      })
      this.totalUsd = totalUSD
      this.form.totalUsd = totalUSD
      this.totalKhr = totalKHR
      this.form.totalKhr = totalKHR

      this.items = item
    },
    saveForm(childValid) {
      this.$refs['form'].validate(valid => {
        if (valid && childValid) {
          this.form.tranDate = wrapCurrentTime(this.form.tranDate)
          insertIncome
            .callPromise({ doc: this.form, details: this.items })
            .then(result => {
              Msg.success()
              this.cancelForm()
            })
            .catch(error => {
              Notify.error({ message: error })
            })
        } else {
          return false
        }
      })
    },
    cancelForm() {
      this.$refs['form'].resetFields()
      this.itemsProp = this.initItems()
    },
    handleClose() {
      this.$emit('modal-close')
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
    },
    formatNum(val) {
      return numeral(val).format('0,0.00')
    },
  },
}
</script>

<style lang="scss">
.label-total {
  margin-top: 3vh;
  font-size: 14px;
  color: gray;
  margin-bottom: 3vh;
}
</style>
