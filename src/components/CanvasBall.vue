<template>
  <div id="body">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: "CanvasBall",
    methods:{
      reSize(){
        var canvasOne=document.getElementById("canvas");
        window.onresize = function(){
          canvasOne.width = canvasOne.clientWidth
          canvasOne.height = canvasOne.clientHeight
        };
      },
      ball(){
        var canvasOne=document.getElementById("canvas");
        var ctx=canvasOne.getContext("2d");
        //设置画布宽高
        canvasOne.width=document.documentElement.clientWidth;
        canvasOne.height=document.documentElement.clientHeight;
        function qiu(x,y) {
          this.x=x;//圆心x
          this.y=y;//圆心y
          this.r=30;//半径
          //颜色
          this.color="rgba("+parseInt(Math.random()*256)+","
            +parseInt(Math.random()*256)+","+
            parseInt(Math.random()*256)+","+0.5+")";
          this.dx=parseInt(Math.random()*10)-5;//x运动值
          this.dy=parseInt(Math.random()*10)-5;//y运动值
          qiuArr.push(this);
        }
        qiu.prototype.rander=function () {
          ctx.beginPath();
          ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
          ctx.closePath();
          ctx.fillStyle=this.color;
          ctx.fill();
        };
        qiu.prototype.update=function () {
          this.x +=this.dx;
          this.y +=this.dy;
          this.r--;
          //如果半径是零，从数组清除
          if(this.r<0){
            this.clear();
          }
        };
        //清除
        qiu.prototype.clear=function () {
          for (var i=0;i<qiuArr.length;i++) {
            if (qiuArr[i]===this) {
              qiuArr.splice(i,1);
            }
          }
        };
        var qiuArr=[];
        canvasOne.onmousemove=function(event){
          new qiu(event.clientX,event.clientY);
        };
        canvasOne.ontouchmove=function(event){
          var touch = event.targetTouches[0];
          new qiu(touch.pageX,touch.pageY);
        };
        setInterval(function () {
          ctx.clearRect(0,0,canvasOne.width,canvasOne.height);
          for (var i=0;i<qiuArr.length;i++){
            qiuArr[i].update();
            //因为如果半径小于零，update可能会删除小球，验证一下是否存在
            qiuArr[i]&&qiuArr[i].rander();
          }
        },20);
      }
    },
    mounted(){
      this.ball();
      this.reSize();
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到学习页面
        that.$router.push('/Study/Cells')
      };
    }
  }
</script>

<style scoped>
  #body{
    height: 100%;
    width: 100%;
    background-color: black !important;
  }
  canvas{
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
