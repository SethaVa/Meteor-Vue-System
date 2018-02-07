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
                    <el-form-item label="Position" prop="position">
                        <el-input v-model="form.position" ref="first" >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Status" prop="status">
                        <el-select v-model="form.status">
                            <el-option
                                    v-for="item in statusOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Description" prop="des">
                        <el-input type="textarea" :autosize="{minRows:3,maxRows:5}" v-model="form.des" ></el-input>
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
import {findOnePosition,updatePosition} from '../../api/positions/methods.js';
import lookupValue from '../../client/libs/Lookup-Value';
export default {
  name: "PositionUpdate",
  props: ['updateId','visible'],
  data() {
    return {
      dialogFormVisible: false,
        statusOpts:lookupValue.status,
      form: {},
      rules:{
          position:[
              {required:true,message:'Please Input First Name',trigger:'blur'}
          ],
      }
    };
  },
  mounted(){
      this.getData()
  },
  methods:{
      getData(){
          let _id = this.updateId;
          findOnePosition.callPromise({selector:_id}).then(result=>{
              this.form = result
              console.log(result)
          }).catch(err=>{
              console.log(err.reason)
          })
      },
      handleSave(){
          this.$refs['form'].validate(valid=>{
              if(valid){
                  let doc = this.form
                  doc._id = this.updateId;
                  updatePosition.callPromise(doc).then(result=>{
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
