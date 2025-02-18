<template>
  <div class="myAppointments">
    <a-card title="我的预约记录" :bordered="false" class="full-width-card">
      <!-- 选项卡：正在预约和历史预约 -->
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="current" tab="正在预约">
          <a-table
              :columns="columns"
              :data-source="currentAppointments"
              :pagination="false"
              row-key="id"
          >
            <template #status="{ text }">
              <a-tag :color="statusMap[text].color">
                {{ statusMap[text].text }}
              </a-tag>
            </template>
            <template #action="{ record }">
              <a-button type="link" @click="handleCancel(record)">取消预约</a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="history" tab="历史预约">
          <a-table
              :columns="columns"
              :data-source="historyAppointments"
              :pagination="false"
              row-key="id"
          >
            <template #status="{ text }">
              <a-tag :color="statusMap[text].color">
                {{ statusMap[text].text }}
              </a-tag>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {message} from 'ant-design-vue'
import myAxios from "../../plugins/myAxios.js";

// 状态映射
const statusMap = {
  0: {text: '正在预约', color: 'orange'},
  1: {text: '预约成功', color: 'green'},
  2: {text: '预约被取消', color: 'red'},
  3: {text: '预约结束', color: 'yellow'}
}

// 预约类型映射
const appointmentTypes = [
  {label: '年度体检', value: 0},
  {label: '疫苗接种', value: 1},
  {label: '病症诊治', value: 2},
  {label: '手术', value: 3},
  {label: '复查', value: 4}
]

// 选项卡的当前选中项
const activeTab = ref('current')
const currentAppointments = ref([])
const historyAppointments = ref([])

// 表格列定义
const columns = [
  {
    title: '预约编号',
    dataIndex: 'id',
    key: 'id'
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
    title: '预约类型',
    dataIndex: 'appointType',
    key: 'appointType',
    customRender: ({text}) => {
      const type = appointmentTypes.find(item => item.value === text)
      return type ? type.label : '未知'
    }
  },
  {
    title: '预约日期',
    dataIndex: 'appointDate',
    key: 'appointDate'
  },
  {
    title: '预约时间',
    dataIndex: 'appointTime',
    key: 'appointTime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: {customRender: 'status'}
  },
  {
    title: '操作',
    key: 'action',
    slots: {customRender: 'action'}
  }
]

onMounted(async () => {
  const res = await myAxios.get('/appoint/list/my')
  if (res.code === 0) {
    currentAppointments.value = res.data.filter(item => item.status === 1)
    historyAppointments.value = res.data.filter(item => item.status === 3)
  } else {
    message.error('查询失败')
  }
})

// 取消预约
const handleCancel = (record) => {
  message.success(`已取消预约：${record.id}`)
  currentAppointments.value = currentAppointments.value.filter(
      (item) => item.id !== record.id
  )
}
</script>

<style scoped>
.myAppointments {
  padding: 24px;
  width: 100%;
}

.full-width-card {
  width: 100%;
}
</style>