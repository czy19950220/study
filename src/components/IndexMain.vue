<template>
  <!--首页主页内容-->
  <div style="position: relative">
    <!--首页内容页-->
    <div v-model="selected" class="index-container">
      <router-view></router-view>
    </div>
    <!--首页底部导航-->
    <div>
      <bottom-tabbar></bottom-tabbar>
    </div>
  </div>
</template>

<script>
  import BottomTabbar from './../components/BottomTabbar'

  export default {
    components: {
      BottomTabbar
    },
    name: "IndexMain",
    data() {
      return {
        selected: '首页',
      }
    },
    computed: {},
    methods: {},
    mounted(){

    },
    created() {
      let that=this;
      this.$mui.ajax({
        url : 'http://www.apporapp.cc/book/169753/8820058.html',
        data: {},
        async: true,
        dataType:'json',//服务器返回json格式数据
        crossDomain: true, //强制使用5+跨域
        type:'get',//HTTP请求类型
        timeout:10000,//超时时间设置为10秒；
        scriptCharset:'utf-8',
        headers:{'Content-Type':'application/json'},
        success:function(data){
          that.$mui.toast('请求成功');
        },
        error:function(xhr,type,errorThrown){
        //异常处理；
          console.log(type);
          that.$mui.toast('请求失败');
        }
      });
    }
  }
</script>

<style scoped>

</style>
