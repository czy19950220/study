<template>
  <div style="height:100%;">
    <div style="padding:2px 10px 0;width: calc(100% - 20px);word-break: break-all;overflow-x: hidden;">
        <el-row class="demo-autocomplete">
          <el-col :span="24">
            <el-autocomplete
              style="width: 100%"
              popper-class="my-autocomplete"
              v-model="state3"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="true"
              @select="handleSelect">
              <i
                class="el-icon-edit el-input__icon"
                slot="suffix"
                @click="handleIconClick">
              </i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.title }}</div>
              </template>
            </el-autocomplete>
          </el-col>
        </el-row>
        <el-row>
          <el-button v-on:click="destroy()" id="destroy">Destroy</el-button>
          <el-button v-on:click="init()">Init</el-button>
          <el-button v-on:click="gethtml()">gethtml</el-button>
        </el-row>
        <div id="froala-editor" :tag="'textarea'" :config="config" v-model="model" v-if="seen">
        </div>
        <div id="preview" class="fr-view" v-model="model" v-if="relseen" style="padding-left: 10px">
        </div>
      </div>
    <!--<textarea>{{json}}</textarea>-->
  </div>

</template>

<script>
  import axios from 'axios'
  import {JsJson} from './../assets/js/jsTwo'
  import Fuse from 'fuse.js'

  export default {
    components: {

    },
    name: "SummaryJSQuestion",
    data() {
      return {
        json: [],
        state3: '',//输入框内容
        restaurants: [],//获取到的输入框提示
        allData: [],//存储获取到的json
        seen: true,//编辑器视图
        relseen: false,//摧毁编辑器的视图
        model: '在这里编辑',//提示内容
        config: {//froala配置
          theme: 'royal',
          events: {
            'froalaEditor.initialized': function () {
              console.log('initialized')
            }
          }
        },
      }
    },
    methods: {
      //点击选择项
      handleSelect(item) {
        //console.log(item);
        this.state3 = item.title;
        var data = this.allData;
        var that = this;
        //判断是哪个，渲染相对应的代码
        for (var i = 0; i < data.length; i++) {
          if (item.title == data[i].title) {
            //console.log(data[i].title);
            //console.log(data[i].html);
            var clickTag = 0;
            if (clickTag == 0) {
              var html = data[i].html;
              clickTag = 1;
              setTimeout(function () {
                that.resetHtml(html);
                clickTag = 0;
              }, 100);
            }
          }
        }
      },
      //点击输入框的图标，清空
      handleIconClick(ev) {
        //console.log(ev);
        this.state3 = "";
      },
      //搜索输入框对应的选项
      querySearch(queryString, cb) {
        //全部的选项
        var books = this.restaurants;
        //按照那个进行删选，并分配权重
        var options = {
          keys: [{
            name: 'title',
            weight: 1
          }]
        };
        //创建新的删选
        var fuse = new Fuse(books, options);
        //实施删选
        var results = fuse.search(queryString);
        cb(results);
      },
      //框架自带的删选，暂不使用
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //启动编辑器
      init() {
        if (!$('div#froala-editor').data('froala.editor')) {
          $('div#froala-editor').froalaEditor({
            language: 'zh_cn',
            heightMin: 400,
            imageUpload: true,
            theme: 'royal',
            /*imageUploadURL: 'http://192.168.100.135:3003/froala/upload_images',
            imageUploadMethod:"POST",
            imageUploadRemoteUrls:true,
            imageUploadParams : {id: "edit"},
            imageManagerDeleteURL: 'http://192.168.100.135:3003/froala/deleteImage',
            imageManagerLoadURL: 'http://192.168.100.135:3003/froala/listpic',
            imageManagerDeleteMethod : 'POST',
            fileUploadURL: 'http://192.168.100.135:3003/froala/uploadfile',*/
            fileAllowedTypes: ['*'],
            fileMaxSize: 1024 * 1024 * 1024 * 10,       //文件上传大小最大10g
            tableStyles: {
              class1: 'Class 1',
              class2: 'Class 2',
              class3: 'Class 3'
            }
          });
          this.seen = true;
          this.relseen = false;
        }
      },
      //摧毁编辑器
      destroy() {
        if ($('div#froala-editor').data('froala.editor')) {
          $('div#froala-editor').froalaEditor('destroy');
        }
        this.seen = false;
        this.relseen = true;
      },
      //获取HTML代码
      gethtml() {
        //$('#froala-editor').froalaEditor('html.set', this.htmlChange);
        var html = $('#froala-editor').froalaEditor('html.get');
        //console.log(this.htmlUrl +':'+html)
        //console.log(html);
        let params = {html: html, title: this.state3};
        axios.post(this.GLOBAL.serverIp + "test", params).then((res) => {
          console.log(params);
          console.log(res.data);
        }).catch(error => {
          console.log(error);
        });
        console.log(html)
      },
      //重新设置HTML代码来切换内容
      resetHtml(x) {
        setTimeout(function () {
          $('div#froala-editor').froalaEditor({
            language: 'zh_cn',
            heightMin: 400,
            imageUpload: true,
            theme: 'royal',
            fileAllowedTypes: ['*'],
            fileMaxSize: 1024 * 1024 * 1024 * 10,       //文件上传大小最大10g
            tableStyles: {
              class1: 'Class 1',
              class2: 'Class 2'
            }
          });
          this.seen = true;
          this.relseen = false;
          $('div#froala-editor').froalaEditor('html.set', x);
        }, 1);
        setTimeout(function () {
          if ($('div#froala-editor').data('froala.editor')) {
            $('div#froala-editor').froalaEditor('destroy');
          }
          this.seen = false;
          this.relseen = true;
        }, 10)
        //console.log(x)
      },
      //获取详情
      getDetail(som) {
        //console.log(this.htmlUrl)
        var that = this;
        var clickTag = 0;
        if (clickTag == 0) {
          clickTag = 1;
          that.dis = true;
          //alert(1)
          setTimeout(function () {
            that.resetHtml();
            clickTag = 0;
          }, 100);
        }
      },
      getJson() {
        var that = this;
        var stat_time;
        stat_time = JsJson;
        //console.log(JSON.stringify(stat_time));
        //默认是第一个问题
        that.HtmlQuestion = stat_time;
        //循环加入title
        for (var i = 0; i < stat_time.length; i++) {
          //往输入提示框中push
          that.restaurants.push({"title": stat_time[i].title})
        }
        //真正的全部需要的数据
        that.allData = stat_time;
        //console.log(that.allData)
        //console.log(that.restaurants)
      }
    },
    mounted() {
      this.getJson();
      this.init();
      $('div#froala-editor').froalaEditor()
        .on('froalaEditor.contentChanged', function (e, editor) {
          $('#preview').html(editor.html.get());
        });
      var str = decodeURI(this.$route.hash)
      str = (str == '' || str == '#') ? ('路径1') : (str.replace("#", ""));//通过获取的hash获取相应的页面内容
      let that=this;
      this.$mui.back = function(){
        that.$mui.plusReady(function() {
          plus.runtime.quit();
        });
      }
    },
    created() {
      //console.log(JsJson)
      let params = {html: JsJson[0].html, title: JsJson[0].title};
      //this.json.push(params);
      //this.json.push(params);
      var that = this;
      /*axios.get(this.GLOBAL.serverIp+"test/testAll").then((res)=>{
        //console.log(res.data.result);
        //that.json=res.data.result.all;
      }).catch(error => {
        console.log(error);
      });*/
      this.$mui.back = function() {//从书架返回到总结页面
        that.$router.push('/Summary/SummaryCells')
      };
    }
  }
</script>

<style scoped>

</style>
