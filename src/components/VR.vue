<template>
  <div style="height: 100%;width: 100%">
    <!--<Pano source='https://imudin.github.io/vue-vr/assets/equirectangular.jpg' @on-load="onLoad"></Pano>-->
    <Pano :source=aSrc @on-load="onLoad"></Pano>
  </div>
</template>

<script>
  import { Pano } from 'vuejs-vr'
  export default {
    components: {
      Pano
    },
    name: "VR",
    data(){
      return{
        aSrc:'https://imudin.github.io/vue-vr/assets/equirectangular.jpg',
        bSrc:'./../assets/equirectangular.jpg',
        cSrc:'http://pdae2q9v2.bkt.clouddn.com/%E9%A3%8E%E6%99%AF.jpg'
      }
    },
    methods :{
      onLoad(){

      }
    },
    mounted(){

    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到学习页面
        that.$router.push('/Study/Cells')
      };
    }
  }
</script>

<style scoped>

</style>
