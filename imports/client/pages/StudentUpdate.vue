<template>
  <div>
      <el-form label-position="left" :model="form" ref="form" :rules="rules">
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="First Name" prop="first" >
                    <el-input v-model="form.first"></el-input>
                </el-form-item>
                <el-form-item label="Last Name" prop="last" >
                    <el-input v-model="form.last"></el-input>
                </el-form-item>
                <el-form-item label="Gender" prop="gender" >
                    <el-input v-model="form.gender"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <div class="right">
                    <el-form-item label="DOB" prop="dob" >
                        <el-date-picker v-model="form.dob"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="Telephone" prop="tel" >
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSave" >Save</el-button>
                        <el-button type="primary" @click="handleCancel">Cancel</el-button>
                    </el-form-item>
                  </div>
              </el-col>
          </el-row>
      </el-form>
  </div>
</template>

<script>
import _ from "lodash";
import { updateStudent, findOneStudent } from "../../api/students/methods.js";

export default {
  name: "studentUpdate",
  props:['updateId','visible'],
  data() {
    return {
      form: {
        first: "",
        last: "",
        gender: "",
        dob: "",
        tel: ""
      },
      rules: {
        first: [
          {
            required: true,
            message: "Please Insert First Name",
            trigger: "blur"
          }
        ],
        last: [
          {
            required: true,
            message: "Please Insert Last Name",
            trigger: "blur"
          }
        ],
        gender: [
          { required: true, message: "Please Insert Gender", trigger: "blur" },
          { max: 5, min: 1 }
        ],
        tel: [
          {
            required: true,
            message: "Please Insert Telephone",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let _id = this.$route.params._id;
      findOneStudent
        .callPromise({})
        .then(result => {
          this.form = result;
          this.form.first = result.name.first;
          this.form.last = result.name.last;
          console.log(result.name.last);
        })
        .catch(err => {
          console.log(err.reason);
        });
    },
    handleSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let doc = {
            name: {
              first: this.form.first,
              last: this.form.last
            },
            gender: this.form.gender,
            dob: this.form.dob,
            tel: this.form.tel
          };
          console.log(doc);
          updateStudent
            .callPromise(doc)
            .then(result => {
              this.$message({
                message: "Insert Successfull",
                type: "success"
              });
              //   this.resetForm()
            })
            .catch(error => {
              console.log(error.reason);
            });
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$router.push({ name: "student" });
    },
    resetForm() {
      this.$refs["form"].resetFileds();
    }
  }
};
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
