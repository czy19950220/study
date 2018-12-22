<template>
  <div class="book-read container" id="book-read" @click="getMousePos">
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
      <router-link to="/NovelTongYong/NovelReadCurrency"><el-button>滚动阅读</el-button></router-link>
      <router-link to="/NovelTongYong/NovelReadTwoCurrency"><el-button>翻页阅读</el-button></router-link>
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
      <div class="drawer-book" id="drawer-book" slot="drawer">
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
          :key="index">
          <mt-cell :title="chapter.title"/>
        </div>
      </div>
      <!--主内容页-->
      <div class="content" slot="content">
        <!--header-->
        <mt-header :title=title>
          <router-link to="/NovelTongYong/NovelBookShelfCurrency" slot="left">
            <mt-button icon="back">返回</mt-button>
          </router-link>
          <mt-button icon="more" slot="right" @click="more"></mt-button>
        </mt-header>
        <!--文章-->
        <div class="book-read-main" id="book" v-loading.fullscreen.lock="fullscreenLoading">
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
        <mt-tabbar style="background:none;" v-show="showTabbar">
          <particle-effect-button
            :hidden="isHidden"
            color="rgb(50, 186, 250)"
            :duration="500"
            type="triangle"
            drawStyle="stroke"
          >
            <mt-tab-item id="上一章" style="width: 100%;">
              <el-button type="primary" icon="el-icon-arrow-left" @click="loadPrev(-1)" style="float: left">上一章</el-button>
              <el-button type="primary" @click="sheZhi()">设置</el-button>
              <el-button type="primary" @click="loadPrev(1)" style="float: right">下一章<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </mt-tab-item>
          </particle-effect-button>
        </mt-tabbar>
      </div>
    </vue-drawer-layout>
    <!--draggabilly-button-->
    <!--<div class="draggable" @click="main_log()">
      <mt-palette-button content="+"  mainButtonStyle="color:#fff;background-color:#26a2ff;">
        <div class="my-icon-button"></div>
      </mt-palette-button>
    </div>-->
  </div>
</template>

