<template>
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
    name: "Entertainment",
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
          this.title='娱乐';
          this.showBack=false;
          $(".summary-index").removeClass("summary-index-new");
        }
      },
      quit(){
        let that=this;
        this.$mui.back = function() {
          var btn = ["确定", "取消"];
          that.$mui.confirm('确认关闭当前窗口？', 'Hello MUI', btn, function(e) {
            if(e.index == 0) {
              plus.runtime.quit();
            }
          });
        };
      }
    },
    mounted(){
      this.titleOfPath(this.$route.path.toLowerCase());
      //console.log(this.$route.path.toLowerCase());
      this.quit();
    },
  }
</script>

<style scoped>

</style>
