<template>
  <!--总结过的一些东西-->
  <div class="container-my">
    <mt-header :title="title">
      <router-link to="/Summary" slot="left" v-if="showBack">
        <mt-button icon="back" class="mui-action-back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="summary-index"><router-view></router-view></div>
    <div v-show="!showBack"><bottom-tabbar></bottom-tabbar></div>
  </div>
</template>

<script>
  import BottomTabbar from './../components/BottomTabbar'
  export default {
    components:{
      BottomTabbar
    },
    name: "Summary",
    data(){
      return{
        title:'总结',
        showBack:false,
      }
    },
    watch:{
      $route(to,from){
        //console.log(to.path);
        let toPath=to.path.toLowerCase();
        this.titleOfPath(toPath);
      }
    },
    methods:{
      titleOfPath(path){
        $(".summary-index").addClass("summary-index-new");
        this.showBack=true;
        //console.log(path)
        if (path.indexOf('summaryhtmlquestion') >= 0) {
          this.title='HTML的一些问题总结'
        }else if (path.indexOf('summaryjsquestion') >= 0) {
          this.title='JS的一些问题总结'
        } else {
          this.title='总结';
          this.showBack=false;
          $(".summary-index").removeClass("summary-index-new");
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
      //console.log(this.$route.path.toLowerCase());
      this.quitApp();
    },

  }
</script>

<style scoped>

</style>

