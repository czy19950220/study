//vuex的代码模板，可以用来粘贴===>https://vuex.vuejs.org/zh/guide/state.html
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {//
    test: [
      {name: "张三", sex: "男"},
      {name: "李四", sex: "男"},
      {name: "王五", sex: "女"},
    ],
    userName: '',//用户名
    drawer: "关闭",
    bookDetail: '',//书籍详情
    myFontFamily:'unset',//字体
  },
  getters: {
    changeTest: (state) => {
      var changeTest = state.test.map(person => {
        return {
          name: '1、' + '姓名：' + person.name,
          sex: '性别：' + person.sex,
        }
      });
      return changeTest;
    },
    userName: (state) => {
      return state.userName;
    },
    drawer: (state) => {
      return state.drawer;
    },
    bookDetail: (state) => {
      return state.bookDetail;
    },
    myFontFamily: (state) => {
      return state.myFontFamily;
    }
  },
  mutations: {
    changeSex: (state, payload) => {
      state.test.forEach(person => {
        person.sex = person.sex + payload
      });
    },
    changeUserName: (state, payload) => {
      state.userName = payload;
    },
    changeDrawer: (state, payload) => {
      state.drawer = "开启";
    },
    changeDrawer2: (state, payload) => {
      state.drawer = "关闭";
    },
    bookDetailChange: (state, payload) => {
      state.bookDetail = payload;
    },
    myFontFamilyChange: (state, payload) => {
      state.myFontFamily = payload;
    }
  },
  actions: {
    changeSex: (context, payload) => {
      context.commit("changeSex", payload);
    },
    changeUserName: (context, payload) => {
      context.commit("changeUserName", payload);
    },
    changeDrawer: (context, payload) => {
      context.commit("changeDrawer", payload);
    },
    changeDrawer2: (context, payload) => {
      context.commit("changeDrawer2", payload);
    },
    bookDetailChange: (context, payload) => {
      context.commit("bookDetailChange", payload);
    },
    myFontFamilyChange: (context, payload) => {
      context.commit("myFontFamilyChange", payload);
    }
  }
});
