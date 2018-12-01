<template>
  <!--学习过的一些东西-->
  <div class="container-my">
    <mt-header :title="title">
      <router-link to="/Study" slot="left" v-show="showBack">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <router-view></router-view>
    <div v-show="!showBack"><bottom-tabbar></bottom-tabbar></div>
  </div>
</template>

<script>
  import BottomTabbar from './../components/BottomTabbar'
  export default {
    components:{
      BottomTabbar
    },
    name: "Study",
    data(){
      return{
        title:'学习',
        showBack:false
      }
    },
    watch:{
      $route(to,from){
        //console.log(to.path);
        let toPath=to.path.toLowerCase();
        this.titleOfPath(toPath)
      }
    },
    methods:{
      titleOfPath(path){
        this.showBack=true;
        if (path.indexOf('pulldown') >= 0) {
          this.title='下拉刷新'
        }else if (path.indexOf('pullup') >= 0) {
          this.title='上拉刷新'
        }else if (path.indexOf('canvasball') >= 0) {
          this.title='小球'
        }else if (path.indexOf('canvasflappybirdes6') >= 0) {
          this.title='FlappyBird'
        }else if (path.indexOf('vr') >= 0) {
          this.title='VR风景图'
        }else if (path.indexOf('qrimage') >= 0) {
          this.title='动态二维码（中文不支持）'
        } else {
          this.title='学习';
          this.showBack=false;
        }
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
    mounted(){
      this.titleOfPath(this.$route.path.toLowerCase());
      let that=this;
      this.quitApp();
      /*this.$mui.back = function() {
        var btn = ["确定", "取消"];
        that.$mui.confirm('确认关闭APP？', '提示', btn, function(e) {
          if(e.index == 0) {
            plus.runtime.quit();
          }
        });
      };*/

    },
    created(){

    }
  }
</script>

<style scoped>

</style>
