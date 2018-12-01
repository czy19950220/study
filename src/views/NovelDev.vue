<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: "NovelDev",
    created(){
      let czyBooks=localStorage.getItem("czyBooks");
      if (czyBooks==null || czyBooks=='' || czyBooks==undefined){
        let czyBooks={"books":[],"fontSize":18};
        czyBooks=JSON.stringify(czyBooks);
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
      }
      //localStorage.removeItem("czyBooks")//清除
    }
  }
</script>

<style scoped>

</style>
