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
          @keyup.enter.native="getSearch3"
          style="width: 60%"
          placeholder="请输入内容"
          v-model="query">
        </el-input>
        <el-button type="primary" @click="getSearch3()">搜索</el-button>
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
    name: "NovelSearch",
    data() {
      return {
        query: '',
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
      getSearch3() {//mui的方法,测试
        let that=this;
        this.$mui.ajax({
          url : `http://api.zhuishushenqi.com/book/fuzzy-search?query=${that.query}&start=0&limit=20`,
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
            //alert(data)
            let bookList =data;
            //console.log('data')
            //console.log(bookList)//{ok:true,total:1076,books:[{},{},{}]}
            bookList.books.map((item) => {
              //图片比例140:200
              item.cover = item.cover ? that.url2Real(item.cover) : '../assets/imgs/err.png';
              item.shortIntro = item.shortIntro.length > 30 ? item.shortIntro.substr(0, 30) + "....." : item.shortIntro;
            });
            //console.log(bookList)
            //console.log(bookList.books)
            that.searchResult = bookList.books;
            /*if (bookList.books.length == 0) {
              let instance = Toast('没找到');
              setTimeout(() => {
                instance.close();
              }, 2000);
            } else {
              let instance = Toast('找到了');
              setTimeout(() => {
                instance.close();
              }, 2000);
              bookList.books.map((item) => {
                //图片比例140:200
                item.cover = item.cover ? this.url2Real(item.cover) : '../assets/imgs/err.png';
                item.shortIntro = item.shortIntro.length > 30 ? item.shortIntro.substr(0, 30) + "....." : item.shortIntro;
              });
              console.log(bookList)
              console.log(bookList.books)
              that.searchResult = bookList.books;
            }*/
          },
          error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
            that.$mui.toast('请求失败');
          }
        });
      },
      toBook(result) {
        this.bookDetailChange(result._id);
        this.$router.push('/Novel/NovelDetail')
      }
    },
    mounted() {
      //this.getSearch3();
      //console.log(this.bookDetail)
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到娱乐页面
        that.$router.push('/Novel/NovelBookshelf')
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
