<template>
  <!--小说搜索-->
  <div class="book-search">
    <mt-header title="搜索小说">
      <router-link to="/NovelDev/NovelBookshelfDev" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="book-search-main">
      <el-row style="margin-top: 10px">
        <el-input
          @keyup.enter.native="getSearch"
          style="width: 60%"
          placeholder="请输入内容"
          v-model="query">
        </el-input>
        <el-button type="primary" @click="getSearch()">搜索</el-button>
      </el-row>
      <div class="search-book-result">
        <div class="result-detail" v-for="result in searchResult" @click="toBook(result)">
          <img :src="result.cover" :alt="result.title" class="book-result-img">
          <div class="book-title">{{result.title}}</div>
          <div class="book-shortIntro">{{result.shortIntro}}</div>
          <div class="author-and-cat">
            <span class="mui-icon mui-icon mui-icon-contact"></span>
            {{result.author}}
            <mt-badge size="small">{{result.cat}}</mt-badge>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import { Toast } from 'mint-ui';
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "NovelSearchDev",
    data() {
      return {
        query: '大王',
        searchResult: [],
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail'
      ]),
    },
    methods: {
      ...mapActions([
        'bookDetailChange'
      ]),
      //转化封面url为实际url
      url2Real(url) {
        if (url.search(/agent/i) === -1) {
          return 'http://api.zhuishushenqi.com' + url;
        }
        else {
          return decodeURIComponent(url.replace(/\/agent\//, ''));
        }
      },
      getSearch() {//dev运行的方法
        let search = `/api/book/fuzzy-search?query=${this.query}&start=0&limit=20`;
        axios.get(search).then((res) => {
          //console.log(search)
          //console.log(res.data.books);//打印查看得到的结果
          let bookList = res.data.books;
          if (bookList.length == 0) {
            let instance = Toast('没找到');
            setTimeout(() => {
              instance.close();
            }, 2000);
          } else {
            bookList.map((item) => {
              //图片比例140:200
              item.cover = item.cover ? this.url2Real(item.cover) : '../assets/imgs/err.png';
              item.shortIntro = item.shortIntro.length > 30 ? item.shortIntro.substr(0, 30) + "....." : item.shortIntro;
            });
            console.log(bookList)
            this.searchResult = res.data.books;
          }

        });
      },
      toBook(result) {
        this.bookDetailChange(result._id)
        this.$router.push('/NovelDev/NovelDetailDev')
      }
    },
    mounted() {
      this.getSearch();
      //console.log(this.bookDetail)
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到娱乐页面
        that.$router.push('/NovelDev/NovelBookshelfDev')
      };
    }
  }
</script>

<style scoped>
  .book-search {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .book-search-main {
    height: calc(100% - 40px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 40px;
  }

  .search-book-result {
    clear: both;
  }

  .result-detail {
    width: calc(100% - 20px);
    margin: auto;
    height: 100px;
    padding: 5px 10px;
    border-bottom: 1px solid burlywood;
  }

  .book-title {
    width: calc(100% - 100px);
    float: left;
    text-align: left;
    padding-left: 10px;
    font-size: 14px;
    color: #ec2828;
  }

  .book-shortIntro {
    width: calc(100% - 80px);
    float: left;
    padding-left: 10px;
    text-align: left;
    font-size: 14px;
    color: #666;
    height: 42px;
    overflow: hidden;
  }

  .author-and-cat {
    width: calc(100% - 80px);
    float: left;
    padding-left: 10px;
    text-align: left;
    font-size: 14px;
    overflow: hidden;
    padding-top: 4px;
    color: #666;
  }

  .mui-icon {
    font-size: 16px;
    color: #fb3535;
  }

  .mint-badge.is-primary {
    color: darkcyan;
    height: 20px;
    line-height: 16px;
    background-color: #efeff4;
    border: 1px solid #666;
    float: right;
  }

  /*.result-detail:nth-child(odd) {
    background-color:#F5F5F5;
  }
  .result-detail:nth-child(even) {
    background-color:#fff;
  }*/
  .book-result-img {
    height: 100%;
    width: auto;
    float: left;
  }
</style>
