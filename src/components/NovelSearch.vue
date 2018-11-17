<template>
  <!--小说搜索-->
  <div class="book-search">
    <mt-header title="搜索小说">
      <router-link to="/Novel/NovelBookshelf" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="book-search-main">
      <el-row style="margin-top: 10px">
        <el-input
          style="width: 60%"
          placeholder="请输入内容"
          v-model="query">
        </el-input>
        <el-button type="primary">搜索</el-button>
      </el-row>
      <div class="search-book-result">
        <div class="result-detail">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: "NovelSearch",
    data(){
      return{
        query:'大王饶命'
      }
    },
    mounted(){
      let search=`/api/book/fuzzy-search?query=${this.query}&start=0&limit=20`;
      axios.get(search).then((res)=>{
        console.log(res.data.books);//打印查看得到的结果
      });
    }
  }
</script>

<style scoped>
  .book-search{
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .book-search-main{
    height: calc(100% - 40px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 40px;
  }
  .result-detail{
    width: calc(100% - 20px);
    height: 100px;
    padding: 5px 10px;
    background-color: black;
  }
</style>
