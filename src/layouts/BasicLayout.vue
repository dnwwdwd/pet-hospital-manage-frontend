<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
import myAxios from "../plugins/myAxios.js";
import { message } from "ant-design-vue";

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const user = ref({});

// 菜单项配置
const menuItems = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: '首页',
    path: '/',
    permission: 'admin'
  },
  {
    key: 'sicknessManage',
    icon: HeartOutlined,
    label: '病史管理',
    path: '/sicknessManage',
    permission: 'admin',
  },
  {
    key: 'customersManage',
    icon: TeamOutlined,
    label: '客户管理',
    path: '/customersManage',
    permission: 'admin'
  },
  {
    key: 'appointmentsManage',
    icon: CalendarOutlined,
    label: '预约管理',
    path: '/appointmentsManage',
    permission: 'admin'
  },
  {
    key: 'medicalManage',
    icon: MedicineBoxOutlined,
    label: '就诊管理',
    path: '/medicalManage',
    permission: 'admin'
  },
  {
    key: 'doctorManage',
    icon: ExperimentOutlined,
    label: '医生管理',
    path: '/doctorManage',
    permission: 'admin'
  },
  {
    key: 'statistics',
    icon: PieChartOutlined,
    label: '统计报表',
    path: '/statistics',
    permission: 'admin'
  },
  {
    key: 'appointment',
    icon: CalendarOutlined,
    label: '预约看病',
    path: '/appointment',
    permission: 'user'
  },
  {
    key: 'myAppointment',
    icon: CalendarOutlined,
    label: '我的预约',
    path: '/myAppointment',
    permission: 'user'
  },
  {
    key: 'medicalRecord',
    icon: MedicineBoxOutlined,
    label: '就诊记录',
    path: '/medicalRecord',
    permission: 'admin'
  },
  {
    key: 'µmyMedicalRecord',
    icon: MedicineBoxOutlined,
    label: '我的就诊',
    path: '/myMedicalRecord',
    permission: 'user'
  },
  {
    key: 'mySickness',
    icon: HeartOutlined,
    label: '我的病史',
    path: '/mySickness',
    permission: 'user',
  },
]

// 过滤后的菜单项
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => item.permission === user.value.userRole)
})

onMounted(async () => {
  const menuItem = menuItems.find(item => item.path === route.path)
  if (menuItem) {
    selectedKeys.value = [menuItem.key]
  }
  const res = await myAxios.get('/user/get/login')
  if (!res.data) {
    router.push('/user/login')
  }
  user.value = res.data
})

// 菜单选中逻辑
const selectedKeys = ref([route.name || ''])
watch(() => route.path, (newPath) => {
  const menuItem = menuItems.find(item => item.path === newPath)
  if (menuItem) {
    selectedKeys.value = [menuItem.key]
  }
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
        <a-menu-item v-for="item in filteredMenuItems" :key="item.key">
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
            <a-avatar
                shape="circle"
                :src="user.userAvatar"
            />
            <a-dropdown>
              <a-button type="text">
                {{ user.userName }}
                <DownOutlined/>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>个人设置</a-menu-item>
                  <a-menu-item @click="async () => {
                    const res = await myAxios.post('user/logout')
                    if (res.code === 0) {
                      message.success('退出登录成功')
                      router.push('/user/login')
                    }
                  }">退出登录</a-menu-item>
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