<script>
  import axios from 'axios';
  import {Toast} from 'mint-ui';
  import {mapGetters, mapActions} from 'vuex'
  import Draggabilly from 'draggabilly'
  import ParticleEffectButton from 'vue-particle-effect-button'
  export default {
    name: "NovelReadCurrency",
    components: {
      ParticleEffectButton
    },
    data() {
      return {
        showTabbar:true,//下方的切换章节和设置
        isHidden: false,//粒子按钮动画
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
        rangeValue:16,
        firstLoad:1,//首次加载
        allLoaded: false,//全部读完？
        bottomStatus: '',
        wrapperHeight: 0,
        pickerValue:"",
        fullscreenLoading: false,//加载动画
        title: '',
        chapterList: [],//所有章节
        chapterListNew:[],//分页后章节
        page: 0, //章节
        bodyText: '',
        pageVal:1,//分页第几页
        theParams:'111'
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
          //console.log(curVal);
          this.handleChange(curVal);
        },
      }
    },
    methods: {
      //获取点击的位置
      getMousePos(event) {
        var e = event || window.event;
        var bookRead=document.getElementById('book-read');
        let width=$('#book-read').width();
        let height=$('#book-read').height();
        let clientX=e.clientX;
        let clientY=e.clientY;
        var clickCon=0;
        if (parseInt(clientX/width *100)>25 && parseInt(clientX/width *100)<75){
          if (parseInt(clientY/height *100)>30 && parseInt(clientY/height *100)<70){
            //console.log(`x:${parseInt(clientX/width *100)},y:${parseInt(clientY/height *100)}`);
            clickCon=1;
          } else {
            clickCon=0;
          }
        } else {
          clickCon=0;
        }
        if (clickCon==1){
          this.main_log();
        }
        //console.log(clickCon);
      },
      //new一个拖拽按钮
      theDraggabilly(){
        var draggableElems = document.querySelectorAll('.draggable');
        var draggies = [];
        for ( var i=0, len = draggableElems.length; i < len; i++ ) {
          var draggableElem = draggableElems[i];
          var draggie = new Draggabilly( draggableElem, {
            containment: true
          });
          draggies.push( draggie );
        }
      },
      //拖拽按钮+号的点击事件
      main_log() {
        this.isHidden=!this.isHidden;
        if (this.isHidden==false){
          this.showTabbar=true;
        } else {
          setTimeout(() => {
            this.showTabbar=false;
          }, 500);
        }
      },
      //字体改变
      onFontChange(picker, values) {
        this.fontFamily =`couriernew, courier,${values[0]}`;
        console.log(this.fontFamily)
      },
      //改变字体大小
      handleChange(value){
        //console.log(value);
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        czyBooks.fontSize=parseInt(value);
        //console.log(czyBooks)
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks");
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
      },
      //阅读章数的index
      bookReadIndex(){
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        this.rangeValue=czyBooks.fontSize;
        //console.log(czyBooks)
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
        //console.log(JSON.parse(localStorage.getItem("czyBooks")))
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      //上拉刷新
      loadBottom() {
        //console.log('上拉了...')
        if (this.firstLoad==1){
          setTimeout(() => {
            this.$refs.loadmore.onBottomLoaded();
          }, 30);
          setTimeout(() => {
            document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
          }, 31);
          setTimeout(() => {
            this.firstLoad=0;
          }, 3000);
        } else {
          setTimeout(() => {
            //this.allLoaded = true;//判断是否全部加载完毕
            this.loadPrev(1);
          }, 200);
        }
      },
      //设置了
      sheZhi(){
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
      toChapter(title,index){
        this.allLoaded = false;//判断是否全部加载完毕
        this.page=(this.pageVal-1)*100+index;
        //console.log((this.page+1)+'章');
        //console.log(this.chapterList)
        this.getText(this.chapterList);
        this.title=title;
        this.$refs.drawerLayout.toggle(false);
        document.getElementById("book").scrollTop=0;
        //this.openFullScreen();
        //console.log(this.chapterList[this.page].title);//打印出当前阅读的章节名字
      },
      //换页
      handleCurrentChange(val) {
        this.chapterListNew=this.chapterList.slice((val-1)*100,(val)*100);
        //console.log(`当前页: ${val}`);
        //console.log(this.chapterListNew);
        this.pageVal=val;
        setTimeout(() => {
          document.getElementById('drawer-book').scrollTop=document.getElementsByClassName('blue-class')[0].offsetTop;
        },50);
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
      getLink(sourceId) {
        let url = this.GLOBAL.kuaYu+ 'http://api.zhuishushenqi.com/toc/' + sourceId + '?view=chapters';
        axios.get(url).then((response) => {
          //console.log(url)
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
      //获取文本
      getText(chapters) {//http://chapter2.zhuishushenqi.com
        this.allLoaded = false;//判断是否全部加载完毕
        //console.log(this.page)
        //console.log(chapters[this.page].title)
        this.currentPage=parseInt(this.page/100)+1;
        this.handleCurrentChange(this.currentPage);
        let url=`${this.GLOBAL.kuaYu}http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[this.page].link)}?k=2124b73d7e2e1945&t=1468223717`;
        axios.get(url).then((response) => {
          //console.log(url)
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
              //........
              //........
              this.changeBookshelf();
              setTimeout(() => {
                document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
              }, 200);
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
      //上/下一章
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
          this.getText(this.chapterList);
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
      getNovel(){
        let url=`${this.GLOBAL.kuaYu}http://api.zhuishushenqi.com/toc?view=summary&book=${this.bookDetail}`;
        axios.get(url).then((response) => {
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
      },
      novel(){
        let selfVue=this;
        class getNovel{
          constructor(){
            this.sourceId=selfVue.bookDetail;
            this.getNovel2().then(this.getLink2).then(this.getText2).then(function (data) {
              //console.log(`收到：${data}`)
            }).catch(error => {
              console.log(error)
            });
          };
          getNovel2(){
            return new Promise( (resolve, reject) => {
              axios.get(`${selfVue.GLOBAL.kuaYu}http://api.zhuishushenqi.com/toc?view=summary&book=${this.sourceId}`).then((response) => {
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
                  selfVue.theParams=sourceId;
                  resolve();//
                  //console.log(sourceId)
                }
              }).catch((err) => {
                Toast({
                  message: '资源没找到...',
                  position: 'bottom',
                  duration: 2000
                });
              });
            });
          };
          getLink2() {
            return new Promise((resolve, reject)=>{
              //console.log(`收到getNovel2改变的${selfVue.theParams}`);
              let url = '/api/toc/' + selfVue.theParams + '?view=chapters';
              let url2 = `${selfVue.GLOBAL.kuaYu}http://api.zhuishushenqi.com/toc/${selfVue.theParams}?view=chapters`;
              axios.get(url2).then((response) => {
                //console.log(sourceId)
                if (response.status == 200) {
                  let chapterList = response.data;
                  //console.log(chapterList)
                  selfVue.chapterList = chapterList.chapters;//章节列表
                  selfVue.title = selfVue.chapterList[selfVue.page].title;
                  selfVue.chapterListNew=selfVue.chapterList.slice(0,100);
                  //selfVue.getText(this.chapterList);
                  resolve();
                }
              }).catch((err) => {
                console.log(err);
                Toast({
                  message: '资源没找到...',
                  position: 'bottom',
                  duration: 2000
                });
              })

            });
          }
          getText2() {//http://chapter2.zhuishushenqi.com
            return new Promise((resolve, reject)=>{
              let chapters=selfVue.chapterList;
              selfVue.currentPage=parseInt(selfVue.page/100)+1;
              selfVue.handleCurrentChange(selfVue.currentPage);
              //console.log(chapters)
              //console.log('http://chapter2.zhuishushenqi.com/chapter/'+encodeURIComponent(chapters[selfVue.page].link)+'?k=2124b73d7e2e1945&t=1468223717')
              let txtUrl=`${selfVue.GLOBAL.kuaYu}http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[selfVue.page].link)}?k=2124b73d7e2e1945&t=1468223717`;
              axios.get(txtUrl).then((response) => {
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
                    selfVue.bodyText = data.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
                    var arr = selfVue.bodyText.split('<br>');
                    let newText=[];//用来存储新的text文本
                    for(var i=0;i<arr.length;i++){
                      newText.push(arr[i])
                    }
                    selfVue.bodyText=newText;
                    //console.log(this.bodyText)
                    selfVue.changeBookshelf();
                    setTimeout(() => {
                      document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
                    }, 200);
                  }
                }
              }).catch((err) => {
                Toast({
                  message: '资源没找到',
                  position: 'bottom',
                  duration: 2000
                });
              })
            });
          }
        }
        let novel=new getNovel();
      }
    },
    created() {
      //this.getNovel();
      this.novel();
      //console.log(JSON.parse(localStorage.getItem("czyBooks")))
      let that=this;
      this.$mui.back = function() {//从阅读到书架
        that.$router.push('/NovelTongYong/NovelBookShelfCurrency')
      };
    },
    mounted(){
      //this.theDraggabilly();
      this.bookReadIndex();
      //this.openFullScreen();
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    beforeRouteLeave(to,from,next){
      this.firstLoad=1;
      next();
    }
  }
</script>

<style scoped>
  .particles{
    width: 100%;
  }
  .draggable{
    width: 56px;
    height: 56px;
    border-radius: 50%;
    opacity: 0.5;
    left: calc(100% - 60px);
    top: calc(100% - 120px);
  }
  .draggable.is-pointer-down {
    background: #09F;
    z-index: 2000; /* above other draggies */
  }
  .draggable.is-dragging { opacity: 0.7; }
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
    height: calc(100% - 40px);
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


