<template>
  <div>
      <el-dialog
        title="New Type"  
        :visible="true" 
        :before-close="handleClose"
      >
      <el-form label-position="left" label-width="150px" :model="form" ref="form" :rules="rules">
          <el-row >
              <el-col :span="24">
                <el-form-item label=Type prop="type" >
                    <el-input v-model="form.type" ref="type"></el-input>
                </el-form-item>
                <el-form-item label="Describe" prop="des" >
                    <el-input type="textarea" :autosize="{minRows:4,maxRows:5}" v-model="form.des" ref="type"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button  @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { insertType } from "../../api/types/methods.js";

export default {
  name: "New-Type",
  props: ["visible"],
  data() {
    return {
      genderOpt: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" }
      ],
      form: {
        type: "",
        des: "",
        status: "Active"
      },
      rules: {
        type: {
          required: true
        }
      }
    };
  },
  methods: {
    handleSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          insertType
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: "Insert Successfull",
                type: "success"
              });
              this.resetForm();
            })
            .catch(error => {
              console.log(error.reason);
            });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("modal-close");
    },
    resetForm() {
      this.$refs["form"].resetFields();
    }
  }
};
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
