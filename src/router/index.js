import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'petsManage',
        name: 'pets',
        component: () => import('../views/petsManage/index.vue'),
        meta: { title: '病史管理' }
      },
      {
        path: 'customersManage',
        name: 'customersManage',
        component: () => import('../views/customersManage/index.vue'),
        meta: { title: '客户管理' }
      },
      {
        path: 'appointmentsManage',
        name: 'appointmentsManage',
        component: () => import('../views/appointmentsManage/index.vue'),
        meta: { title: '预约管理' }
      },
      {
        path: 'medicalManage',
        name: 'medicalManage',
        component: () => import('../views/medicalManage/index.vue'),
        meta: { title: '就诊管理' }
      },
      {
        path: 'doctorManage',
        name: 'doctorManage',
        component: () => import('../views/doctorManage/index.vue'),
        meta: { title: '医生管理' }
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('../views/statistics/index.vue'),
        meta: { title: '统计报表' }
      },
      {
        path: 'messages',
        name: 'messages',
        component: () => import('../views/messages/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: 'appointment',
        name: 'appointment',
        component: () => import('../views/appointment/index.vue'),
        meta: { title: '预约管理' }
      },
      {
        path: 'myAppointment',
        name: 'myAppointment',
        component: () => import('../views/myAppointment/index.vue'),
        meta: { title: '我的预约' }
      },
      {
        path: 'medicalRecord',
        name: 'medicalRecord',
        component: () => import('../views/medicalRecord/index.vue'),
        meta: { title: '就诊记录' }
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('../views/setting/index.vue'),
        meta: { title: '个人设置' }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
