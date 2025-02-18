<script setup>
import {onMounted, ref} from 'vue'
import dayjs from 'dayjs'
import {message} from "ant-design-vue";
import myAxios from "../../plugins/myAxios.js";

const dataSource = ref([])


const originalData = ref([])

const searchForm = ref({
  petName: '',
  ownerName: '',
  date: null,
  status: undefined
})

onMounted((async () => {
  const res = await myAxios.get('/appoint/list/all')
  if (res.code === 0) {
    originalData.value = res.data
    dataSource.value = res.data
  } else {
    message.error('查询失败')
  }
}))

const cancelMedicalForm = ref({
  visible: false,
  form: {
    cancelReason: ''
  }
})

const selectedRecord = ref({})

const columns = [
  {title: '预约编号', dataIndex: 'id', key: 'id'},
  {title: '宠物名称', dataIndex: ['pet', 'name'], key: 'petName'},
  {title: '主人姓名', dataIndex: ['user', 'userName'], key: 'ownerName'},
  {title: '联系电话', dataIndex: ['user', 'phone'], key: 'phone'},
  {title: '预约日期', dataIndex: 'appointDate', key: 'appointDate'},
  {title: '预约时间', dataIndex: 'appointTime', key: 'appointTime'},
  {
    title: '预约类型',
    dataIndex: 'appointType',
    key: 'appointType',
    customRender: ({text}) => {
      // 根据 appointType 的值找到对应的文本
      const type = appointmentTypes.find(item => item.value === text)
      return type ? type.label : '未知'
    }
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
    width: 200,
    fixed: 'right',
    slots: {customRender: 'action'}
  }
]

const appointmentTypes = [
  {label: '年度体检', value: 0},
  {label: '疫苗接种', value: 1},
  {label: '病症诊治', value: 2},
  {label: '手术', value: 3},
  {label: '复查', value: 4}
]

const statusMap = {
  0: {text: '正在预约', color: 'orange'},
  1: {text: '预约成功', color: 'green'},
  2: {text: '预约被取消', color: 'red'},
  3: {text: '预约结束', color: 'yellow'}
}

const handleSearch = () => {
  let filtered = [...originalData.value]

  if (searchForm.value.petName) {
    filtered = filtered.filter(item =>
        item.pet?.name.toLowerCase().includes(searchForm.value.petName.toLowerCase().trim())
    )
  }

  if (searchForm.value.ownerName) {
    filtered = filtered.filter(item =>
        item.user?.userName.toLowerCase().includes(searchForm.value.ownerName.toLowerCase().trim())
    )
  }

  if (searchForm.value.date) {
    const searchDate = dayjs(searchForm.value.date).format('YYYY-MM-DD')
    filtered = filtered.filter(item =>
        dayjs(item.appointDate).format('YYYY-MM-DD') === searchDate
    )
  }

  if (searchForm.value.status !== undefined) {
    filtered = filtered.filter(item =>
        item.status === Number(searchForm.value.status)
    )
  }

  dataSource.value = filtered
}

const handleCancel = async () => {
  const res = await myAxios.post('/appoint/cancel', {...cancelMedicalForm.value.form, id: selectedRecord.value.id})
  if (res.code === 0) {
    message.success('取消成功')
    cancelMedicalForm.value.visible = false;
    window.location.reload()
  } else {
    message.error('取消失败')
  }
}

// 重置时恢复原始数据
const handleReset = () => {
  searchForm.value = {}
  dataSource.value = [...originalData.value]
}

const handleStatusChange = async (record, status) => {
  selectedRecord.value = record;
  if (status === 'cancel') {
    cancelMedicalForm.value.visible = true
  } else if (status === 'confirm') {
    const res = await myAxios.post('/appoint/confirm', {id: record.id})
    if (res.code === 0) {
      message.success('确认成功')
      window.location.reload()
    } else {
      message.error('确认失败')
    }
  }
}
</script>

<template>
  <div class="appointments-management">
    <a-card title="预约管理" :bordered="false" class="full-width-card">
      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="宠物名称">
          <a-input v-model:value="searchForm.petName" placeholder="请输入宠物名称"/>
        </a-form-item>
        <a-form-item label="主人姓名">
          <a-input v-model:value="searchForm.ownerName" placeholder="请输入主人姓名"/>
        </a-form-item>
        <a-form-item label="预约日期">
          <a-date-picker v-model:value="searchForm.date"/>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.status" placeholder="请选择状态" style="width: 120px">
            <a-select-option v-for="(status, key) in statusMap" :key="key" :value="key">
              {{ status.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: 1500 }"
      >
        <template #status="{ text }">
          <a-tag :color="statusMap[text].color">
            {{ statusMap[text].text }}
          </a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-dropdown v-if="record.status === 0">
              <a>
                更多
                <down-outlined/>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleStatusChange(record, 'confirm')">
                    确认预约
                  </a-menu-item>
                  <a-menu-item @click="handleStatusChange(record, 'cancel')">
                    取消预约
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model:visible="cancelMedicalForm.visible"
        title="取消预约"
        @ok="handleCancel"
        @cancel="() => {
          cancelMedicalForm.visible = false
          cancelMedicalForm.form.cancelReason = ''
        }"
        cancel-text="取消"
        ok-text="确定"
    >
      <a-form :model="cancelMedicalForm.form" layout="vertical">
        <a-form-item label="取消原因" name="description">
          <a-input v-model:value="cancelMedicalForm.form.cancelReason" placeholder="请输入取消预约的原因"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.appointments-management {
  padding: 24px;
  width: 100%;
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

:deep(.ant-form) {
  width: 100%;
}
</style>