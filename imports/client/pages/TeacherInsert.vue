<template>
    <div>
        <el-dialog 
        title="New Teacher" 
        width="80%"  
        :visible="true" 
        :before-close="handleClose"
        >
        <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="100px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="First Name" prop="first">
                        <el-input v-model="form.first" ref="first" ></el-input>
                    </el-form-item>
                    <el-form-item label="Last Name" prop="last">
                        <el-input v-model="form.last" ref="last" ></el-input>
                    </el-form-item>
                    <el-form-item label="Gender" prop="gender" ref="gender">
                    <el-radio-group v-model="form.gender">
                        <el-radio v-for="doc in genderOpt" :key="doc.value" :label="doc.label" :value="doc.value"></el-radio>
                    </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Date of Birth" prop="dob" >
                        <el-date-picker style="width:100%" v-model="form.dob" type="date"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Telephone" prop="tel">
                        <el-input v-model="form.tel"></el-input>
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
import { insertTeacher } from "../../api/Teachers/methods.js";

export default {
  name: "employeeInsert",
  props: ["visible"],
  data() {
    return {
      genderOpt: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" }
      ],
      form: {
        first: "",
        last: "",
        gender: "",
        dob: "",
        email: "",
        tel: ""
      },
      rules: {
        first: [
          {
            required: true,
            message: "Please Input First Name",
            trigger: "blur"
          }
        ],
        last: [
          { required: true, message: "Please Input Last Name", trigger: "blur" }
        ],
        gender:[
            {required:true}
        ],
        dob:[
            {required:true}
        ],
        email:[
            {required:true}
        ],
        tel:[
            {required:true}
        ],
      }
    };
  },
  methods: {
    handleSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          insertTeacher
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: "Save Successfull",
                type: "success"
              });
              this.handelresetForm();
            })
            .catch(err => {
              console.log(err.reason);
            });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("modal-close");
    },
    handelresetForm() {
      this.$refs["form"].resetFields();
    }
  }
};
</script>

<style>

</style>
