<template>
  <div style="height: calc(100% - 20px);width: calc(100% - 0px);word-break: break-all;overflow-x: hidden;padding: 10px;padding-bottom: 0px">
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
    <h3 style="text-align: center">{{HtmlQuestion.title}}</h3>
    <div v-for="(data,index) in HtmlQuestion.datas" class="LiOne">
      {{index+1+"、"}}{{data.LiOne}}
      <div v-for="liTwo in data.LiTwo"class="LiTwo">
        <span class="css-circle"></span>&nbsp;&nbsp;{{liTwo}}<br>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Fuse from 'fuse.js'
  export default {
    name: "SummaryHtmlQuestion",
    data() {
      return {
        allData:[],
        restaurants: [],
        state3: '',
        HtmlQuestion:[

        ],
      }
    },
    methods:{
      //点击选择项
      handleSelect(item) {
        //console.log(item);
        this.state3=item.title;
        var data=this.allData;
        //判断是哪个，渲染相对应的代码
        for (var i = 0;i < data.length;i++){
          if (item.title == data[i].title){
            console.log(data[i].title);
            this.HtmlQuestion=data[i];
          }
        }
      },
      //点击输入框的图标，清空
      handleIconClick(ev) {
        //console.log(ev);
        this.state3="";
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
        var results=fuse.search(queryString);
        cb(results);
      },
      //框架自带的删选，暂不使用
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //加载内容
      loadQuestion() {
        //获取该页面需要的json文件
        var stat_time;
        $.ajax({
          url : this.GLOBAL.htmlJson,
          datatype: "json",
          async : false,
          data :{},
          success : function(result) {
            stat_time=result;
          }
        });
        //console.log(JSON.stringify(stat_time));
        //默认是第一个问题
        this.HtmlQuestion=stat_time.result[0];
        //循环加入title
        for (var i=0;i<stat_time.result.length;i++){
          //往输入提示框中push
          this.restaurants.push({"title":stat_time.result[i].title})
        }
        //真正的全部需要的数据
        this.allData=stat_time.result;
      },
    },
    mounted() {
      this.loadQuestion();
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到总结页面
        that.$router.push('/Summary/SummaryCells')
      };
    }
  }
</script>

<style scoped>
  .LiOne{
    text-indent: 2em;
    width: 100%;
  }
  .LiTwo{
    text-indent: 2em;
    font-family: "Adobe 仿宋 Std R";
    height: 26px;
    width: 100%;
    line-height: 26px;
    float: left;
    height: 50%;
    margin-bottom: -3px;
  }
  .css-circle{
    clear: both;
    position: relative;
    width: 6px;
    height: 6px;
    display: inline-block;
    background-color: black;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
  .inline-input{
    width: 100%;
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .highlighted .addr {
    color: #ddd;
  }
</style>
