<template>
  <div>
    <el-form
      v-loading="loading"
      ref="form"
      :model="form"
      label-width="170px"
    >
      <div class="tab-title">Info</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :rules="rules.name"
            label="Name"
            prop="name"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item
            :rules="rules.address"
            label="Address"
            prop="address"
          >
            <el-input
              v-model="form.address"
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item
            :rules="rules.telephone"
            label="Telephone"
            prop="telephone"
          >
            <el-input v-model="form.telephone"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :rules="rules.email"
            label="Email"
            prop="email"
          >
            <el-input v-model="form.email"></el-input>
          </el-form-item>

          <el-form-item
            :rules="rules.website"
            label="Website"
            prop="website"
          >
            <el-input v-model="form.website"></el-input>
          </el-form-item>

          <el-form-item
            :rules="rules.industry"
            label="Industry"
            prop="industry"
          >
            <el-select
              v-model="form.industry"
              placeholder="Industry"
              style="width: 100%"
            >
              <el-option
                v-for="item in industryOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="tab-title">Setting</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :rules="rules.baseCurrency"
            label="Base currency"
            prop="setting.baseCurrency"
          >
            <el-select
              v-model="form.setting.baseCurrency"
              placeholder="Base currency"
              style="width: 100%"
            >
              <el-option
                v-for="item in currencyOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="rules.decimalNumber"
            label="Decimal number"
            prop="setting.decimalNumber"
          >
            <el-input-number v-model="form.setting.decimalNumber"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :rules="rules.dateFormat"
            label="Date format"
            prop="setting.dateFormat"
          >
            <el-input
              v-model="form.setting.dateFormat"
              readonly
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :rules="rules.accountingIntegration"
            label="Accounting integration"
            prop="setting.accountingIntegration"
          >
            <el-switch v-model="form.setting.accountingIntegration"></el-switch>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :rules="rules.lang"
            label="Language"
            prop="setting.lang"
          >
            <el-radio-group v-model="form.setting.lang">
              <el-radio
                v-for="item in langOpts"
                :key="item.value"
                :label="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>

          <!--Submit Form-->
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm"
            >
              Save
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import { findOneCompany, updateCompany } from '../../api/company/methods'
import LookupValue from '../lib/Lookup-Value'

export default {
  name: 'Company',
  data() {
    return {
      loading: false,
      industryOpts: LookupValue.industry,
      currencyOpts: LookupValue.currency,
      dateFormatOpts: LookupValue.dateFormat,
      langOpts: LookupValue.lang,
      form: {
        name: '',
        address: '',
        telephone: '',
        email: '',
        website: '',
        industry: '',
        setting: {
          baseCurrency: 'USD',
          decimalNumber: 2,
          accountingIntegration: true,
          dateFormat: 'dd/MM/yyyy',
          lang: 'EN',
        },
      },
      rules: {
        name: [{ required: true, message: 'Name is required' }],
        address: [{ required: true, message: 'Address is required' }],
        telephone: [{ required: true, message: 'Telephone is required' }],
        industry: [{ required: true, message: 'Industry is required' }],
        baseCurrency: [
          { required: true, message: 'Base currency date is required' },
        ],
        decimalNumber: [
          { required: true, message: 'Decimal number date is required' },
        ],
        dateFormat: [
          { required: true, message: 'Date format date is required' },
        ],
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      findOneCompany
        .callPromise()
        .then(result => {
          this.form = result
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          Notify.error({ message: error })
        })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          updateCompany
            .callPromise(this.form)
            .then(result => {
              if (result) {
                this.loading = false
                Msg.success()
              }
            })
            .catch(error => {
              this.loading = false
              Notify.error({ message: error })
            })
        } else {
          Msg.error('Please check any tabs')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-title {
  font-size: 18px;
  font-weight: 400;
  color: #1f2f3d;
  margin-bottom: 15px;
}
</style>
