<template>
  <div class="novel-bookshelf">
    <mt-header title="我的书架">
      <router-link to="/Entertainment/EntertainmentCells" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="search" slot="right" @click="toSearch()" class="novel-search"></mt-button>
    </mt-header>
    <div class="novel-bookshelf-main">

    </div>
  </div>
</template>

<script>
  export default {
    name: "NovelBookshelf",
    methods:{
      more(){
        console.log(1)
      },
      toSearch(){
        /*/Novel/NovelSearch*/
        this.$router.push('/Novel/NovelSearch')
      }
    }
  }
</script>

<style scoped lang="less">
  @width-height:100%;
  @margin:10px;
  @color:#f8f8f8;
  .novel-bookshelf{
    height: @width-height;
    width: @width-height;
    overflow: hidden;
    background-color: @color;
  }
  .novel-search{
    padding: 0px @margin;
  }
  .novel-bookshelf-main{
    height: calc(100% - 40px);
    margin-top: 40px;
    width: @width-height;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
