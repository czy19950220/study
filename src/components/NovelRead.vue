<template>
  <div class="book-read">
    <vue-drawer-layout
      ref="drawerLayout"
      @mask-click="handleMaskClick"
      :reverse="true">
      <!--侧栏-->
      <div class="drawer-book" slot="drawer">
        <!--分页-->
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-size="100"
            :pager-count="5"
            layout="prev, pager, next"
            :total="chapterList.length">
          </el-pagination>
        </div>
        <!--章节-->
        <div
          v-for="(chapter,index) in chapterListNew"
          @click="toChapter(chapter.title,index)"
          :class="((index+(pageVal-1)*100) == page)? 'blue-class':'red-class'"
          :key="chapter.title">
          <mt-cell :title="chapter.title"/>
        </div>
      </div>
      <!--主内容页-->
      <div class="content" slot="content">
        <!--header-->
        <mt-header :title=title>
          <router-link to="/Novel/NovelDetail" slot="left">
            <mt-button icon="back">返回</mt-button>
          </router-link>
          <mt-button icon="more" slot="right" @click="more"></mt-button>
        </mt-header>
        <div class="book-read-main" id="book" v-loading.fullscreen.lock="fullscreenLoading">
          <!--文章-->
          <pre class="pre-con" v-for="text in bodyText" v-html="text"></pre>
        </div>
        <mt-tabbar>
          <mt-tab-item id="外卖">
            <mt-button type="danger" @click="loadPrev(-1)">上一章</mt-button>
          </mt-tab-item>
          <mt-tab-item id="订单">
            <mt-button type="primary" @click="sheZhi">设置</mt-button>
          </mt-tab-item>
          <mt-tab-item id="发现">
            <mt-button type="danger" @click="loadPrev(1)">下一章</mt-button>
          </mt-tab-item>
        </mt-tabbar>
      </div>
    </vue-drawer-layout>

  </div>
</template>

<script>
  import axios from 'axios';
  import {Toast} from 'mint-ui';
  import {mapGetters, mapActions} from 'vuex'
  export default {

    name: "NovelRead",
    data() {
      return {
        pickerValue:"",
        fullscreenLoading: false,//加载动画
        title: '',
        chapterList: [],//所有章节
        chapterListNew:[],//分页后章节
        page: this.$route.params.page || 0, //章节
        bodyText: '',
        pageVal:1,//分页第几页
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail'
      ])
    },
    methods: {
      sheZhi(){//不想写设置了，凑合看吧
        Toast({
          message: '不想写设置了，凑合看吧...',
          position: 'bottom',
          duration: 2000
        });
      },
      openFullScreen() {//加载动画
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 100);
      },
      toChapter(title,index){//换章节
        this.page=(this.pageVal-1)*100+index;
        //console.log((this.page+1)+'章');
        this.getText(this.chapterList);
        this.title=title;
        this.$refs.drawerLayout.toggle(false);
        document.getElementById("book").scrollTop=0;
        //this.openFullScreen();
      },
      handleCurrentChange(val) {//换页
        this.chapterListNew=this.chapterList.slice((val-1)*100,(val)*100);
        //console.log(`当前页: ${val}`);
        //console.log(this.chapterListNew);
        this.pageVal=val;
      },
      handleMaskClick() {//点击关闭右侧框
        //console.info('mask-click');
        this.$refs.drawerLayout.toggle(false);
      },
      more(){//点击打开右侧框
        this.$refs.drawerLayout.toggle();
      },
      getLink(sourceId) {//获取章节和链接
        let url = '/api/toc/' + sourceId + '?view=chapters';
        axios.get(url).then((response) => {
          //console.log(sourceId)
          if (response.status == 200) {
            let chapterList = response.data;
            this.chapterList = chapterList.chapters;//章节列表
            //this.chaTitle = this.chapterList[this.page].title;
            this.title = this.chapterList[this.page].title;
            //console.log(this.chapterList);
            this.chapterListNew=this.chapterList.slice(0,100);
            this.getText(this.chapterList);
            //console.log(this.chapterList)
          }
        }).catch((err) => {
          console.log(err);
          Toast({
            message: '资源没找到...',
            position: 'bottom',
            duration: 2000
          });
        })
      },
      getText(chapters) {
        axios.get(`/chapter/` + `${encodeURIComponent(chapters[this.page].link)}` + `?k=2124b73d7e2e1945&t=1468223717)`).then((response) => {
          if (response.status == 200) {
            let data = response.data;
            if (data.ok) {
              if (data.chapter.body.indexOf('下载最新的追书神器app阅读本作') > -1) {
                Toast({
                  message: '资源丢失了...',
                  position: 'bottom',
                  duration: 2000
                });
                return;
              }
              if (data.chapter.body.indexOf('请安装最新版追书') > -1) {
                Toast({
                  message: '资源丢失了...',
                  position: 'bottom',
                  duration: 2000
                });
                return;
              }
              //把回车换成br标签
              this.bodyText = data.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
              var arr = this.bodyText.split('<br>');
              let newText=[];//用来存储新的text文本
              for(var i=0;i<arr.length;i++){
                newText.push(arr[i])
              }
              this.bodyText=newText;
              console.log(this.bodyText)
            }
          }
        }).catch((err) => {
          Toast({
            message: '资源没找到',
            position: 'bottom',
            duration: 2000
          });
        })
      },
      loadPrev(num){
        //this.openFullScreen();
        this.page =this.page+num;
        if (this.page<0){
          this.page =0;
          Toast({
            message: '已经是第一章了...',
            position: 'bottom',
            duration: 2000
          });
        }else if (this.page>=this.chapterList.length){
          this.page =this.chapterList.length-1;
          Toast({
            message: '已经是最新章了...',
            position: 'bottom',
            duration: 2000
          });
        }else {
          this.getText(this.chapterList);
          this.title=this.chapterList[this.page].title;
          //console.log(document.getElementById("book").scrollTop)
          document.getElementById("book").scrollTop=0;
        }
      },
      getNovel(){
        axios.get('/api/toc?view=summary&book=' + this.bookDetail).then((response) => {
          //console.log(response.data)
          if (response.status == 200) {
            let data = response.data;
            let sourceId = data.length > 1 ? data[1]._id : data[0]._id;
            for (let item of data) {
              if (item.source === 'my176') {
                sourceId = item._id;
                break;
              }
            }
            this.getLink(sourceId);
          }
          Toast({
            message: '加载成功',
            position: 'bottom',
            duration: 2000
          });
        }).catch((err) => {
          Toast({
            message: '资源没找到...',
            position: 'bottom',
            duration: 2000
          });
        });
      }
    },
    created() {

    },
    mounted(){
      this.getNovel();
    }
  }
</script>

<style scoped>
  .blue-class{
    background-color: antiquewhite;
    color: black;
    font-weight: bold;
  }
  .red-class{

  }
  .book-read {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .book-read-main {
    height: calc(100% - 90px);
    width: calc(100% - 0px);
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 40px;
    padding: 10px 15px 0px;
    clear: both;
  }

  .pre-con {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word;
    font-family: couriernew, courier, monospace;
    text-align: left;
    text-indent: 2em;
  }
  .drawer-book{
    height: 100%;
    background-color: white;
    overflow-y: scroll;
    overflow-x:hidden;
  }
  .mint-cell:last-child{
    background: none;
  }
  .mint-tabbar{
    background-color: #97d3ff;
  }

</style>
