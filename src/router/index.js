import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/company',
      name: 'company',
      component: () => import('../views/CompanyView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/ProductView.vue')
    },
    {
      path: '/product/:id',
      name: 'productDetail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/model',
      name: 'model',
      component: () => import('../views/ModelView.vue')
    },
    {
      path: '/requirement',
      name: 'requirement',
      component: () => import('../views/RequirementView.vue')
    },
    {
      path: '/requirement/:id',
      name: 'requirementDetail',
      component: () => import('../views/RequirementDetailView.vue')
    },
    {
      path: '/iteration',
      name: 'iteration',
      component: () => import('../views/IterationView.vue')
    },
    {
      path: '/iteration/:id',
      name: 'iterationDetail',
      component: () => import('../views/IterationDetailView.vue')
    },
    {
      path: '/task',
      name: 'task',
      component: () => import('../views/TaskView.vue')
    },
    {
      path: '/task/:id',
      name: 'taskDetail',
      component: () => import('../views/TaskDetailView.vue')
    },
    {
      path: '/defect',
      name: 'defect',
      component: () => import('../views/DefectView.vue')
    },
    {
      path: '/testCase/:id',
      name: 'testCaseDetail',
      component: () => import('../views/TestCaseDetailView.vue')
    },
    {
      path: '/bug/:id',
      name: 'bugDetail',
      component: () => import('../views/BugDetailView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    }
  ]
})

export default router
