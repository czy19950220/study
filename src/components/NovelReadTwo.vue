<template>
  <div class="book-read">
    <el-dialog
      title="设置"
      :visible.sync="centerDialogVisible"
      width="90%"
      center>
      <span>字体大小:{{rangeValue}}像素（px）</span>
      <mt-range
        v-model="rangeValue"
        :min="12"
        :max="48"
        :step="2"
        :bar-height="5">
      </mt-range>
      <!--<span>字体：</span>
      <mt-picker :slots="fontSlot" @change="onFontChange" :visible-item-count="3"></mt-picker>-->
      <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
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
          @click="toChapterMui(chapter.title,index)"
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
          <div class="page-loadmore">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
              <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                <div :class="preCon" :style="{fontSize:rangeValue+'px ',fontFamily:myFontFamily}" v-for="text in bodyText" v-html="text"></div>
                <div slot="bottom" class="mint-loadmore-bottom">
                  <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                  <span v-show="bottomStatus === 'loading'">
                    <mt-spinner type="snake"></mt-spinner>
                  </span>
                </div>
              </mt-loadmore>
            </div>
          </div>
        </div>
        <!--底部切换页面-->
        <mt-tabbar>
          <mt-tab-item id="上一章">
            <mt-button type="danger" @click="loadPrevMui(-1)">上一章</mt-button>
          </mt-tab-item>
          <mt-tab-item id="设置">
            <mt-button type="primary" @click="sheZhi">设置</mt-button>
          </mt-tab-item>
          <mt-tab-item id="下一章">
            <mt-button type="danger" @click="loadPrevMui(1)">下一章</mt-button>
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
    name: "NovelReadTwo",
    data() {
      return {
        fontSlot: [{//字体选项
          flex: 1,
          values: ['Microsoft YaHei','华文楷体','宋体', '楷体', 'none','unset'],
          className: 'slot1'
        }],
        fontFamily:'',//字体
        preCon:{
          precon:true,//基础设置
        },
        centerDialogVisible:false,//设置
        rangeValue:16,//字体
        firstLoad:true,//首次加载
        allLoaded: false,//全部加载？
        bottomStatus: '',
        wrapperHeight: 0,//高度
        fullscreenLoading: false,//加载动画
        title: '',//title
        chapterList: [],//所有章节```
        chapterListNew:[],//分页后章节
        page: 0, //章节
        bodyText: '',//内容
        pageVal:1,//分页第几页
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail',
        'myFontFamily'
      ])
    },
    watch:{
      rangeValue:{
        handler(curVal,oldVal){
          console.log(curVal);
          this.handleChange(curVal);
        },
      }
    },
    methods: {
      //字体改变
      onFontChange(picker, values) {
        this.fontFamily =`couriernew, courier,${values[0]}`;
        console.log(this.fontFamily)
      },
      //改变字体大小
      handleChange(value){
        console.log(value);
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        czyBooks.fontSize=value;
        console.log(czyBooks)
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks");
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
      },
      //阅读到第几章的索引
      bookReadIndex(){
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        this.rangeValue=czyBooks.fontSize;//字体大小
        //console.log(czyBooks.books.indexOf(this.bookAdd))
        let length=czyBooks.books.length;
        let that=this;
        let ID=this.bookDetail;
        let index=0;
        for (let i = 0; i < length; i++) {
          if (czyBooks.books[i]._id ==ID){//如果等于当前id就改变当前阅读章节
            index=czyBooks.books[i].lastReadChapterIndex;
          }
        }
        this.page=index;
      },
      //改变书架存储的阅读至第几章
      changeBookshelf(){
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        //console.log(czyBooks.books.indexOf(this.bookAdd))
        let length=czyBooks.books.length;
        let that=this;
        let ID=this.bookDetail;
        //console.log(ID)
        for (let i = 0; i < length; i++) {
          if (czyBooks.books[i]._id ==ID){//如果等于当前id就改变当前阅读章节
            czyBooks.books[i].lastReadChapter= that.chapterList[that.page].title;
            czyBooks.books[i].lastReadChapterIndex= that.page;
          }
        }
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks")
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
        console.log(JSON.parse(localStorage.getItem("czyBooks")))
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      //上拉刷新
      loadBottom() {
        if (this.firstLoad){
          setTimeout(() => {
            //this.allLoaded = true;//判断是否全部加载完毕
            //this.loadPrevMui(-1);
            this.$refs.loadmore.onBottomLoaded();
            this.firstLoad=false;
          }, 800);
          setTimeout(() => {
            document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0;
          }, 801);
        } else {
          setTimeout(() => {
            //this.allLoaded = true;//判断是否全部加载完毕
            this.loadPrevMui(1);
            this.$refs.loadmore.onBottomLoaded();
          }, 200);
        }
      },
      //设置
      sheZhi(){//不想写了，凑合看吧
        /*Toast({
          message: '不想写设置了，凑合看吧...',
          position: 'bottom',
          duration: 2000
        });*/
        this.centerDialogVisible=true;
      },
      //加载动画
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 500);
      },
      //换章节
      toChapterMui(title,index){
        this.allLoaded = false;//判断是否全部加载完毕
        this.page=(this.pageVal-1)*100+index;
        //console.log((this.page+1)+'章');
        this.getTextMui(this.chapterList);
        this.title=title;
        this.$refs.drawerLayout.toggle(false);
        document.getElementById("book").scrollTop=0;
        //this.openFullScreen();
      },
      //换页
      handleCurrentChange(val) {
        this.chapterListNew=this.chapterList.slice((val-1)*100,(val)*100);
        //console.log(`当前页: ${val}`);
        //console.log(this.chapterListNew);
        this.pageVal=val;
      },
      //点击关闭右侧框
      handleMaskClick() {
        //console.info('mask-click');
        this.$refs.drawerLayout.toggle(false);
      },
      //点击打开右侧框
      more(){
        this.$refs.drawerLayout.toggle();
      },
      //获取章节和链接
      getLinkMui(sourceId) {
        let that=this;
        this.$mui.ajax({
          url : 'http://api.zhuishushenqi.com/toc/'+sourceId+'?view=chapters',
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
            let chapterList = data;
            that.chapterList = chapterList.chapters;//章节列表
            //this.chaTitle = this.chapterList[this.page].title;
            that.title = that.chapterList[that.page].title;
            //console.log(this.chapterList);
            that.chapterListNew=that.chapterList.slice(0,100);
            that.getTextMui(that.chapterList);
          },
          error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
            that.$mui.toast('请求失败');
          }
        });
      },
      //获取章节的内容
      getTextMui(chapters) {//http://chapter2.zhuishushenqi.com
        let that=this;
        this.$mui.ajax({
          url : `http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[that.page].link)}?k=2124b73d7e2e1945&t=1468223717)`,
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
            let theData=data;
            if (theData.ok) {
              if (theData.chapter.body.indexOf('下载最新的追书神器app阅读本作') > -1) {
                Toast({
                  message: '资源丢失了...',
                  position: 'bottom',
                  duration: 2000
                });
                return;
              }
              if (theData.chapter.body.indexOf('请安装最新版追书') > -1) {
                Toast({
                  message: '资源丢失了...',
                  position: 'bottom',
                  duration: 2000
                });
                return;
              }
              //把回车换成br标签
              that.bodyText = theData.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
              var arr = that.bodyText.split('<br>');
              let newText=[];//用来存储新的text文本
              for(var i=0;i<arr.length;i++){
                newText.push(arr[i])
              }
              that.bodyText=newText;
              that.changeBookshelf()
              setTimeout(() => {
                document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
              }, 200);
              //console.log(this.bodyText)
            }
          },
          error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
            that.$mui.toast('请求失败');
          }
        });
      },
      //上/下一章
      loadPrevMui(num){
        this.allLoaded = false;
        //this.openFullScreen();
        this.page =this.page+num;
        if (this.page<0){
          this.page =0;
          Toast({
            message: '已经是第一章了...',
            position: 'bottom',
            duration: 2000
          });
          this.allLoaded = false;//判断是否全部加载完毕
        }else if (this.page>=this.chapterList.length){
          this.page =this.chapterList.length-1;
          Toast({
            message: '已经是最新章了...',
            position: 'bottom',
            duration: 2000
          });
          this.allLoaded = true;//判断是否全部加载完毕
        }else {
          this.getTextMui(this.chapterList);
          this.title=this.chapterList[this.page].title;
          //console.log(document.getElementById("book").scrollTop)
          //document.getElementById("book").scrollTop=0;
          document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
          setTimeout(() => {
            document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
          }, 100);
        }
      },
      //获取小说
      getNovelMui(){
        let that=this;
        this.$mui.ajax({
          url : `http://api.zhuishushenqi.com/toc?view=summary&book=${that.bookDetail}`,
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
            let theData = data;
            console.log('theData')
            console.log(theData)
            let sourceId = theData.length > 1 ? theData[1]._id : theData[0]._id;
            for (let item of theData) {
              if (item.source === 'my176') {
                sourceId = item._id;
                break;
              }
            }
            that.getLinkMui(sourceId);
          },
          error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
            that.$mui.toast('请求失败');
          }
        });
      }
    },
    created() {
      this.getNovelMui();
      let that=this;
      this.$mui.back = function() {//从书架返回到娱乐页面
        that.$router.push('/Novel/NovelBookshelf')
      };
      setTimeout(() => {
        document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
      }, 100);
    },
    mounted(){
      this.bookReadIndex();
      //this.openFullScreen();
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top -60;
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
    clear: both;
  }

  .precon {
    padding: 0 10px;
    line-height: 1.5;
    color: #333;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word;
    /*font-family: couriernew, courier, 华文楷体;*/
    font-family: "Microsoft YaHei";
    text-align: left;
    text-indent: 2em;
    margin-bottom: 0px;
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
  .page-loadmore{
  }
  .page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle;
  }
  .page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px;
  }
  .page-loadmore-desc:last-of-type {
    border-bottom: solid 1px #eee;
  }
  .page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #eee;
    text-align: center;
  }
  .page-loadmore-listitem:first-child {
    border-top: solid 1px #eee;
  }
  .page-loadmore-wrapper {
    overflow: scroll;
  }
  .mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
  }
  .mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .page-loadmore-list{
    padding-bottom: 20px;
  }
</style>
