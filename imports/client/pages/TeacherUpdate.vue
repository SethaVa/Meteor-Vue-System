<template>
    <div>
        <el-dialog 
        title="Edit Teacher" 
        width="80%"  
        :visible="true" 
        :before-close="handleClose"
        >
        <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="150px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="First Name" prop="first">
                        <el-input v-model="form.first" ></el-input>
                    </el-form-item>
                    <el-form-item label="Last Name" prop="last">
                        <el-input v-model="form.last" ></el-input>
                    </el-form-item>
                    <el-form-item label="Gender" >
                    <el-select v-model="form.gender" placeholder="Please Gender">
                        <el-option label="Male" value="Male"></el-option>
                        <el-option label="Female" value="Female"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Date of Birth">
                        <el-date-picker v-model="form.dob" type="date"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Telephone">
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
import {findOneTeacher,updateTeacher} from '../../api/Teachers/methods.js';

export default {
  name: "TeacherInsert",
  props: ['updateId','visible'],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        first: "",
        last: "",
        gender: "",
        dob: "",
        email: '',
        tel: '',
      },
      rules:{
          first:[
              {required:true,message:'Please Input First Name',trigger:'blur'}
          ],
          last:[
              {required:true,message:'Please Input Last Name',trigger:'blur'}
          ]
      }
    };
  },
  mounted(){
      this.getData()
  },
  methods:{
      getData(){
          let _id = this.updateId;
          findOneTeacher.callPromise({selector:_id}).then(result=>{
              this.form = result
          }).catch(err=>{
              console.log(err.reason)
          })
      },
      handleSave(){
          this.$refs['form'].validate(valid=>{
              if(valid){
                  let doc = this.form
                  doc._id = this.updateId;
                  updateTeacher.callPromise(doc).then(result=>{
                      this.$message({
                          message:'Update Successfull',
                          type:'success'
                      })
                      this.handleClose();
                  }).catch(err=>{
                      console.log(err.reason)
                  })
              }else{
                  return false
              }
          })
      },
      handleClose(){
          this.$emit('modal-close');
      },
      resetForm(){
          this.$refs['from'].resetFields();
      }
  }
};
</script>

<style>

</style>
