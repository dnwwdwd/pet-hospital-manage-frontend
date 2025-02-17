<script setup>
import { ref } from 'vue'

const searchForm = ref({
  name: '',
  phone: '',
  petName: ''
})

const visible = ref(false)
const editingCustomer = ref(null)

const columns = [
  { title: '客户姓名', dataIndex: 'name', key: 'name' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '地址', dataIndex: 'address', key: 'address' },
  { title: '宠物信息', dataIndex: 'pets', key: 'pets' },
  { title: '会员等级', dataIndex: 'memberLevel', key: 'memberLevel' },
  { title: '消费总额', dataIndex: 'totalSpent', key: 'totalSpent' },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    slots: {
      customRender: 'action'
    }
  }
]

const dataSource = ref([
  {
    key: '1',
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道',
    pets: '球球(金毛)',
    memberLevel: '黄金会员',
    totalSpent: '¥5,800'
  },
  {
    key: '2',
    name: '李四',
    phone: '13900139000',
    address: '北京市海淀区xxx街道',
    pets: '咪咪(英短)',
    memberLevel: '白银会员',
    totalSpent: '¥3,200'
  }
])

const handleAdd = () => {
  editingCustomer.value = {}
  visible.value = true
}

const handleEdit = (record) => {
  editingCustomer.value = { ...record }
  visible.value = true
}

const handleDelete = (record) => {
  dataSource.value = dataSource.value.filter(item => item.key !== record.key)
}

const handleSearch = () => {
  // 实现搜索逻辑
}

const handleSave = () => {
  // 实现保存逻辑
  visible.value = false
}

// 消费记录表格列
const consumptionColumns = [
  { title: '日期', dataIndex: 'date' },
  { title: '项目', dataIndex: 'item' },
  { title: '金额', dataIndex: 'amount' },
  { title: '支付方式', dataIndex: 'paymentMethod' }
]

const consumptionRecords = ref([
  {
    key: '1',
    date: '2025-02-14',
    item: '年度体检',
    amount: '¥800',
    paymentMethod: '微信支付'
  },
  {
    key: '2',
    date: '2025-02-10',
    item: '疫苗接种',
    amount: '¥500',
    paymentMethod: '支付宝'
  }
])
</script>

<template>
  <div class="customers-management">
    <a-card title="客户管理" :bordered="false" class="full-width-card">
      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="客户姓名">
          <a-input v-model:value="searchForm.name" placeholder="请输入客户姓名" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="searchForm.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="宠物名称">
          <a-input v-model:value="searchForm.petName" placeholder="请输入宠物名称" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="() => searchForm = {}">重置</a-button>
        </a-form-item>
      </a-form>

      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="handleAdd">新增客户</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1300 }"
      >
        <template #action="{ record }">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除这条记录吗？"
              @confirm="handleDelete(record)"
            >
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>

      <a-modal
        v-model:visible="visible"
        :title="editingCustomer?.key ? '编辑客户' : '新增客户'"
        @ok="handleSave"
        width="800px"
      >
        <a-tabs>
          <a-tab-pane key="1" tab="基本信息">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-form-item label="客户姓名">
                <a-input v-model:value="editingCustomer.name" />
              </a-form-item>
              <a-form-item label="联系电话">
                <a-input v-model:value="editingCustomer.phone" />
              </a-form-item>
              <a-form-item label="地址">
                <a-input v-model:value="editingCustomer.address" />
              </a-form-item>
              <a-form-item label="会员等级">
                <a-select v-model:value="editingCustomer.memberLevel">
                  <a-select-option value="普通会员">普通会员</a-select-option>
                  <a-select-option value="白银会员">白银会员</a-select-option>
                  <a-select-option value="黄金会员">黄金会员</a-select-option>
                  <a-select-option value="钻石会员">钻石会员</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="消费记录">
            <a-table
              :columns="consumptionColumns"
              :data-source="consumptionRecords"
              :pagination="false"
            />
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </a-card>
  </div>
</template>

<style scoped>
.customers-management {
  width: 100%;
  padding: 24px;
}

.full-width-card {
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
</style>
