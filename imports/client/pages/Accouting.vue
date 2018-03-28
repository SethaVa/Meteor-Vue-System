<template>
  <div>
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
      <el-form-item style="float: right">
        <el-button type="primary"
                   @click="saveEvent++">Save</el-button>
        <el-button @click="cancelForm">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import SubAcc from '../../components/SubAccounting.vue'
const numeral = require('numeral')
export default {
  name: 'Acc',
  components: { SubAcc },
  data() {
    return {
      saveEvent: 0,
      referenceTypeOpts: [
        { label: 'Income', value: 'Income' },
        { label: 'Expence', value: 'Expence' },
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
          details: '',
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
          console.log(this.form, this.items)
          this.cancelForm()
        } else {
          return false
        }
      })
    },
    cancelForm() {
      this.$refs['form'].resetFields()
      this.itemsProp = this.initItems()
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
