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
          >
            <template #status="{ text }">
              <a-tag :color="statusMap[text]?.color || 'default'">
                {{ statusMap[text]?.text || '未知' }}
              </a-tag>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="history" tab="历史就诊">
          <a-table
              :columns="columns"
              :data-source="historyVisits"
              :pagination="false"
              row-key="id"
          >
            <template #status="{ text }">
              <a-tag :color="statusMap[text]?.color || 'default'">
                {{ statusMap[text]?.text || '未知' }}
              </a-tag>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import myAxios from "../../plugins/myAxios.js";
import { message } from "ant-design-vue";
import dayjs from 'dayjs';

// 状态映射配置
const statusMap = {
  0: { text: '进行中', color: 'blue' },
  1: { text: '已完成', color: 'green' }
};

// 就诊类型映射配置
const appointmentTypes = [
  { label: '年度体检', value: 1 },
  { label: '疫苗接种', value: 2 },
  { label: '病症诊治', value: 3 },
  { label: '手术', value: 4 },
  { label: '复查', value: 5 }
];

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
    dataIndex: 'type',
    key: 'type',
    customRender: ({ text }) => {
      const type = appointmentTypes.find(item => item.value === text);
      return type ? type.label : '未知';
    }
  },
  {
    title: '就诊日期',
    dataIndex: 'date',
    key: 'date',
    customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD HH:mm')
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: {customRender: 'status'} // 使用插槽渲染状态
  }
];

// 选项卡的当前选中项
const activeTab = ref('current');

// 数据相关
const currentVisits = ref([]);
const historyVisits = ref([]);

// 获取数据并处理
watchEffect(async () => {
  try {
    const res = await myAxios.get('/medical/list/my');
    if (res.code === 0) {
      const allData = res.data.map(item => ({
        ...item,
        date: dayjs(item.date).format('YYYY-MM-DD HH:mm'),
        statusText: statusMap[item.status]?.text || '未知'
      }));

      currentVisits.value = allData.filter(item => item.status === 0);
      historyVisits.value = allData.filter(item => item.status === 1);
    } else {
      message.error('数据获取失败');
    }
  } catch (error) {
    message.error('请求异常');
  }
});
</script>

<style scoped>
.medicalRecord {
  padding: 24px;
}

.full-width-card {
  width: 100%;
}
</style>