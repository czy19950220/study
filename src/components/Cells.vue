<template>
  <!--学习页面cells-->
  <div class="page-cell">
    <mt-cell
      title="下拉刷新"
      to="/Study/pullDown"
      is-link
      value="">
    </mt-cell>
    <mt-cell
      title="上拉刷新"
      to="/Study/pullUp"
      is-link
      value="">
    </mt-cell>
    <mt-cell
      title="简单的Canvas小球"
      to="/Study/CanvasBall"
      is-link
      value="">
    </mt-cell>
    <mt-cell
      title="FlappyBird"
      to="/Study/CanvasFlappyBirdEs6"
      is-link
      value="不完整版">
    </mt-cell>
    <mt-cell
      title="VR视角图"
      to="/Study/VR"
      is-link
      value="风景">
    </mt-cell>
    <mt-cell
      title="动态生成二维码"
      to="/Study/QRImage"
      is-link
      value="">
    </mt-cell>
  </div>
</template>

<script>
  export default {
    name: "Cells"
  }
</script>

<style scoped>

</style>
