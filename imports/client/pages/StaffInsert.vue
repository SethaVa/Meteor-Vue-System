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
                    <el-form-item label="Name" prop="name">
                        <el-input v-model="form.name" ref="name" ></el-input>
                    </el-form-item>
                    <el-form-item label="Gender" prop="gender" ref="gender">
                    <el-select v-model="form.gender">
                      <el-option
                        v-for="item in genderOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="Date of Birth" prop="dob" >
                        <el-date-picker style="width:100%" v-model="form.dob" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Telephone" prop="tel">
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="Position" prop="positionId">
                        <el-select v-model="form.positionId">
                          <el-option
                            v-for="doc in positionIdOpts"
                            :key="doc._id"
                            :label="doc.position"
                            :value="doc._id"
                          ></el-option>
                        </el-select>
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
import { insertStaff, findStaff } from "../../api/Staffs/methods.js";
import {findPosition} from '../../api/positions/methods';
import Lookup from '../libs/Lookup-Value.js';
const moment = require('moment');
export default {
  name: "employeeInsert",
  props: ["visible"],
  data() {
    return {
      genderOpts: Lookup.gender,
      positionIdOpts:[],
      form: {
        name: "",
        gender: "",
        dob: "",
        email: "",
        tel: "",
        positionId:''
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please Input Name",
            trigger: "blur"
          }
        ],
        positionId: [
          { required: true, message: "Please select Position", trigger: "change" }
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
  mounted(){
    this.getPositionData();
  },
  methods: {
    handleSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          insertStaff
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
    getPositionData(){
      let selector={
        status:'Active'
      }
      findPosition.callPromise({selector:selector}).then(result=>{
        this.positionIdOpts = result;
        console.log(result)
      }).catch(error=>{
        this.$message.error(error.reason)
      })
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
