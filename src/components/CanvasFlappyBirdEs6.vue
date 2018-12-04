<template>
  <div id="body">
    <canvas id="canvas-three" ref="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: "CanvasFlappyBirdEs6",
    data(){
      //studyEs6();
      return{

      }
    },
    mounted(){
      studyEs6();
    },
    created(){
      let that=this;
      this.$mui.back = function() {//从书架返回到学习页面
        that.$router.push('/Study/Cells')
      };
    }
  }
  function studyEs6(){
    //游戏
    class Game{
      constructor(){
        //帧
        this.fno=0;
        //获取画布
        this.canvas=document.getElementById(params.id);
        //上下文
        this.ctx=this.canvas.getContext("2d");
        this.RjsonUrl=params.Rjson;
        //画布宽高设置
        this.init();
        //读取资源
        var that=this;
        this.loadAllResource(function () {
          that.start();
        });

      }
      //初始化设置画布宽高
      init(){
        let windowWidth=document.documentElement.clientWidth;
        let windowHeight=document.documentElement.clientHeight;
        if (windowWidth>414){
          windowWidth=414;
        } else if (windowWidth<320){
          windowWidth=320;
        }
        if (windowHeight>736){
          windowHeight=736;
        } else if (windowHeight<500){
          windowHeight=500;
        }
        this.canvas.width=windowWidth;
        this.canvas.height=windowHeight;
      }
      //资源加载
      loadAllResource(callback){
        //准备一个接收对象
        this.R={};
        let loading=0;
        let that=this;
        let xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function () {
          if (xhr.readyState == 4){
            //变成json对象
            var Images=JSON.parse(xhr.responseText);
            for (let i=0;i<Images.imgs.length;i++){
              that.R[Images.imgs[i].name]=new Image();
              that.R[Images.imgs[i].name].src=Images.imgs[i].url;
              //console.log(that.R[Images.imgs[i].name])
              that.R[Images.imgs[i].name].onload=function () {
                loading++;
                //console.log(loading)
                that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
                that.ctx.font="20px 宋体";
                that.ctx.fillText("正在加载第"+loading+"张",100,100);
                if (loading==Images.imgs.length){
                  console.log("加载完毕");
                  callback();
                }
              }
            }
          }
        };
        xhr.open("get",this.RjsonUrl,true);
        xhr.send(null);
      }
      //开始
      start(){
        let that=this;
        this.background=new Background;
        this.land=new Land;
        this.bird=new Bird;
        //分数
        this.score=0;
        that.bird.birdFly();
        //管子
        this.pipeArr=[];
        this.timer=setInterval(function () {
          that.fno++;

          that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);

          //背景更新.
          that.background.update();
          //背景渲染
          that.background.render();
          //大地更新
          that.land.update();
          //大地渲染
          that.land.render();
          //管子
          for (let i = 0; i < that.pipeArr.length; i++) {
            that.pipeArr[i] && that.pipeArr[i].update();
            that.pipeArr[i] && that.pipeArr[i].render();
          }
          if (that.fno % 100==0) {
            new Pipe;
          }
          //小鸟
          that.bird.update();
          that.bird.render();
          //打印分数
          let socreLength=that.score.toString().length;
          for (let i = 0; i < socreLength; i++) {
            that.ctx.drawImage(that.R["number"+that.score.toString().charAt(i)],that.canvas.width/2 - socreLength/2*34 +34*i,100);
          }
          //帧
          game.ctx.fillStyle="#fff";
          that.ctx.fillText("Fno:"+that.fno,20,20);
        },20);
      }
    }
    //背景
    class Background{
      constructor(){
        this.image = game.R.bg_day;
        this.y=0.75*game.canvas.height - 396;
        //图片的宽高
        this.w=288;
        this.h=512;
        this.x=0;
        //速度
        this.speed=1;
      }
      render(){
        //渲染图片
        game.ctx.drawImage(this.image,this.x,this.y);
        game.ctx.drawImage(this.image,this.x+this.w,this.y);
        game.ctx.drawImage(this.image,this.x+this.w*2,this.y);
        //渲染上边缺少的天空
        game.ctx.fillStyle="#4ec0ca";
        game.ctx.fillRect(0,0,game.canvas.width,this.y + 5);
        //渲染下边缺少的草地
        game.ctx.fillStyle="#5ee270";
        game.ctx.fillRect(0,this.y+this.h-5,game.canvas.width,game.canvas.height-this.y-this.h+5);
      }
      update(){
        this.x-=this.speed;
        this.x= this.x<-this.w ? 0: this.x;
      }
    }
    //大地
    class Land{
      constructor(){
        this.image=game.R.land;
        this.y=0.78*game.canvas.height;
        this.x=0;
        this.h=112;
        this.speed=2;
        this.w=336;
      }
      render(){
        game.ctx.drawImage(this.image,this.x,this.y);
        game.ctx.drawImage(this.image,this.x+this.w,this.y);
        game.ctx.drawImage(this.image,this.x+this.w*2,this.y);
        //渲染下边缺少的大地
        game.ctx.fillStyle="#DED895";
        game.ctx.fillRect(0,this.y+this.h,game.canvas.width,game.canvas.height*0.26-this.h);
      }
      update(){
        this.x-=this.speed;
        this.x= this.x<-this.w ? 0: this.x;
      }
    }
    //管子
    class Pipe{
      constructor(){
        //图片高宽
        this.h=320;
        this.w=52;
        //开口向上
        this.pipeUp=game.R.pipe_up;
        //开口向下
        this.pipeDown=game.R.pipe_down;
        //总高度=上面管子+空隙+下面管子
        this.allHeight=game.canvas.height*0.78;
        //空隙
        this.intersperse=180;
        //上面的管子（口往下）高度..
        this.downHeight=100+parseInt(Math.random()*(this.h-100-60));
        //下面的管子（口上往）高度.
        this.upHeight=this.allHeight-this.intersperse-this.downHeight;
        this.x=game.canvas.width;
        this.isCross=false;
        game.pipeArr.push(this);
      }
      render(){
        //drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
        /*img	规定要使用的图像、画布或视频。
          sx	可选。开始剪切的 x 坐标位置。
          sy	可选。开始剪切的 y 坐标位置。
          swidth	可选。被剪切图像的宽度。
          sheight	可选。被剪切图像的高度。
          x	在画布上放置图像的 x 坐标位置。
          y	在画布上放置图像的 y 坐标位置。
          width	可选。要使用的图像的宽度。（伸展或缩小图像）
          height	可选。要使用的图像的高度。（伸展或缩小图像）
          */
        game.ctx.drawImage(this.pipeDown,0,this.h-this.downHeight,this.w,this.downHeight,this.x,0,this.w,this.downHeight);
        game.ctx.drawImage(this.pipeUp,0,0,this.w,this.upHeight,this.x,this.downHeight+this.intersperse,this.w,this.upHeight)
      }
      update(){
        this.x-=2;
        if (game.bird.birdR > this.x && game.bird.birdL<this.x+52) {
          if (game.bird.birdT<this.downHeight || game.bird.birdT> (this.downHeight+this.intersperse)){
            clearInterval(game.timer);
          }
        }
        //加分
        if (game.bird.birdR>this.x+52 && !this.isCross){
          game.score++;
          this.isCross=true;
        }
        //检测并删除多余管子
        if (this.x<-52){
          for (let i = 0; i < game.pipeArr.length; i++) {
            if (game.pipeArr[i]===this){
              game.pipeArr.splice(i,1);
            }
          }
        }
      }
    }
    //小鸟
    class Bird{
      constructor(){
        this.color=parseInt(Math.random()*3);
        //小鸟颜色数组
        this.birdArr=[
          game.R["bird"+this.color+"_0"],
          game.R["bird"+this.color+"_1"],
          game.R["bird"+this.color+"_2"]
        ];
        this.wingStep=0;//翅膀
        //小鸟位置，图片为48*48
        this.x=game.canvas.width*(1-0.618)-24;
        this.y=100;
        //小鸟帧数
        this.birdFno=0;
        //角度
        this.d=-0.4;
        //是否向上飞
        this.fly=false;
      }
      render(){
        game.ctx.save();
        //将坐标系拉到小鸟的中心
        game.ctx.translate(this.x,this.y);
        game.ctx.rotate(this.d);
        game.ctx.drawImage(this.birdArr[this.wingStep],-24,-24);
        game.ctx.restore();

      }
      update(){
        //计算自己的四个碰撞值
        this.birdT=this.y-12;
        this.birdR=this.x+17;
        this.birdB=this.y+12;
        this.birdL=this.x-17;
        //飞
        let that =this;
        if (!this.fly){
          //不飞
          this.y +=this.birdFno*0.005;
        }else {
          //飞
          this.y -=(20-this.birdFno)*0.6;
          if (this.birdFno>20){
            that.fly=false;
            this.birdFno=0;
          }
        }
        this.birdFno++;
        this.d +=0.02;
        this.y +=this.birdFno*0.6;
        game.fno%5==0&&this.wingStep++;
        this.wingStep=this.wingStep>2? 0:this.wingStep;
        if (this.birdB>game.canvas.height*0.78){
          clearInterval(game.timer);
        }
        if (this.y<24){
          this.y=24;
        }
      }
      birdFly(){
        let that=this;
        game.canvas.onclick=function () {
          that.fly=true;
          that.d=-0.4;
          that.birdFno=0;
        }
        game.canvas.touchend=function () {
          that.fly=true;
          that.d=-0.4;
          that.birdFno=0;
        }
      }
    }
    var params={
      id:"canvas-three",
      Rjson:'https://czy-1257069199.cos.ap-beijing.myqcloud.com/my-app/flappybird/B2.json'
    };
    var game=new Game(params);
  }
</script>

<style scoped>
  #body{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
