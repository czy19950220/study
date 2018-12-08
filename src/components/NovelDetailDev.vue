<template>
  <div class="book-detail">
    <mt-header :title='`${book.title}`'>
      <router-link to="/NovelDev/NovelBookshelfDev" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="book-detail-main">
      <img :src="book.cover" :alt="book.title">
      <div class="book-title">{{book.title}}</div>
      <div class="book-title2 book-title">{{book.author}} | {{book.cat}} | {{book.wordCount}}</div>
      <div class="book-title book-title3">{{book.lastChapter}}</div>
      <div class="book-title book-title3">{{book.latelyFollower}}在追</div>
      <div style="width: 100%;float: left;text-align: left;text-indent: 2em;margin-top: 10px">
        {{book.longIntro}}
      </div>
      <div style="width: 100%;float: left">
        <br>
        <mt-button @click.native="addBook" size="large" type="primary">{{addRemove}}</mt-button>
        <br>
        <mt-button @click.native="readBook" size="large">开始阅读</mt-button>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { Toast } from 'mint-ui';
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "NovelDetailDev",
    data() {
      return {
        book: {},
        addRemove:'添加书架',
        bookAdd:{}
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail'
      ])
    },
    methods: {
      hasBook(){//判断是否书架有这个书没？
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        //console.log(czyBooks.books.indexOf(this.bookAdd))
        let length=czyBooks.books.length;
        let that=this;
        let has=0;
        for (let i = 0; i < length; i++) {
          if (czyBooks.books[i]._id==that.bookAdd._id){
            has+=1;
          }
        }
        //console.log(has)
        if (has > 0){//有
          that.addRemove='移除书架'
        } else {//没有
          that.addRemove='添加书架'
        }
      },
      addBook(){
        let that=this;
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        let length=czyBooks.books.length;
        let has=0;
        for (let i = 0; i < length; i++) {
          if (czyBooks.books[i]._id==that.bookAdd._id){
            has+=1;
          }
        }
        if (has > 0){//有==>移除这本书
          that.addRemove='添加书架';//字变成了添加
          var arr =$.grep( czyBooks.books, function(n,i){
            return n._id == that.bookAdd._id;
          },true);
          //console.log(arr)
          czyBooks.books=arr;
        } else {//没有==>添加这本书
          czyBooks.books.push(that.bookAdd);//添加这个书
          that.addRemove='移除书架';//字变成了移除
        }
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks")
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
        console.log(JSON.parse(localStorage.getItem("czyBooks")))
      },
      readBook(){
        this.$router.push('/NovelDev/NovelRead')
      },
      //转化封面url为实际url
      url2Real(url) {
        if (url.search(/agent/i) === -1) {
          return 'http://api.zhuishushenqi.com' + url;
        }
        else {
          return decodeURIComponent(url.replace(/\/agent\//, ''));
        }
      },
      //将字数带上单位 如12345 转化为1.2万字
      wordCount2Str(wordCount) {
        if (Array.from(String(wordCount)).length > 4) {
          let arr = Array.from(String(wordCount));
          arr.length -= 4;
          wordCount = arr.join('') + '万';
        }
        if (wordCount <= 0) {
          wordCount = 0;
        }
        return wordCount + '字';
      },
      getBook(){
        let search = `/api/book/${this.bookDetail}`;
        axios.get(search).then((res) => {
          this.book = res.data;
          this.book.cover = this.book.cover ? this.url2Real(this.book.cover) : '../assets/imgs/err.png';
          this.book.wordCount = this.book.wordCount ? this.wordCount2Str(this.book.wordCount) :0;
          //console.log('this.book')
          //console.log(this.book)
          this.bookAdd.cover=this.book.cover;//封面
          this.bookAdd.wordCount=this.book.wordCount;//字数
          this.bookAdd._id=this.book._id;//ID
          this.bookAdd.title=this.book.title;//名字
          this.bookAdd.lastReadChapter='还没阅读';//第一章节
          this.bookAdd.lastReadChapterIndex=0;//第一章节
          //console.log(this.bookAdd)//需要存储的一个对象（book）
          this.hasBook()
        });
      }
    },
    mounted() {
      this.getBook();
    },
    created(){
      /*let that=this;
      //设置1.5s后判断
      setTimeout(function () {
        that.hasBook()
      },1500)*/
    }
  }
</script>

<style scoped>
  .book-detail {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .book-detail-main {
    height: calc(100% - 50px);
    width: calc(100% - 0px);
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 40px;
    padding: 10px 15px 0px;
    clear: both;
  }

  .book-detail-main img {
    height: 120px;
    width: auto;
    float: left;
  }

  .book-title {
    width: calc(100% - 100px);
    float: left;
    text-align: left;
    padding-left: 10px;
    font-size: 16px;
    color: #ec2828;
  }

  .book-title2 {
    color: #666;
    font-size: 12px;
  }
  .book-title3 {
    color: #666;
    font-size: 14px;
  }
</style>
