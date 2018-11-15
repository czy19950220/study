<template>
  <!--首页主页内容-->
  <div style="position: relative">
    <!--首页内容页-->
    <div v-model="selected" class="index-container" >
      <router-view></router-view>
    </div>
    <!--首页底部导航-->
    <div><bottom-tabbar></bottom-tabbar></div>
  </div>
</template>

<script>
  import BottomTabbar from './../components/BottomTabbar'
  export default {
    components:{
      BottomTabbar
    },
    name: "IndexMain",
    data() {
      return {
        selected: '首页',
      }
    },
    computed: {},
    methods: {

    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
