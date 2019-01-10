<template>
  <!--娱乐页面cells-->
  <div>
    <mt-cell
      title="小说"
      to="/Novel/NovelBookshelf"
      is-link
      value="制作成APP后用这个">
    </mt-cell>
    <mt-cell
      title="小说"
      to="/NovelDev/NovelBookshelfDev"
      is-link
      value="本地DEV运行用这个">
    </mt-cell>
    <mt-cell
      title="小说"
      to="/NovelTongYong/NovelBookShelfCurrency"
      is-link
      value="通用，已做跨域处理">
    </mt-cell>
    <mt-cell
      title="电影"
      to="/MovieOne"
      is-link
      value="lirongyao.com/api/index.php">
    </mt-cell>
  </div>
</template>

<script>
  export default {
    name: "EntertainmentCells"
  }
</script>

<style scoped>

</style>
