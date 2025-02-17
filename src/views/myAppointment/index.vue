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
              />
            </a-tab-pane>
          </a-tabs>
        </a-card>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {message} from 'ant-design-vue'
import myAxios from "../../plugins/myAxios.js";

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
    dataIndex: 'doctorId',
    key: 'doctorId'
  },
  {
    title: '宠物名称',
    dataIndex: 'petName',
    key: 'petName'
  },
  {
    title: '预约类型',
    dataIndex: 'appointmentType',
    key: 'appointmentType'
  },
  {
    title: '预约日期',
    dataIndex: 'appointmentDate',
    key: 'appointmentDate'
  },
  {
    title: '预约时间',
    dataIndex: 'appointmentTime',
    key: 'appointmentTime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action',
    slots: {customRender: 'action'}
  }
]

// 模拟数据：正在预约的记录
// const currentAppointments = ref([
//   {
//     id: '1001',
//     doctorId: 'D001',
//     petName: '小白',
//     appointmentType: '年度体检',
//     appointmentDate: '2023-10-15',
//     appointmentTime: '10:00',
//     status: '待确认'
//   },
//   {
//     id: '1002',
//     doctorId: 'D002',
//     petName: '小黑',
//     appointmentType: '疫苗接种',
//     appointmentDate: '2023-10-16',
//     appointmentTime: '14:00',
//     status: '已确认'
//   }
// ])

// 模拟数据：历史预约的记录
// const historyAppointments = ref([
//   {
//     id: '1003',
//     doctorId: 'D003',
//     petName: '小花',
//     appointmentType: '病症诊治',
//     appointmentDate: '2023-09-20',
//     appointmentTime: '09:00',
//     status: '已完成'
//   },
//   {
//     id: '1004',
//     doctorId: 'D004',
//     petName: '小黄',
//     appointmentType: '手术',
//     appointmentDate: '2023-08-25',
//     appointmentTime: '16:00',
//     status: '已取消'
//   }
// ])

onMounted(async () => {
  const res = await myAxios.get('/appoint/list/my')
  if (res.code === 0) {
    currentAppointments.value = res.data.filter(item => item.status === 1);
    historyAppointments.value = res.data.filter(item => item.status === 3);
  } else {
    message.error('查询失败');
  }
});

// 取消预约
const handleCancel = (record) => {
  message.success(`已取消预约：${record.id}`)
  currentAppointments.value = currentAppointments.value.filter(
      (item) => item.id !== record.id
  )
}
</script>

<style scoped>
.myAppointments{
  padding: 24px;
  width: 100%;
}

.full-width-card {
  width: 100%;
}
</style>