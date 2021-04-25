<template>
  <div style="padding: 15px 30px">
    <!-- <el-input
      v-model="input"
      placeholder="请输入文件类型"
      clearable
      width="55"
    /> -->
    <el-select v-model="fileCategoryId" placeholder="请选择文件类型">
      <el-option
        v-for="item in fileTypeArr"
        :key="item.categoryId"
        :label="item.categoryName"
        :value="item.categoryName"
      />
    </el-select>
    <el-input
      v-model="fileName"
      placeholder="请输入文件名称"
      clearable
      width="55"
    />
    <!-- <span class="demonstration">默认</span> -->
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <el-button type="primary" icon="el-icon-search" style="margin-left: 10px"
      >搜索</el-button
    >
    <el-button size="small" type="primary" @click="upload">上传</el-button>
    <el-button size="small" type="primary" @click="downloadFile"
      >下载</el-button
    >
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="日期" sortable width="180" />
      <el-table-column prop="name" label="姓名" sortable width="180" />
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip
        :formatter="formatter"
      />
    </el-table>
    <div style="margin-top: 20px">
      <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])"
        >切换第二、第三行的选中状态</el-button
      > -->
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
    <!-- 改成弹框形式 -->
    <el-dialog title="上传文件" :visible.sync="dialogUploadVisible">
      <el-upload
        class="upload-demo"
        drag
        :action="actionUrl"
        :header="headers"
        :data="data"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
      },
      fileName: "", // 文件名称
      fileCategoryId: "", // 类别id
      // 文件类型列表
      fileTypeArr: [
        {
          categoryId: "1",
          categoryName: "1",
        },
        {
          categoryId: "2",
          categoryName: "2",
        },
        {
          categoryId: "3",
          categoryName: "3",
        },
      ],
      dialogUploadVisible: false,
      // 上传的地址 域名+接口
      actionUrl: "http://4bkyo0so3k.bjhttp.cn/upload",
      headers: {
        token: "",
      },
      data: {
        // files：  //上传的文件
        fileAbstract: "", // 文件的摘要
        fileCategoryId: this.fileCategoryId, // 文件类别
        fileVersion: "", // 文件版本v1.0
      },
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      multipleSelection: [],
      value1: "",
    };
  },

  methods: {
    // 获取文件列表
    getfileList() {
      const params = {
        pageSize: this.pageInfo.pageSize,
        pageIndex: this.pageInfo.pageIndex,
        fileCategoryId: "", // 类别id
        fileName: "", // 文件名称
        beginTime: "", // 开始时间
        endTime: "", // 结束时间
        fileAbstract: "", // 文件摘要
      };
      axios.post("/api/file/fileList", params).then((res) => {
        this.fileTypeArr = res.data;
      });
    },
    // 获取文件类型
    getFileType() {
      axios.post("/api/file/fileCategoryList").then((res) => {
        this.fileTypeArr = res.data;
      });
    },
    // 获取文件版本
    getFileBaseId() {
      // axios
      //   .post("/api/file/queryFileVersionList", {
      //     fileBaseId: this.fileCategoryId, // 确定用这个值是否正确？
      //   })
      //   .then((res) => {
      //     this.fileTypeArr = res.data;
      //   });
    },
    // 导入
    upload() {
      this.dialogUploadVisible = true;
    },
    downloadFile() {
      const params = {
        fileUrl: "", // 文档存储路径
        fileName: "", // 文档名字
      };
      axios.post("/api/download").then(() => {
        // this.xlsname = "name.xls";//下载的名字
        this.download(res.data, "name");
        console.log("下载成功");
      });
    },
    download(data, name) {
      if (!data) {
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", name);

      document.body.appendChild(link);
      link.click();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatter(row, column) {
      return row.address;
    },
  },
};
</script>
<style scoped>
.el-input {
  width: auto;
  margin-right: 10px;
}
</style>
