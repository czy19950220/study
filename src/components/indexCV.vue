<template>
  <!--个人简历-->
  <div id="my-cv" style="background-size: 100% 100%">
    <el-row>
      <el-col :xs="24" :sm="8">
        <div class="grid-content bg-purple" id="capture">
          <img src="./../assets/imgs/books.png" alt="" class="avatar">
        </div>
      </el-col>
      <el-col :xs="24" :sm="16">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "indexCV",
    components: {

    },
    data() {
      return {
        imgSrc:'',
        img:''
      }
    },
    methods: {
      convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        this.imgSrc=image.src;
        $(`#my-cv`).css("background-image",`url(${image.src})`);
        return image;
      }
    },
    mounted() {
      /*html2canvas(document.querySelector("#capture")).then(canvas => {
        //document.body.appendChild(canvas)
        this.convertCanvasToImage(canvas);
      });*/
    },
    created() {

    }
  }
</script>

<style scoped>
  #my-cv {
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: auto;
  }

  .bg-purple {
    background: #006ea0;
    padding: 10px 0px;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .avatar {
    border-radius: 50%;
    display: block;
    margin: auto;
    box-shadow: 0 0 5px #ddd;
    transition: .5s;
    overflow: hidden;
    width: 13em;
    height: 13em;
    background-color: #fff;
    background-image: linear-gradient(45deg, #fdfdfd, #57afef);
    background-size: 100% 200%;
    background-position: 0 50%;
  }
</style>
