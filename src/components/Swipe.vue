<template>
  <!--轮播图-->
  <div style="height: 100%;width: 100%">
    <mt-swipe :auto="4000" class="swipe-index" >
      <mt-swipe-item v-for="img in imgs" :key="img.index">
        <img class="swipe-index-img" :src="img.src" :alt="img.alt" :key="img.index">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
  export default {
    name: "Swipe",
    data(){
      return{
        imgs:[
          {src:"http://pdae2q9v2.bkt.clouddn.com/%E9%A3%8E%E6%99%AF.jpg",alt:"风景",index:0},
          {src:"http://pdae2q9v2.bkt.clouddn.com/%E9%A3%8E%E6%99%AF.jpg",alt:"风景",index:1},
          {src:"http://pdae2q9v2.bkt.clouddn.com/%E7%8E%B2%E7%8E%B2.png",alt:"玲玲",index:2}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
