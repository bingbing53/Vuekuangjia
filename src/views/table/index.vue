<template>
  <div class="" style="padding: 15px 30px">
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      class="table-form"
    >
      <el-form-item label="旧密码：">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="formLabelAlign.region"></el-input>
      </el-form-item>
      <el-form-item label="重复密码：">
        <el-input v-model="formLabelAlign.region"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="table-row">
      <el-button type="danger" plain>重置</el-button>
      <el-button type="primary" plain>确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { getList } from "@/api/table";

export default {
  data() {
    return {
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
    };
  },
  created() {},
  methods: {},
};
</script>
<style scoped>
.table-form {
  width: 50%;
  margin: 20px auto 0;
}
.table-row {
  margin: auto;
  text-align: center;
}
</style>
