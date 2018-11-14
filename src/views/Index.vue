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
          <mt-cell title="还"></mt-cell>
          <mt-cell title="没"></mt-cell>
          <mt-cell title="想"></mt-cell>
          <mt-cell title="好"></mt-cell>
          <mt-cell title="写"></mt-cell>
          <mt-cell title="啥"></mt-cell>
        </div>
      </div>
      <!--主页内容-->
      <div class="content" slot="content">
        <div class="text">
          <index-main></index-main>
        </div>
      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
  import IndexMain from './../components/IndexMain'
  import './../assets/css/index.css'
  export default {
    name: "Index",
    components:{
      IndexMain
    },
    data(){
      return{

      }
    },
    watch:{

    },
    computed:{

    },
    methods: {
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
      }
    },
    created(){
      //console.log(this.drawer)
    }
  }
</script>

<style scoped>

</style>
