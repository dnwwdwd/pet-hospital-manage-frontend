<script setup>
import { ref, onMounted } from 'vue'
import { 
  UserOutlined, 
  HeartOutlined, 
  CalendarOutlined,
  DollarOutlined 
} from '@ant-design/icons-vue'

const statistics = ref({
  totalPets: 0,
  totalCustomers: 0,
  todayAppointments: 0,
  monthlyRevenue: 0
})

// 模拟获取数据
onMounted(() => {
  statistics.value = {
    totalPets: 256,
    totalCustomers: 180,
    todayAppointments: 15,
    monthlyRevenue: 25800
  }
})
</script>

<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <template #title>
            <HeartOutlined /> 宠物总数
          </template>
          <h2>{{ statistics.totalPets }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <UserOutlined /> 客户总数
          </template>
          <h2>{{ statistics.totalCustomers }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <CalendarOutlined /> 今日预约
          </template>
          <h2>{{ statistics.todayAppointments }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <DollarOutlined /> 本月营收
          </template>
          <h2>¥{{ statistics.monthlyRevenue }}</h2>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="12">
        <a-card title="最近预约">
          <a-table :columns="[
            { title: '宠物名称', dataIndex: 'petName' },
            { title: '主人', dataIndex: 'owner' },
            { title: '预约时间', dataIndex: 'time' },
            { title: '状态', dataIndex: 'status' }
          ]" :data-source="[
            { key: '1', petName: '球球', owner: '张三', time: '2025-02-15 14:30', status: '已确认' },
            { key: '2', petName: '咪咪', owner: '李四', time: '2025-02-15 15:00', status: '待确认' },
            { key: '3', petName: '旺旺', owner: '王五', time: '2025-02-15 16:30', status: '已确认' }
          ]" :pagination="false">
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="今日就诊">
          <a-table :columns="[
            { title: '宠物名称', dataIndex: 'petName' },
            { title: '主人', dataIndex: 'owner' },
            { title: '就诊项目', dataIndex: 'treatment' },
            { title: '状态', dataIndex: 'status' }
          ]" :data-source="[
            { key: '1', petName: '多多', owner: '赵六', treatment: '年度体检', status: '进行中' },
            { key: '2', petName: '花花', owner: '钱七', treatment: '疫苗接种', status: '待就诊' },
            { key: '3', petName: '贝贝', owner: '孙八', treatment: '皮肤病治疗', status: '已完成' }
          ]" :pagination="false">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

.ant-card {
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  color: #1890ff;
}
</style>
