<template>
  <div>
    <el-dialog title="New Class"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               size="mini"
               label-position="left"
               label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Date"
                          prop="classDate">
              <el-date-picker v-model="form.classDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="Room"
                          prop="roomId">
              <el-select v-model="form.roomId">
                <el-option v-for="item in roomIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Time"
                          prop="timeId">
              <el-select v-model="form.timeId">
                <el-option v-for="item in timeIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Teacher"
                          prop="teacherId">
              <el-select v-model="form.teacherId">
                <el-option v-for="item in teacherIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Subject"
                          prop="subId">
              <el-select v-model="form.subId">
                <el-option v-for="item in subIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Type"
                          prop="typeId">
              <el-select v-model="form.typeId">
                <el-option v-for="item in typeIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status"
                          prop="status">
              <el-select v-model="form.status">
                <el-option v-for="item in statusOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { insertPosition } from '../../api/positions/methods'
import lookupValue from '../../client/libs/Lookup-Value'
import moment from 'moment'
export default {
  name: 'ClassStudyInsert',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusOpts: lookupValue.status,
      roomIdOpts: [],
      timeIdOpts: [],
      teacherIdOpts: [],
      subIdOpts: [],
      typeIdOpts: [],
      form: {
        classDate: moment().toDate(),
        roomId: '',
        timeId: '',
        teacherId: '',
        subId: '',
        type: '',
        status: '',
      },
      rules: {
        classDate: [
          {
            required: true,
            message: 'Please Input First Name',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertPosition
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: 'Save Successfull',
                type: 'success',
              })
              this.handleresetForm()
            })
            .catch(err => {
              this.$message.error(err.reason)
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

 <style lang="scss">
.el-date-picker {
  width: 100%;
}
</style>
