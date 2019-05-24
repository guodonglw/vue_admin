<template>
  <el-button :loading="downloadLoading" style="margin-left: 20px" type="primary" icon="document" @click="handleDownload">
    导出为Zip
  </el-button>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        required:true
      }
    },
    data() {
      return {
        name: "exportZip",
        downloadLoading: false,
        datamiddle: this.data
      }
    },

    methods: {
      handleDownload() {
        this.downloadLoading = true;
        import('@/vendor/Export2Zip').then(zip => {
          const tHeader = ['Id', 'Name', 'Email'];
          const filterVal = ['id', 'name', 'email'];
          const list = this.data;
          const data = this.formatJson(filterVal, list);
          zip.export_txt_to_zip(tHeader, data, this.filename, this.filename)
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }


  }
</script>

<style scoped>

</style>
