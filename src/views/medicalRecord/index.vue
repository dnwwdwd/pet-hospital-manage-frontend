<template>
  <div class="medicalRecord">
    <a-card title="宠物就诊记录" :bordered="false" class="full-width-card">
      <!-- 选项卡：正在就诊和历史就诊 -->
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="current" tab="正在就诊">
          <a-table
              :columns="columns"
              :data-source="currentVisits"
              :pagination="false"
              row-key="id"
          />
        </a-tab-pane>
        <a-tab-pane key="history" tab="历史就诊">
          <a-table
              :columns="columns"
              :data-source="historyVisits"
              :pagination="false"
              row-key="id"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue'
import myAxios from "../../plugins/myAxios.js";
import {message} from "ant-design-vue";
import dayjs from 'dayjs';

// 选项卡的当前选中项
const activeTab = ref('current')

// 表格列定义
const columns = [
  {
    title: '就诊编号',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '医生ID',
    dataIndex: ['doctor', 'id'],
    key: 'doctorId'
  },
  {
    title: '宠物名称',
    dataIndex: ['pet', 'name'],
    key: 'petName'
  },
  {
    title: '就诊类型',
    dataIndex: 'appointType',
    key: 'appointType',
    customRender: ({text}) => {
      const type = appointmentTypes.find(item => item.value === text)
      return type ? type.label : '未知'
    }
  },
  {
    title: '就诊日期',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  }
]

const appointmentTypes = [
  {label: '年度体检', value: 0},
  {label: '疫苗接种', value: 1},
  {label: '病症诊治', value: 2},
  {label: '手术', value: 3},
  {label: '复查', value: 4}
]

// 正在就诊的记录
const currentVisits = ref([])

// 历史就诊的记录
const historyVisits = ref([])

// 获取数据并映射到表格
watchEffect(async () => {
  let res;
  if (activeTab.value === 'current') {
    // 获取正在就诊的记录
    res = await myAxios.get('/medical/list/all')
    if (res.code === 0) {
      currentVisits.value = mapMedicalData(res.data.filter(item => item.status === 0))
    } else {
      message.error('查询失败')
    }
  } else if (activeTab.value === 'history') {
    // 获取历史就诊的记录
    res = await myAxios.get('/medical/list/all')
    if (res.code === 0) {
      historyVisits.value = mapMedicalData(res.data.filter(item => item.status === 1))
    } else {
      message.error('查询失败')
    }
  }
})

// 将 MedicalVO 数据映射为表格需要的格式
const mapMedicalData = (data) => {
  return data.map(item => ({
    id: item.id,
    number: item.number,
    doctorId: item.doctorId,
    petName: item.pet?.name || '未知', // 从 pet 对象中获取宠物名称
    visitType: getVisitTypeText(item.type), // 将就诊类型转换为文本
    visitDate: dayjs(item.date).format('YYYY-MM-DD'), // 格式化日期
    visitTime: dayjs(item.date).format('HH:mm'), // 格式化时间
    statusText: getStatusText(item.status) // 将状态转换为文本
  }))
}

// 将就诊类型转换为文本
const getVisitTypeText = (type) => {
  switch (type) {
    case 1:
      return '年度体检'
    case 2:
      return '疫苗接种'
    case 3:
      return '病症诊治'
    case 4:
      return '手术'
    default:
      return '未知'
  }
}

// 将状态转换为文本
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return '进行中'
    case 1:
      return '已完成'
    default:
      return '未知'
  }
}
</script>

<style scoped>
.medicalRecord {
}

.full-width-card {
  width: 100%;
}
</style>