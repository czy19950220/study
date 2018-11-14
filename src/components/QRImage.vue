<template>
  <div style="margin-top: 42px">
    <el-input v-model="QRValue" style="width: 70%;margin-left: 15%"></el-input>
    <br/>
    <br/>
    <qriously style="margin: auto;text-align: center;" :value="QRValue" :size="200" />
  </div>
</template>

<script>
  export default {
    name: "QRImage",
    data(){
      return{
        QRValue:'I love you!'
      }
    }
  }
</script>

<style scoped>

</style>
