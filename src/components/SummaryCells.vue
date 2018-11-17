<template>
  <!--总结页面cells-->
  <div>
    <mt-cell
      title="HTML总结"
      to="/Summary/SummaryHtmlQuestion"
      is-link
      value="">
    </mt-cell>
    <mt-cell
      title="JS总结"
      to="/Summary/SummaryJSQuestion"
      is-link
      value="">
    </mt-cell>
    <mt-cell
    title="HTML总结"
    to="/Summary/SummaryHtmlQuestion"
    is-link
    value="">
  </mt-cell>
  </div>
</template>

<script>
  export default {
    name: "SummaryCells",
    data() {
      return {

      };
    },
    computed: {

    }
  }
</script>

<style scoped>
  .page-search {
    height: 50px;
    z-index: 10;
  }
</style>


