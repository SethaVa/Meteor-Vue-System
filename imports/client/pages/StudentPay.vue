<template>
  <el-dialog title="Student Payment"
             :visible="visible"
             :before-close="handleClose">
    <sub-payment></sub-payment>
    <span slot="footer"
          class="dialog-footer">

      <el-button type="primary"
                 @click="handleSave">Save</el-button>
      <el-button @click="handleClose">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SubPayment from '/imports/client/components/subPayment.vue'
export default {
  name: 'SubPayment',
  components: { SubPayment },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSave() {},
    handleClose() {
      this.$emit('modal-close')
    },
  },
}
</script>

<style>

</style>
