<template>
  <div style="margin-top: 42px;height: calc(100% - 42px);overflow-y: scroll">
    <!--vue-qriously的动态二维码生成，不支持中文，不需要自己再写方法实现动态二维码-->
    <el-input v-model="QRValue" style="width: 70%;margin-left: 15%" placeholder="不支持输入中文">
    </el-input>
    <br/>
    <br/>
    <qriously style="margin: auto;text-align: center;" :value="QRValue" :size="200" />
    <br/>
    <!--qrcodejs2的动态二维码生成，支持中文，需要自己添加一些方法来实现动态生成二维码-->
    <el-input v-model="QRValue2" placeholder="支持输入中文" style="width: 70%;margin-left: 15%" @keyup.native="qrcode()">
    </el-input>
    <br/>
    <br/>
    <div id="qrcode" ref="qrcode"></div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  export default {
    name: "QRImage",
    data(){
      return{
        QRValue:'I love you!',
        QRValue2:'我爱你'
      }
    },
    methods:{
      qrcode () {
        $("#qrcode").empty();//先清空原来的canvas画布
        //再设置最新的画布
        let qrcode = new QRCode('qrcode',{
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: this.QRValue2  // 设置二维码内容或跳转地址
        });
      },
    },
    created(){
      //加载默认值
      this.$nextTick(() => {
        this.qrcode()
      });
      let that=this;
      this.$mui.back = function() {//从书架返回到学习页面
        that.$router.push('/Study/Cells')
      };
    }
  }
</script>

<style scoped>
#qrcode{
  margin: auto;
  text-align: center;
  width: 200px;
  margin-bottom: 20px;
}
</style>
