<script setup>
import {ref, onMounted} from 'vue'
import myAxios from "../../plugins/myAxios.js";

const activeTab = ref('1')
const revenueData = ref([])
const petHealthData = ref([])
const customerActivityData = ref([])

const statisticsData = ref({
  monthPriceSum: 0,
  monthMedicalCount: 0,
  averagePrice: 0,
  vipCount: 0,
  totalMedicalCount: 0,
  mainDisease: '',
  vaccinationPercent: 0,
})

onMounted(async () => {
  const res = await myAxios.get('/api/statistics/get')
  if (res.code === 0) {
    statisticsData.value.monthPriceSum = res.data.monthPriceSum;
    statisticsData.value.monthMedicalCount = res.data.monthMedicalCount;
    statisticsData.value.averagePrice = res.data.averagePrice;
    statisticsData.value.vipCount = res.data.vipCount;
    statisticsData.value.totalMedicalCount = res.data.totalMedicalCount;
    statisticsData.value.mainDisease = res.data.mainDisease;
    statisticsData.value.vaccinationPercent = res.data.vaccinationPercent;
  }
});

// 模拟数据
onMounted(() => {
  // 营收数据
  revenueData.value = [
    {date: '2025-02-01', amount: 3500},
    {date: '2025-02-02', amount: 4200},
    {date: '2025-02-03', amount: 3800},
    {date: '2025-02-04', amount: 4500},
    {date: '2025-02-05', amount: 5000}
  ]

  // 宠物健康数据
  petHealthData.value = [
    {name: '常规体检', count: 150},
    {name: '疫苗接种', count: 120},
    {name: '皮肤病', count: 80},
    {name: '肠胃疾病', count: 60},
    {name: '骨科疾病', count: 40}
  ]

  // 客户活跃度数据
  customerActivityData.value = [
    {level: '高活跃', count: 50},
    {level: '中活跃', count: 80},
    {level: '低活跃', count: 120}
  ]
})

const columns = {
  revenue: [
    {title: '日期', dataIndex: 'date', key: 'date'},
    {title: '就诊人次', dataIndex: 'visits', key: 'visits'},
    {title: '营业额(元)', dataIndex: 'amount', key: 'amount'},
    {title: '环比增长', dataIndex: 'growth', key: 'growth'}
  ],
  petHealth: [
    {title: '病种类型', dataIndex: 'type', key: 'type'},
    {title: '发病数量', dataIndex: 'count', key: 'count'},
    {title: '占比', dataIndex: 'percentage', key: 'percentage'},
    {title: '同比增长', dataIndex: 'growth', key: 'growth'}
  ],
  customerActivity: [
    {title: '客户等级', dataIndex: 'level', key: 'level'},
    {title: '客户数量', dataIndex: 'count', key: 'count'},
    {title: '平均就诊频率', dataIndex: 'frequency', key: 'frequency'},
    {title: '平均消费额', dataIndex: 'spending', key: 'spending'}
  ]
}

const revenueTableData = ref([
  {
    key: '1',
    date: '2025-02',
    visits: 320,
    amount: 58000,
    growth: '+15%'
  },
  {
    key: '2',
    date: '2025-01',
    visits: 280,
    amount: 50000,
    growth: '+10%'
  }
])

const petHealthTableData = ref([
  {
    key: '1',
    type: '皮肤病',
    count: 80,
    percentage: '25%',
    growth: '+5%'
  },
  {
    key: '2',
    type: '肠胃疾病',
    count: 60,
    percentage: '18%',
    growth: '-3%'
  }
])

const customerActivityTableData = ref([
  {
    key: '1',
    level: '高活跃',
    count: 50,
    frequency: '每月2次',
    spending: '¥800/次'
  },
  {
    key: '2',
    level: '中活跃',
    count: 80,
    frequency: '每月1次',
    spending: '¥500/次'
  }
])

const handleDateRangeChange = (dates) => {
  // 处理日期范围变化
  console.log('Date range changed:', dates)
}

const handleExport = () => {
  // 处理导出报表
  console.log('Exporting report...')
}
</script>

<template>
  <div class="statistics">
    <a-card :bordered="false" class="full-width-card">
      <template #title>
        <a-space>
          统计报表
        </a-space>
      </template>
      <template #extra>
        <a-button type="primary" @click="handleExport">导出报表</a-button>
      </template>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="1" tab="营收统计">
          <div class="statistics-cards">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-card>
                  <template #title>本月营收</template>
                  <h2>¥{{ statisticsData.monthPriceSum }}</h2>
                  <p>环比增长 15%</p>
                </a-card>
              </a-col>
              <a-col :span="6">
                <a-card>
                  <template #title>本月就诊人次</template>
                  <h2>{{ statisticsData.monthMedicalCount }}</h2>
                  <p>环比增长 12%</p>
                </a-card>
              </a-col>
              <a-col :span="6">
                <a-card>
                  <template #title>客单价</template>
                  <h2>¥{{ statisticsData.averagePrice }}</h2>
                  <p>环比增长 5%</p>
                </a-card>
              </a-col>
              <a-col :span="6">
                <a-card>
                  <template #title>新增会员</template>
                  <h2>{{ statisticsData.vipCount }}</h2>
                  <p>环比增长 8%</p>
                </a-card>
              </a-col>
            </a-row>
          </div>
          <a-table
              :columns="columns.revenue"
              :data-source="revenueTableData"
              :pagination="false"
          />
        </a-tab-pane>

        <a-tab-pane key="2" tab="宠物健康分析">
          <div class="statistics-cards">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-card>
                  <template #title>总就诊数</template>
                  <h2>{{ statisticsData.totalMedicalCount }}</h2>
                  <p>本月累计</p>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <template #title>主要病种</template>
                  <h2>{{ statisticsData.mainDisease || '皮肤病' }}</h2>
                  <p>占比 25%</p>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <template #title>疫苗接种率</template>
                  <h2>{{ statisticsData.vaccinationPercent }}%</h2>
                  <p>环比增长 5%</p>
                </a-card>
              </a-col>
            </a-row>
          </div>
          <a-table
              :columns="columns.petHealth"
              :data-source="petHealthTableData"
              :pagination="false"
          />
        </a-tab-pane>

        <a-tab-pane key="3" tab="客户活跃度分析">
          <div class="statistics-cards">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-card>
                  <template #title>活跃客户数</template>
                  <h2>130</h2>
                  <p>环比增长 10%</p>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <template #title>平均就诊频率</template>
                  <h2>1.5次/月</h2>
                  <p>环比增长 8%</p>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <template #title>客户留存率</template>
                  <h2>92%</h2>
                  <p>环比增长 2%</p>
                </a-card>
              </a-col>
            </a-row>
          </div>
          <a-table
              :columns="columns.customerActivity"
              :data-source="customerActivityTableData"
              :pagination="false"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style scoped>
.statistics {
  padding: 24px;
  width: 100%;
}

.full-width-card {
  width: 100%;
}

.statistics-cards {
  margin-bottom: 24px;
  width: 100%;
}

:deep(.ant-card-body) {
  width: 100%;
}

:deep(.ant-table-wrapper) {
  width: 100%;
}

:deep(.ant-tabs-content) {
  width: 100%;
}

:deep(.ant-row) {
  width: 100%;
}

h2 {
  margin: 0;
  color: #1890ff;
  font-size: 24px;
}

p {
  margin: 8px 0 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>
