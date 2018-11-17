<template>
  <!--底部导航.-->
  <mt-tabbar style="position: fixed;left: 0px;bottom: 0px;">
    <div @click="toWhere('/')" style="flex: 1" class="menu-click-my div-menu">
      <mt-tab-item id="首页">
        <img slot="icon" src="../assets/imgs/home.png">
        首页
      </mt-tab-item>
    </div>
    <div @click="toWhere('/Study/Cells')" style="flex: 1" class="div-menu">
      <mt-tab-item id="学习">
        <img slot="icon" src="../assets/imgs/books.png">
        学习
      </mt-tab-item>
    </div>
    <div style="flex: 1" class="div-menu" @click="toWhere('/Summary/SummaryCells')">
      <mt-tab-item id="总结">
        <img slot="icon" src="../assets/imgs/summary.png">
        总结
      </mt-tab-item>
    </div>
    <div style="flex: 1" class="div-menu" @click="toWhere('/Entertainment/EntertainmentCells')">
      <mt-tab-item id="娱乐">
        <img slot="icon" src="../assets/imgs/everyme.png">
        娱乐
      </mt-tab-item>
    </div>
  </mt-tabbar>
</template>

<script>
  export default {
    name: "BottomTabbar",
    watch:{
      $route(to,from){
        //console.log(to.path);
        if (to.path.indexOf('Study') >= 0) {
          //console.log(1);
          $(".div-menu").eq(1).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        }
      }
    },
    methods: {
      //设置跳转路由
      toWhere(where) {
        this.$router.push(where)
        //console.log(where)
      },
      //添加底部导航点击事件
      addClass() {
        $(".div-menu").click(function () {
          //改变选中时候的选项框的样式，移除其他几个选项的样式
          $(this).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        });
      },
      selectMenu(path){
        let thePath=this.$route.path.toLocaleLowerCase();
        if (thePath.indexOf('study') >= 0){
          $(".div-menu").eq(1).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        }else if (thePath.indexOf('summary') >= 0){
          $(".div-menu").eq(2).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        }else if (thePath.indexOf('entertainment') >= 0){
          $(".div-menu").eq(3).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        }else {
          $(".div-menu").eq(0).addClass("menu-click-my").siblings().removeClass("menu-click-my");
        }
      }
    },
    mounted() {
      this.addClass();
      this.selectMenu('Study',1);
      console.log(this.$route.path)
    }
  }
</script>

<style scoped>
  .div-menu a{
    color: #2c3e50;
  }
  .menu-click-my{
    background-color: #eaeaea;
    color: #26a2ff;
  }
  .menu-click-my a{
    color: #26a2ff ;
  }
</style>
