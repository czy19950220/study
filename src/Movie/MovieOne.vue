<template>
    <div id="movie">
      <iframe style="border: none;" src="https://lirongyao.com/api/index.php" width="100%" height="100%"></iframe>
    </div>
</template>

<script>
    export default {
      name: "MovieOne",
      created(){
        let that=this;
        this.$mui.back = ()=> {//从书架返回到娱乐页面
          this.$router.push('/Entertainment/EntertainmentCells');
        };
      }
    }
</script>

<style scoped>
#movie{
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
