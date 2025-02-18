<script setup>
import { ref, onMounted } from 'vue'
import { 
  UserOutlined, 
  HeartOutlined, 
  CalendarOutlined,
  DollarOutlined 
} from '@ant-design/icons-vue'
import myAxios from "../../plugins/myAxios.js";

const statistics = ref({
  petCount: 0,
  userCount: 0,
  todayAppointCount: 0,
  monthPriceSum: 0
})

const todayMedicals = ref([])

const recentAppoints = ref([])

// 模拟获取数据
onMounted( async () => {
  const res = await myAxios.get('/statistics/gather')
  if (res.code === 0) {
    statistics.value = res.data
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
          <h2>{{ statistics.petCount }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <UserOutlined /> 客户总数
          </template>
          <h2>{{ statistics.userCount }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <CalendarOutlined /> 今日预约
          </template>
          <h2>{{ statistics.todayAppointCount }}</h2>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <DollarOutlined /> 本月营收
          </template>
          <h2>¥{{ statistics.monthPriceSum }}</h2>
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
          ]" :data-source="recentAppoints" :pagination="false">
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
          ]" :data-source="todayMedicals" :pagination="false">
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
