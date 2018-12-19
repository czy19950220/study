<template>
  <!--首页-->
  <div class="index-con">
    <mt-header fixed title="首页">
      <mt-button slot="left" @click="handleToggleDrawer()">
        <img src="../assets/imgs/everyme.png" alt="" class="head-img">
      </mt-button>
    </mt-header>
    <vue-drawer-layout
      ref="drawerLayout"
      @slide-start="handleSlideStart"
      @slide-move="handleSlideMove"
      @slide-end="handleSlideEnd"
      @mask-click="handleMaskClick">
      <!--侧边栏内容-->
      <div class="drawer" slot="drawer">
        <div class="text">
          <div v-for="font in fonts" @click="changeFont(font.value)"><mt-cell :title="font.name"></mt-cell></div>
        </div>
      </div>
      <!--主页内容-->
      <div class="content" slot="content">
        <index-main></index-main>
      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
  import axios from 'axios';
  import IndexMain from './../components/IndexMain'
  import {mapGetters, mapActions} from 'vuex'
  import './../assets/css/index.css'
  export default {
    name: "Index",
    components:{
      IndexMain
    },
    data(){
      return{
        fonts:[{name:'汉仪细行楷',value:'HanYiXiXingKai'},{name:'方正喵呜',value:'FangZhengMiaoWu'},{name:'不设置',value:'unset'}]
      }
    },
    watch:{

    },
    computed:{

    },
    methods: {
      ...mapActions([
        'myFontFamilyChange'
      ]),
      //改变字体
      changeFont(font){
        this.myFontFamilyChange(font);
        //console.log(font);
        localStorage.setItem("fontFamily",font);//字体持久化
      },
      handleSlideStart() {
        //console.info('slide-start');
      },
      handleSlideMove(position) {
        //console.info('slide-move', position);
      },
      handleSlideEnd(visible) {
        //console.log(`'slide-end', ${visible}`);
      },
      handleMaskClick() {
        //console.info('mask-click');
        this.$refs.drawerLayout.toggle(false);
      },
      handleToggleDrawer() {
        this.$refs.drawerLayout.toggle();
      },
      //退出APP提示
      quitApp(){
        let that=this;
        var first = null;
        this.$mui.back=function(){
          if(!first){
            first = new Date().getTime();
            that.$mui.toast('再按一次退出应用');
            setTimeout(function(){
              first = null;
            },2000);
          } else {
            if(new Date().getTime() - first < 2000){
              plus.runtime.quit();
            }
          }
        };
      }
    },
    created(){
      this.quitApp();
    }
  }
</script>

<style scoped>

</style>
