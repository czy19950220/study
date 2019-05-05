<template>
  <div id="app" :style="{fontFamily:myFontFamily}">
    <router-view/>
  </div>
</template>

<script>
  require ('./assets/font/font.css');
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'App',
    data(){
      return{

      }
    },
    computed: {
      ...mapGetters([
        'myFontFamily'
      ])
    },
    methods:{
      ...mapActions([
        'myFontFamilyChange'
      ]),
      font(){
        let myFont = localStorage.getItem("fontFamily");
        if (myFont==null || myFont=='' || myFont==undefined){
          localStorage.setItem("fontFamily",'unset');//默认汉仪细行楷...
        } else {
          this.myFontFamilyChange(myFont);
        }
      }
    },
    mounted(){
      this.font();
    },
    created(){
      document.body.removeChild(document.getElementById('Loading'));

    }
  }
</script>

<style lang="less">
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-family: unset;
  }
</style>
