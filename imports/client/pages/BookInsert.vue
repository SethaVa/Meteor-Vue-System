<template>
  <div>
      <el-dialog 
        width="70%"
        title="New Book"
        :visible="true"
        :before-close ="handleClose"
      >
        <el-form :model="form" ref="form" :rules="rules" label-position="left" label-width="100px">
            <el-form-item label="Code" prop="code">
                <el-input v-model="form.code" ref="code"></el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
                <el-input v-model="form.title" ref="title"></el-input>
            </el-form-item>
            <el-form-item label="Type" prop="bookType">
                <el-select v-model="form.bookType">
                    <el-option v-for="doc in bookTypeOpts" :key="doc.value" :label="doc.lable" :value="doc.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">Save</el-button>
            <el-button  @click="handleClose">Cancel</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import {insertBook} from '../../api/books/methods.js';
export default {
  name: "book-new",
  data() {
    return {
      bookTypeOpts: [
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" }
      ],
      form: {
        code: "",
        title: "",
        bookType: ""
      },
      rules: {
        code: [{ required: true }],
        title: [{ required: true }],
        bookType: [{ required: true }]
      }
    };
  },
  methods: {
    handleSave() {
        this.$refs['form'].validate(valid=>{
            if(valid){
                insertBook.callPromise(this.form).then(result=>{
                    this.$message({
                        message:"Save Success",
                        type:'success'
                    })
                    this.resetform();
                }).catch(error=>{
                    this.$message(error.reason)
                })
            }else{
                return false
            }
        })
    },
    handleClose() {
      this.$emit("modal-close");
    },
    resetform(){
        this.$refs['form'].resetFields();
    }
  }
};
</script>

<style>
.el-select{
    width: 100%;
}
</style>
