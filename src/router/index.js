import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Study from '@/views/Study'
import Summary from '@/views/Summary'
import Entertainment from '@/views/Entertainment'
import Novel from '@/views/Novel'

Vue.use(Router)

export default new Router({
  routes: [
    {//首页
      path: '/',
      name: 'Index',
      component:Index,
      children:[
        /*{
          path: 'PullDown',
          name: 'PullDown',
          component : resolve => require(['@/components/PullDown.vue'],resolve)
        },{
          path: 'PullUp',
          name: 'PullUp',
          component : resolve => require(['@/components/PullUp.vue'],resolve)
        }*/
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
      name: '/Summary',
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
      name: '/Entertainment',
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
      name: '/Novel',
      component : Novel,
      redirect:'/Novel/NovelBookshelf',
      children:[
        {//书架
          path: 'NovelBookshelf',
          name: 'NovelBookshelf',
          component : resolve => require(['@/components/NovelBookshelf.vue'],resolve)
        }
      ]
    }
  ]
})
