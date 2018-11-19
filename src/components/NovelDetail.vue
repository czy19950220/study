<template>
  <div class="book-detail">
    <mt-header :title='`${book.title}`'>
      <router-link to="/Novel/NovelSearch" slot="left">
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
        <mt-button @click.native="addBook" size="large" type="primary">添加书架</mt-button>
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
    name: "NovelDetail",
    data() {
      return {
        book: {},
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail'
      ])
    },
    methods: {
      addBook(){
        let x=0;
        if(x==1){
          let instance = Toast('添加成功');
          setTimeout(() => {
            instance.close();
          }, 2000);
        }else {
          let instance = Toast('移除成功');
          setTimeout(() => {
            instance.close();
          }, 2000);
        }

      },
      readBook(){

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
          //console.log(this.book)
        });
        axios.get('/api/toc?view=summary&book='+this.bookDetail).then((response) => {
          console.log(response.data)
          if (response.status == 200) {
            let data = response.data ;
            let sourceId = data.length > 1 ? data[1]._id : data[0]._id;
            for (let item of data) {
              if (item.source === 'my176') {
                sourceId = item._id;
                break ;
              }
            }
            let chapterList = response.data;
            let _this=this;
            _this.chapterList =chapterList.chapters;//章节列表.
            _this.chaTitle = _this.chapterList[_this.page].title;
            _this.getText(_this.chapterList);
            axios.get('/api/toc/'+sourceId+'?view=chapters').then((response) => {
              if (response.status == 200) {
                console.log(response.data.chapters[1308].link);
                let xx=response.data.chapters[1308].link;
                this.$axios.get(`/chapter/`+`${encodeURIComponent(chapters[_this.page].link)}`+`?k=2124b73d7e2e1945&t=1468223717)`).then((response) => {
                  console.log(response.data)
                })
              }
            }).catch((err) => {
              let instance = Toast('寻找资源失败');
              setTimeout(() => {
                instance.close();
              }, 2000);
            });
          }
        });
      }
    },
    created() {
      this.getBook();
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
