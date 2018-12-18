<template>
  <div class="novel-bookshelf">
    <mt-header title="我的书架">
      <router-link to="/Entertainment/EntertainmentCells" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="search" slot="right" @click="toSearch()" class="novel-search"></mt-button>
    </mt-header>
    <div class="novel-bookshelf-main" v-loading.fullscreen.lock="fullscreenLoading">
      <!--<pre style="text-align: left">
        {{txt}}
      </pre>-->
      <div class="booksList" v-for="book in booksList" @click="toBookDetail(book._id)">
        <img v-lazy="book.cover" alt="" class="page-lazyload-image">
        <div class="book-title">{{book.title}}</div>
        <div class="book-lastChapter">阅读至： {{book.lastReadChapter}}</div>
        <div class="book-newChapter">更新至： {{book.newChapter2}}</div>
      </div>
      <div class="booksList" id="bookSearch" @click="toSearch()">
        +
      </div>
    </div>
  </div>
</template>

<script>
  let query='query';
  import axios from 'axios';
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: "NovelBookShelfCurrency",
    data(){
      return{
        fullscreenLoading:false,
        booksList:[],
        txt:`
这个只是闲着没事做做看，由于需要跨域所以有以下几种方法
一：只是在Vue的本地运行
    做法==》在config文件夹下的index.js中的dev修改
    proxyTable: {
      '/api': {
        target: 'http://api.zhuishushenqi.com',//设置你调用的接口域名和端口号
        changeOrigin: true,     //跨域
        pathRewrite: {
          '^/api': '/'          //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://10.1.5.11:8080/xxx/duty?time=2017-07-07 14:57:22'，直接写‘/api/xxx/duty?time=2017-07-07 14:57:22’即可
        }
      },
      '/chapter': {
        target: 'http://chapter2.zhuishushenqi.com',//设置你调用的接口域名和端口号
        changeOrigin: true,     //跨域
        pathRewrite: {
          '^/chapter': '/chapter'
        }

      }
    },
二：使用nginx跨域：
    例子：
    location /api/ {
        proxy_pass   http://api.zhuishushenqi.com/;
    }
三：后台nodejs处理后再发过来(用的这个：var request=require('request');)
    相当于做了类似nginx的事情，我用的是这个，例子：
    router.route('/search').get(function (req,res) {
    //console.log(req.query.link)
    let query=encodeURIComponent(req.query.querySearchName);
    //console.log(query)
    //this.x={};
    //例子： http://api.zhuishushenqi.com/book/fuzzy-search?query=%E5%A4%A7%E7%8E%8B&start=0&limit=20
    let theUrl2=http://api.zhuishushenqi.com/book/fuzzy-search?query=${query}&start=0&limit=20
    request(theUrl2, function (error, response, body) {
        //console.log(theUrl2)
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        res.json({
            body:body
        })
    });
});`
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail'
      ]),
    },
    methods:{
      ...mapActions([
        'bookDetailChange'
      ]),
      toBookDetail(id){//去小说详情页面
        this.bookDetailChange(id);
        this.$router.push('/NovelTongYong/NovelDetailCurrency')
      },
      toSearch(){
        /*/Novel/NovelSearch*/
        this.$router.push('/NovelTongYong/NovelSearchCurrency')
      },
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1200);
      },
      getBooks(){
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        let books=czyBooks.books;
        let loading=0;
        for (let i = 0; i < czyBooks.books.length; i++) {
          let search = `${this.GLOBAL.kuaYu}http://api.zhuishushenqi.com/book/${czyBooks.books[i]._id}`;
          axios.get(search).then((res) => {
            loading++;
            books[i].newChapter2=res.data.lastChapter;
            if (loading==czyBooks.books.length){
              this.booksList=books;
            }
          });
          //console.log(books)
        }
      }
    },
    mounted(){
      this.getBooks();
      //this.booksList=books;
      //console.log(this.booksList)
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到娱乐页面
        that.$router.push('/Entertainment/EntertainmentCells')
      };
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
  /*存储*/
  .booksList{
    height: 130px;
    width: calc(100% - 40px);
    padding: 15px 0px;
    border-bottom: 1px solid #9aec71;
    margin: auto;
    clear: both;
  }
  .booksList img{
    height: 100%;
    width: auto;
    float: left;
  }
  .page-lazyload-image[lazy=loading] {
    height: auto;
    width: 70px;
  }
  .book-title{
    height: 23px;
    width: calc(100% - 120px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #92465a;
  }
  .book-lastChapter{
    height: auto;
    width: calc(100% - 80px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #92465a;
    line-height: 1rem;
  }
  .book-newChapter{
    height: auto;
    width: calc(100% - 80px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #797700;
    line-height: 1rem;
    margin-top: 10px;
  }
  #bookSearch{
    line-height: 130px;
    text-align: center;
    font-size: 130px;
    color: black;
    opacity: 0.8;
  }
</style>
