import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Study from '@/views/Study'
import Summary from '@/views/Summary'
import Entertainment from '@/views/Entertainment'
import Novel from '@/views/Novel'
import NovelDev from '@/views/NovelDev'
import NovelTongYong from '@/views/NovelTongYong'
import MovieOne from '@/Movie/MovieOne'

Vue.use(Router)

export default new Router({
  routes: [
    {//首页
      path: '/',
      name: 'Index',
      component:Index,
      redirect:'/indexCV',
      children:[
        {
          path: 'indexCV',
          name: 'indexCV',
          component : resolve => require(['@/components/indexCV.vue'],resolve)
        }
      ]
    },{//学习
      path: '/Study',
      name: '/Study',
      component : Study,
      redirect:'/Study/Cells',
      children:[
        {
          path: 'Cells',
          name: 'Cells',
          component : resolve => require(['@/components/Cells.vue'],resolve)
        },{//下拉刷新
          path: 'PullDown',
          name: 'PullDown',
          component : resolve => require(['@/components/PullDown.vue'],resolve)
        },{//上拉刷新
          path: 'PullUp',
          name: 'PullUp',
          component : resolve => require(['@/components/PullUp.vue'],resolve)
        },{//小球canvas
          path: 'CanvasBall',
          name: 'CanvasBall',
          component : resolve => require(['@/components/CanvasBall.vue'],resolve)
        },{//像素鸟
          path: 'CanvasFlappyBirdEs6',
          name: 'CanvasFlappyBirdEs6',
          component : resolve => require(['@/components/CanvasFlappyBirdEs6.vue'],resolve)
        },{//VR视角图
          path: 'VR',
          name: 'VR',
          component : resolve => require(['@/components/VR.vue'],resolve)
        },{//动态生成二维码
          path: 'QRImage',
          name: 'QRImage',
          component : resolve => require(['@/components/QRImage.vue'],resolve)
        }
      ]
    },{//总结
      path: '/Summary',
      name: 'Summary',
      component : Summary,
      redirect:'/Summary/SummaryCells',
      children:[
        {
          path: 'SummaryCells',
          name: 'SummaryCells',
          component : resolve => require(['@/components/SummaryCells.vue'],resolve)
        },{//HTML问题总结
          path: 'SummaryHtmlQuestion',
          name: 'SummaryHtmlQuestion',
          component : resolve => require(['@/components/SummaryHtmlQuestion.vue'],resolve)
        },{//js问题总结
          path: 'SummaryJSQuestion',
          name: 'SummaryJSQuestion',
          component : resolve => require(['@/components/SummaryJSQuestion.vue'],resolve)
        }
      ]
    },{//娱乐
      path: '/Entertainment',
      name: 'Entertainment',
      component : Entertainment,
      redirect:'/Entertainment/EntertainmentCells',
      children:[
        {//娱乐cells页面
          path: 'EntertainmentCells',
          name: 'EntertainmentCells',
          component : resolve => require(['@/components/EntertainmentCells.vue'],resolve)
        }
      ]
    },{//小说
      path: '/Novel',
      name: 'Novel',
      component : Novel,
      redirect:'/Novel/NovelBookshelf',
      children:[
        {//书架
          path: 'NovelBookshelf',
          name: 'NovelBookshelf',
          component : resolve => require(['@/components/NovelBookshelf.vue'],resolve)
        },{//搜索书籍
          path: 'NovelSearch',
          name: 'NovelSearch',
          component : resolve => require(['@/components/NovelSearch.vue'],resolve)
        },{//书籍详情
          path: 'NovelDetail',
          name: 'NovelDetail',
          component : resolve => require(['@/components/NovelDetail.vue'],resolve)
        },{//阅读小说
          path: 'NovelReadTwo',
          name: 'NovelReadTwo',
          component : resolve => require(['@/components/NovelReadTwo.vue'],resolve)
        },{//阅读小说
          path: 'NovelReadThree',
          name: 'NovelReadThree',
          component : resolve => require(['@/components/NovelReadThree.vue'],resolve)
        }
      ]
    },{//小说
      path: '/NovelDev',
      name: 'NovelDev',
      component : NovelDev,
      redirect:'/NovelDev/NovelBookshelfDev',
      children:[
        {//书架
          path: 'NovelBookshelfDev',
          name: 'NovelBookshelfDev',
          component : resolve => require(['@/components/NovelBookshelflDev.vue'],resolve)
        },{//搜索
          path: 'NovelSearchDev',
          name: 'NovelSearchDev',
          component : resolve => require(['@/components/NovelSearchDev.vue'],resolve)
        },{//书籍详情
          path: 'NovelDetailDev',
          name: 'NovelDetailDev',
          component : resolve => require(['@/components/NovelDetailDev.vue'],resolve)
        },{//书籍阅读
          path: 'NovelReadTwoDev',
          name: 'NovelReadTwoDev',
          component : resolve => require(['@/components/NovelReadTwoDev.vue'],resolve)
        },{//阅读小说
          path: 'NovelRead',
          name: 'NovelRead',
          component : resolve => require(['@/components/NovelRead.vue'],resolve)
        },{//阅读小说翻页模式最终版
          path: 'NovelReadDevThree',
          name: 'NovelReadDevThree',
          component : resolve => require(['@/components/NovelReadDevThree.vue'],resolve)
        }
      ]
    },{//小说通用
      path: '/NovelTongYong',
      name: 'NovelTongYong',
      component : NovelTongYong,
      redirect:'/NovelTongYong/NovelBookShelfCurrency',
      children:[
        {//书架
          path: 'NovelBookShelfCurrency',
          name: 'NovelBookShelfCurrency',
          component : resolve => require(['@/CurrencyNovel/NovelBookShelfCurrency.vue'],resolve)
        },{//搜索
          path: 'NovelSearchCurrency',
          name: 'NovelSearchCurrency',
          component : resolve => require(['@/CurrencyNovel/NovelSearchCurrency.vue'],resolve)
        },{//详情
          path: 'NovelDetailCurrency',
          name: 'NovelDetailCurrency',
          component : resolve => require(['@/CurrencyNovel/NovelDetailCurrency.vue'],resolve)
        },{//滑动阅读
          path: 'NovelReadCurrency',
          name: 'NovelReadCurrency',
          component : resolve => require(['@/CurrencyNovel/NovelReadCurrency.vue'],resolve)
        },{//翻页阅读
          path: 'NovelReadTwoCurrency',
          name: 'NovelReadTwoCurrency',
          component : resolve => require(['@/CurrencyNovel/NovelReadTwoCurrency.vue'],resolve)
        }
      ]
    },{//电影http://t.cn/REDKdpV
      path: '/MovieOne',
      name: 'MovieOne',
      component : MovieOne
    }
  ]
})
