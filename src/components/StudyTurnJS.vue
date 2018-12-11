<template>
  <div id="turn-study">

    <div id="magazine" dir="ltr">
      <div class="book-con">
        <div data-v-05f654f2="" class="precon" style="font-size: 28px; font-family: unset;">
          时值2月，冬日里的晚霞由西边向整个世界蔓延，寂静的红色像是一层油画的涂料，把所有行人身上都换了一种颜色。
        </div>
      </div>
      <div class="book-con">bbbbbb</div>
      <div class="book-con">ccccc</div>
      <div class="book-con">ddddd</div>
      <div class="book-con">eeeee</div>
      <div class="book-con">fffffff</div>
    </div>
  </div>
</template>

<script>
  import './../assets/js/turn.min'

  export default {
    name: "StudyTurnJS",
    mounted() {
      let aWidth = $('#turn-study').width();
      let aHeight = $('#turn-study').height();
      this.$nextTick(() => {
        $('#magazine').turn({
          width: aWidth,
          height: aHeight,
          display: "single",//单双页
          acceleration: true,
          autoCenter: false,
          gradients: true,
          disable: false,
        });
      });
    },
    created() {

    }
  }
</script>

<style scoped>
  #turn-study {
    height: calc(100% - 90px);
    width: 100%;
    margin-top: 40px;
    background-color: burlywood;
  }

  #magazine {
    width: 200px;
    height: 300px;
    background-color: #e1f3d8;
  }

  #magazine .turn-page {
    background-color: #ccc;
    background-size: 100% 100%;
  }

  .book-con {
    background-color: white;
  }
  .precon{
    line-height: 28px;
    text-indent: 2em;
  }
</style>
