<template>
  <div class="book-read container" id="book-read" @click="getMousePos" @swipeleft="swipeLeft" @swiperight="swipeRight">
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
      <router-link to="/Novel/NovelReadTwo"><el-button>滚动阅读</el-button></router-link>
      <router-link to="/Novel/NovelReadThree"><el-button>翻页阅读</el-button></router-link>
      <color-picker v-model="color"></color-picker>
      <p>
        字体Color:
        <input v-model="color" type="text">
      </p>
      <p>
        背景图:
        <!--<input v-model="bgImg" type="text">-->
        <el-select v-model="bgImg" placeholder="请选择">
          <el-option
            v-for="item in bgImages"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>
      <!--<span>字体：</span>
      <mt-picker :slots="fontSlot" @change="onFontChange" :visible-item-count="3"></mt-picker>-->
      <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
    <vue-drawer-layout
      :enable="false"
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
            :current-page="currentPage"
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
          :key="index">
          <mt-cell :title="chapter.title"/>
        </div>
      </div>
      <!--主内容页-->
      <div class="content" slot="content">
        <!--header-->
        <mt-header :title=title v-show="showTabbar">
          <router-link to="/Novel/NovelDetail" slot="left">
            <mt-button icon="back">返回</mt-button>
          </router-link>
          <mt-button icon="more" slot="right" @click="more"></mt-button>
        </mt-header>
        <!--文章-->
        <div id="magazine" dir="ltr" @click="loadPrevClick()">
          <div v-for="html in newHtmlArr" class="novel-page" :style="{fontSize:rangeValue+'px ',fontFamily:myFontFamily}">
            <div v-for="txt in html" v-html="txt">
            </div>
          </div>
        </div>
        <!--底部切换页面-->
        <mt-tabbar style="background:none; z-index: 100" v-show="showTabbar">
          <particle-effect-button
            :hidden="isHidden"
            color="rgb(50, 186, 250)"
            :duration="500"
            type="triangle"
            drawStyle="stroke"
          >
            <mt-tab-item id="上一章" style="width: 100%;">
              <el-button type="primary" icon="el-icon-arrow-left" @click="loadPrevMui(-1)" style="float: left">上一章</el-button>
              <el-button type="primary" @click="sheZhi()">设置</el-button>
              <el-button type="primary" @click="loadPrevMui(1)" style="float: right">下一章<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </mt-tab-item>
          </particle-effect-button>
        </mt-tabbar>
      </div>
    </vue-drawer-layout>
    <!--<div class="draggable" @click="main_log('点击了')">
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
  import './../assets/js/turn.min'
  import ColorPicker from 'vue-color-picker-wheel';
  //import {bgImgs} from './../assets/js/bgImg'
  export default {
    name: "NovelReadThree",
    components: {
      ParticleEffectButton,
      ColorPicker
    },
    data() {
      return {
        bgImages:[],
        bgImg:'https://czy-1257069199.cos.ap-beijing.myqcloud.com/my-app/novel/bg5.jpg',//背景图
        color: '#000000',//字体颜色
        vueDrawerLayout:false,//是否是打开了切换章节...
        loadCurrentPage:1,//当前翻页的页数
        newHtmlArr:[],//仿真书的HTML  arr
        showTabbar:false,//下方的切换章节和设置
        showTabbarPreventDefult:1,//阻止多次点击中间的屏幕位置
        isHidden: true,//粒子按钮动画
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
        currentPage:1,//当前分页第几页
        theParams:''
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
          if (this.firstLoad==true){
            setTimeout(() => {
              this.handleChange(curVal);
            }, 1500);
          } else {
            this.handleChange(curVal);
          }
        },
      },
      color: {
        handler(curVal, oldVal) {
          setTimeout(() => {
            let index=this.page-(this.pageVal-1)*100;
            this.toChapterMui(this.title,index);
            this.onFontColorChange(curVal)
          }, 300);
        }
      },
      bgImg:{
        handler(curVal, oldVal) {
          $('#magazine .page').css("background-image",`url(${curVal})`);
          let index=this.page-(this.pageVal-1)*100;
          this.toChapterMui(this.title,index);
          this.bgImgChange(curVal);
          $('#magazine .page').css("background-image",`url(${curVal})`);
        }
      }
    },
    methods: {
      //向左滑动
      swipeLeft(){
        if (this.loadCurrentPage==$("#magazine").turn("pages")){
          this.loadPrevMui(1);
        }else {
          $("#magazine").turn("next");
        }
        /*console.log('-----');
        console.log($("#magazine").turn("pages"));
        console.log(this.loadCurrentPage);*/
      },
      //向右滑动
      swipeRight(){
        if (this.loadCurrentPage==1){
          this.loadPrevMui(-1);
        }else {
          $("#magazine").turn("previous");
        }
      },
      loadPrevClick(event){//阅读的手动切换章节（通过点击位置判断）
        if (this.vueDrawerLayout){
          return;
        }
        var e = event || window.event;
        var bookRead=document.getElementById('book-read');
        let width=$('#magazine').width();
        let height=$('#magazine').height();
        let clientX=e.clientX;
        let clientY=e.clientY;
        //console.log(clickCon);
        //翻页到最后一个时...//阅读的手动切换章节（通过点击位置判断）
        if (this.loadCurrentPage==$("#magazine").turn("pages")){
          if (parseInt(clientX/width *100)>78){//如果点击的区域大于屏幕宽度的78%就doSomething....
            this.loadPrevMui(1);
          }
        }else if (this.loadCurrentPage==1){
          if (parseInt(clientX/width *100)<23){//如果点击的区域大于屏幕宽度的78%就doSomething....
            this.loadPrevMui(-1);
            $("#magazine").turn("page", 1);
          }else if (parseInt(clientX/width *100)>78){//如果点击的区域大于屏幕宽度的78%就doSomething....
            $("#magazine").turn("next");
          }
        }else {
          if (parseInt(clientX/width *100)>78){//如果点击的区域大于屏幕宽度的78%就doSomething....
            $("#magazine").turn("next");
          }else if (parseInt(clientX/width *100)<23){//如果点击的区域大于屏幕宽度的78%就doSomething....
            $("#magazine").turn("previous");
          }
        }
      },
      //点击屏幕中间位置的方法x:25-75,y:30-70;
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
            clickCon=1;
          }
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
      main_log(val) {
        console.log(val);
        if (this.showTabbarPreventDefult==0){
          return;
        }
        this.showTabbarPreventDefult=0;
        setTimeout(() => {
          this.showTabbarPreventDefult=1;
        }, 1000);
        this.isHidden=!this.isHidden;
        if (this.isHidden==false){
          this.showTabbar=true;
        } else {
          setTimeout(() => {
            this.showTabbar=false;
          }, 500);
        }
      },
      //字体color改变
      onFontColorChange(values) {
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        czyBooks.fontColor=values;
        //console.log(czyBooks)
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks");
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
      },
      //阅读背景改变
      bgImgChange(values){
        let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
        czyBooks.bgImg=values;
        //console.log(czyBooks)
        czyBooks=JSON.stringify(czyBooks);
        localStorage.removeItem("czyBooks");
        localStorage.setItem("czyBooks",czyBooks);//以“czyBooks”为名称存储书籍
      },
      //改变字体大小
      handleChange(value){
        //console.log(value);
        let index=this.page-(this.pageVal-1)*100;
        this.toChapterMui(this.title,index);
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
        this.bgImg=czyBooks.bgImg ||  'https://czy-1257069199.cos.ap-beijing.myqcloud.com/my-app/novel/bg5.jpg';
        this.color=czyBooks.fontColor || '#000000';
        let length=czyBooks.books.length;
        let that=this;
        let ID=this.bookDetail;
        let index=0;
        for (let i = 0; i < length; i++) {
          if (czyBooks.books[i]._id ==ID){//如果等于当前id就改变当前阅读章节
            index=czyBooks.books[i].lastReadChapterIndex;
          }
        }
        $('#magazine .page').css("background-image",`url(${this.bgImg})`);
        setTimeout(() => {
          this.page=index;
        },50)
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
            this.$refs.loadmore.onBottomLoaded();
          }, 30);
          setTimeout(() => {
            //document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
          }, 31);
          setTimeout(() => {
            //this.allLoaded = true;//判断是否全部加载完毕
            //this.loadPrevMui(-1);
            //this.$refs.loadmore.onBottomLoaded();
            this.firstLoad=false;
          }, 3000);
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
        //document.getElementById("book").scrollTop=0;
        this.vueDrawerLayout=false;
        //this.openFullScreen();
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
        this.vueDrawerLayout=false;
      },
      //点击打开右侧框
      more(){
        this.$refs.drawerLayout.toggle();
        this.vueDrawerLayout=true;
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
        this.currentPage=parseInt(this.page/100)+1;
        this.handleCurrentChange(this.currentPage);
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
            //that.$mui.toast('请求成功');
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
              //#region
              let newArr2=[];
              for (let i = 0; i < that.bodyText.length; i++) {
                let txtLength=that.bodyText[i].length;//字数？
                let hangNum=parseInt(($('#book-read').width()-22)/that.rangeValue);//一行几个字？（总宽度-20）/ 字体大小
                //console.log(hangNum)
                let xxx=Math.ceil(txtLength/hangNum);//几行？ 总字数 / 一行的字数
                let yyy=that.bodyText[i];
                for (let i = 0; i < xxx; i++) {
                  if (i==0){
                    let txtHtml=`<div  style="font-size: ${that.rangeValue}px;font-family: ${that.myFontFamily};width: ${hangNum*that.rangeValue}px;" class="txt-header">${yyy.substring(0,(hangNum-2))}</div>`;
                    newArr2.push(txtHtml)
                  } else {
                    let x=(hangNum-2)+(i-1)*hangNum,y=(hangNum-2)+i*hangNum;
                    let txtHtml=`<div style="font-size: ${that.rangeValue}px;font-family: ${that.myFontFamily};width: ${hangNum*that.rangeValue}px;" class="txt-not-header">${yyy.substring(x,y)}</div>`
                    newArr2.push(txtHtml)
                  }
                }
              }
              //console.log(newArr2);
              let newArr3=[];
              let hangAll=parseInt(($('#book-read').height()-80)/(that.rangeValue*1.5));
              for (let i = 0; i < newArr2.length/hangAll; i++) {
                newArr3[i]=(newArr2.slice(i*hangAll,(i+1)*hangAll))
              }
              //console.log(newArr3);
              //this.newHtmlArr=newArr3;
              //console.log(this.newHtmlArr);
              let aWidth = $('#magazine').width();
              let aHeight = $('#magazine').height();
              function removeBook(){
                let pageX=$("#magazine").turn("pages");
                //console.log(pageX);
                if (pageX<=1){
                  for (let i = 0; i < newArr3.length; i++) {
                    let htmlTxt=``;
                    for (let j = 0; j < newArr3[i].length; j++) {
                      htmlTxt +=newArr3[i][j];
                    }
                    if (newArr3.length==1){
                      for (let x = 0; x < 2; x++) {
                        let element = $("<div />").html(`<div class="novel-page-con" style="background-image: url(${that.bgImg});color: ${that.color};">${htmlTxt}</div>`);
                        $("#magazine").turn("addPage", element, x+1);
                      }
                    }else {
                      let element = $("<div />").html(`<div class="novel-page-con" style="background-image: url(${that.bgImg});color: ${that.color};">${htmlTxt}</div>`);
                      $("#magazine").turn("addPage", element, i+1);
                    }
                  }
                  return;
                } else {
                  $("#magazine").turn("removePage", pageX);
                  removeBook();
                }
              }
              removeBook();
              //#endregion
              that.changeBookshelf();
              setTimeout(() => {
                //document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
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
        this.loadCurrentPage=1;
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
        }
      },
      //获取小说
      getNovelMui(){
        this.loadCurrentPage=1;
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
      },
      novel(){
        let selfVue=this;
        class getNovel{
          constructor(){
            this.sourceId=selfVue.bookDetail;
            this.bookReadIndex2().then(this.getNovel2).then(this.getLink2).then(this.getText2).then(function (data) {
              //console.log(`收到：${data}`)
            }).catch(error => {
              console.log(error)
            });
          };
          bookReadIndex2(){
            return new Promise( (resolve, reject) =>{
              let czyBooks=JSON.parse(localStorage.getItem("czyBooks"));
              selfVue.rangeValue=czyBooks.fontSize;//字体大小
              //console.log(czyBooks.books.indexOf(this.bookAdd))
              let length=czyBooks.books.length;
              let ID=selfVue.bookDetail;
              let index=0;
              for (let i = 0; i < length; i++) {
                if (czyBooks.books[i]._id ==ID){//如果等于当前id就改变当前阅读章节
                  index=czyBooks.books[i].lastReadChapterIndex;
                }
              }
              setTimeout(() => {
                selfVue.page=index;
                resolve();
              },50)
            });
          };
          getNovel2(){
            return new Promise( (resolve, reject) => {
              selfVue.$mui.ajax({
                url : `http://api.zhuishushenqi.com/toc?view=summary&book=${selfVue.bookDetail}`,
                data: {},
                async: true,
                dataType:'json',//服务器返回json格式数据
                crossDomain: true, //强制使用5+跨域
                type:'get',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                scriptCharset:'utf-8',
                headers:{'Content-Type':'application/json'},
                success:function(data){
                  selfVue.$mui.toast('请求成功');
                  let theData = data;
                  let sourceId = theData.length > 1 ? theData[1]._id : theData[0]._id;
                  for (let item of theData) {
                    if (item.source === 'my176') {
                      sourceId = item._id;
                      break;
                    }
                  }
                  selfVue.theParams=sourceId;
                  resolve();//
                },
                error:function(xhr,type,errorThrown){
                  //异常处理；
                  console.log(type);
                  selfVue.$mui.toast('请求失败');
                }
              });
            });
          };
          getLink2() {
            return new Promise((resolve, reject)=>{
              selfVue.$mui.ajax({
                url : 'http://api.zhuishushenqi.com/toc/'+selfVue.theParams+'?view=chapters',
                data: {},
                async: true,
                dataType:'json',//服务器返回json格式数据
                crossDomain: true, //强制使用5+跨域
                type:'get',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                scriptCharset:'utf-8',
                headers:{'Content-Type':'application/json'},
                success:function(data){
                  selfVue.$mui.toast('请求成功');
                  let chapterList = data;
                  selfVue.chapterList = chapterList.chapters;//章节列表
                  //this.chaTitle = this.chapterList[this.page].title;
                  selfVue.title = selfVue.chapterList[selfVue.page].title;
                  //console.log(this.chapterList);
                  selfVue.chapterListNew=selfVue.chapterList.slice(0,100);
                  //selfVue.getTextMui(that.chapterList);
                  resolve();
                },
                error:function(xhr,type,errorThrown){
                  //异常处理；
                  console.log(type);
                  selfVue.$mui.toast('请求失败');
                }
              });
            });
          }
          getText2() {//http://chapter2.zhuishushenqi.com
            return new Promise((resolve, reject) => {
              let chapters = selfVue.chapterList;
              selfVue.currentPage = parseInt(selfVue.page / 100) + 1;
              selfVue.handleCurrentChange(selfVue.currentPage);
              selfVue.$mui.ajax({
                url: `http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[selfVue.page].link)}?k=2124b73d7e2e1945&t=1468223717)`,
                data: {},
                async: true,
                dataType: 'json',//服务器返回json格式数据
                crossDomain: true, //强制使用5+跨域
                type: 'get',//HTTP请求类型
                timeout: 10000,//超时时间设置为10秒；
                scriptCharset: 'utf-8',
                headers: {'Content-Type': 'application/json'},
                success: function (data) {
                  selfVue.$mui.toast('请求成功');
                  let theData = data;
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
                    selfVue.bodyText = theData.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
                    var arr = selfVue.bodyText.split('<br>');
                    let newText = [];//用来存储新的text文本
                    for (var i = 0; i < arr.length; i++) {
                      newText.push(arr[i])
                    }
                    selfVue.bodyText = newText;
                    selfVue.changeBookshelf()
                    //#region
                    let newArr2=[];
                    for (let i = 0; i < selfVue.bodyText.length; i++) {
                      let txtLength=selfVue.bodyText[i].length;//字数？
                      let xxx=Math.ceil(txtLength/12)//几行？
                      let yyy=selfVue.bodyText[i];
                      for (let i = 0; i < xxx; i++) {
                        let y=0;
                        if (i==0){
                          let txtHtml=`<div class="txt-header">${yyy.substring(0,10)}</div>`;
                          y +=10;
                          newArr2.push(txtHtml)
                        } else {
                          let x=10+(i-1)*12,y=10+i*12;
                          let txtHtml=`<div class="txt-not-header">${yyy.substring(x,y)}</div>`
                          newArr2.push(txtHtml)
                        }
                      }
                    }
                    //console.log(newArr2);
                    let newArr3=[];
                    for (let i = 0; i < newArr2.length/14; i++) {
                      newArr3[i]=(newArr2.slice(i*14,(i+1)*14))
                    }
                    //console.log(newArr3);
                    selfVue.newHtmlArr=newArr3;
                    //console.log(selfVue.newHtmlArr);
                    let aWidth = $('#magazine').width();
                    let aHeight = $('#magazine').height();
                    //$("#magazine").turn("destroy").remove();
                    selfVue.$nextTick(() => {
                      //$("#magazine").turn("destroy");

                      $('#magazine').turn({
                        width: aWidth,
                        height: aHeight,
                        display: "single",//单双页
                        acceleration: true,
                        autoCenter: false,
                        gradients: true,
                        disable: false,
                        duration:200,
                        when: {
                          turning: function(event, page, pageObject) {
                            // Implementation
                            //console.log(page);
                            selfVue.loadCurrentPage=page;
                          }
                        }
                      });
                    });
                    //#endregion
                    setTimeout(() => {
                      let index=selfVue.page-(selfVue.pageVal-1)*100;
                      selfVue.toChapterMui(selfVue.title,index);
                      //document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop = 0
                    }, 200);
                    //console.log(this.bodyText)
                  }
                }
              });
            })
          }
        }
        let novel=new getNovel();
      }
    },
    created() {
      setTimeout(() => {
        this.novel();
      }, 80);
      let that=this;
      this.$mui.back = function() {//从书架返回到娱乐页面
        that.$router.push('/Novel/NovelBookshelf')
      };
      setTimeout(() => {
        //document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop=0
      }, 100);
    },
    mounted(){
      //this.bgImages=bgImgs;
      //this.theDraggabilly();
      this.bookReadIndex();
      axios.get('https://raw.githubusercontent.com/czy19950220/study/master/src/assets/js/bgImg.json').then((response) => {
        //console.log(response.data);
        this.bgImages=response.data.bgImg;
      });
      //this.openFullScreen();
      //this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    beforeRouteLeave(to,from,next){
      this.firstLoad=true;
      next();
    }
  }
</script>

<style scoped>
  /*#region*/
  /*仿真读书设置*/
  .novel-page{
    background-color: #fff;
  }
  #magazine{
    height: 100% !important;
    width: 100%;
  }
  .book-con{
    background-color: white;
  }
  .book-con div{
    font-size: 28px;
    line-height: 1.5;
    text-align: left;
    text-indent: 2em;
  }
  .txt-header{
    text-indent: 2em;
    text-align: left;
    line-height: 1.5;
  }
  .txt-not-header{
    text-align: left;
    line-height: 1.5;
  }
  #magazine.shadow{
    -webkit-box-shadow: 0 4px 10px #666;
    -moz-box-shadow: 0 4px 10px #666;
    -ms-box-shadow: 0 4px 10px #666;
    -o-box-shadow: 0 4px 10px #666;
    box-shadow: 0 4px 10px #666;
  }
  /*#endregion*/
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
