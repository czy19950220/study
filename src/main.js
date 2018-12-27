// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {store} from './store/store' //引入store.js
import $ from "jquery";//引入jquery
import global_ from './views/Global'//引用全局文件
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import DrawerLayout from 'vue-drawer-layout'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/display.css';
import 'element-ui/lib/theme-chalk/index.css';
import VueFroala from 'vue-froala-wysiwyg';
import Mui from 'vue-awesome-mui';
import 'vue-awesome-mui/mui/dist/css/mui.css'
import VueQriously from 'vue-qriously';//二维码
import FastClick from 'fastclick'


// mount with global
//vue-froala-wysiwyg
// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min');
// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css');
require('font-awesome/css/font-awesome.css');
require('froala-editor/css/froala_style.min.css');
require('froala-editor/js/languages/zh_cn.js');
require('froala-editor/css/themes/royal.css');
require('froala-editor/js/plugins/image.min.js');
require('froala-editor/css/plugins/image.css');
require('froala-editor/js/plugins/image_manager.min.js');
require('froala-editor/js/plugins/file.min.js');
require('froala-editor/js/plugins/table.min.js');
require('froala-editor/css/plugins/table.css');

require('es6-promise').polyfill();
Vue.prototype.GLOBAL = global_;//挂载到Vue实例上面
Vue.use(Mint);
Vue.use(VueAxios, axios);
Vue.use(DrawerLayout);
Vue.use(ElementUI);
Vue.use(VueFroala);
Vue.use(Mui);
Vue.use(VueQriously);

Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>'
})
