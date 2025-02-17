<script setup>
import {ref, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  HeartOutlined,
  DownOutlined,
  ExperimentOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

// 响应式的 selectedKeys 用于绑定到菜单
const selectedKeys = ref([route.name || ''])

const menuItems = [
  {
    key: 'dashboard',
    icon: HomeOutlined, // 直接传入组件
    label: '首页',
    path: '/'
  },
  {
    key: 'pets',
    icon: HeartOutlined, // 直接传入组件
    label: '病史管理',
    path: '/petsManage'
  },
  {
    key: 'customersManage',
    icon: TeamOutlined, // 直接传入组件
    label: '客户管理',
    path: '/customersManage'
  },
  {
    key: 'appointmentsManage',
    icon: CalendarOutlined, // 直接传入组件
    label: '预约管理',
    path: '/appointmentsManage'
  },
  {
    key: 'medicalManage',
    icon: MedicineBoxOutlined, // 直接传入组件
    label: '就诊管理',
    path: '/medicalManage'
  },
  {
    key: 'doctorManage',
    icon: ExperimentOutlined, // 直接传入组件
    label: '医生管理',
    path: '/doctorManage'
  },
  {
    key: 'statistics',
    icon: PieChartOutlined, // 直接传入组件
    label: '统计报表',
    path: '/statistics'
  },
  {
    key: 'messages',
    icon: BellOutlined, // 直接传入组件
    label: '消息通知',
    path: '/messages'
  },
  {
    key: 'appointment',
    icon: CalendarOutlined, // 直接传入组件
    label: '预约看病',
    path: '/appointment'
  },
  {
    key: 'myAppointment',
    icon: CalendarOutlined, // 直接传入组件
    label: '我的预约',
    path: '/myAppointment'
  },
  {
    key: 'medicalRecord',
    icon: MedicineBoxOutlined, // 直接传入组件
    label: '就诊记录',
    path: '/medicalRecord'
  },
]

// 监听路由变化，更新 selectedKeys
watch(() => route.name, (newName) => {
  selectedKeys.value = [newName || '']
})

const handleMenuClick = (item) => {
  const menuItem = menuItems.find(i => i.key === item.key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">宠物医院管理系统</div>
      <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="inline"
          @click="handleMenuClick"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <template #icon>
            <component :is="item.icon"/>
          </template>
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout style="width: 100%">
      <a-layout-header style="background: #fff; padding: 0">
        <a-row justify="end" :style="{ paddingRight: '24px' }">
          <a-space>
            <a-badge :count="5">
              <a-button type="text">
                <template #icon>
                  <BellOutlined/>
                </template>
              </a-button>
            </a-badge>
            <a-dropdown>
              <a-button type="text">
                管理员
                <DownOutlined/>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>个人设置</a-menu-item>
                  <a-menu-item>退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </a-row>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <div style="width: 100%; background: #fff">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
.ant-layout {
  width: 100% !important;
}

.ant-layout-content {
  width: 100% !important;
}

.ant-layout-content > div {
  width: 100% !important;
}

.logo {
  height: 32px;
  margin: 16px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}
</style>