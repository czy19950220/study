import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Study from '@/views/Study'
import Summary from '@/views/Summary'

Vue.use(Router)

export default new Router({
  routes: [
    {
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
    },{
      path: '/Study',
      name: '/Study',
      component : Study,
      redirect:'/Study/Cells',
      children:[
        {
          path: 'Cells',
          name: 'Cells',
          component : resolve => require(['@/components/Cells.vue'],resolve)
        },{
          path: 'PullDown',
          name: 'PullDown',
          component : resolve => require(['@/components/PullDown.vue'],resolve)
        },{
          path: 'PullUp',
          name: 'PullUp',
          component : resolve => require(['@/components/PullUp.vue'],resolve)
        },{
          path: 'CanvasBall',
          name: 'CanvasBall',
          component : resolve => require(['@/components/CanvasBall.vue'],resolve)
        },{
          path: 'CanvasFlappyBirdEs6',
          name: 'CanvasFlappyBirdEs6',
          component : resolve => require(['@/components/CanvasFlappyBirdEs6.vue'],resolve)
        },{
          path: 'VR',
          name: 'VR',
          component : resolve => require(['@/components/VR.vue'],resolve)
        },{
          path: 'QRImage',
          name: 'QRImage',
          component : resolve => require(['@/components/QRImage.vue'],resolve)
        }
      ]
    },{
      path: '/Summary',
      name: '/Summary',
      component : Summary,
      redirect:'/Summary/SummaryCells',
      children:[
        {
          path: 'SummaryCells',
          name: 'SummaryCells',
          component : resolve => require(['@/components/SummaryCells.vue'],resolve)
        },{
          path: 'SummaryHtmlQuestion',
          name: 'SummaryHtmlQuestion',
          component : resolve => require(['@/components/SummaryHtmlQuestion.vue'],resolve)
        },{
          path: 'SummaryJSQuestion',
          name: 'SummaryJSQuestion',
          component : resolve => require(['@/components/SummaryJSQuestion.vue'],resolve)
        }
      ]
    },
  ]
})
