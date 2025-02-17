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

const visible = ref(false)
const editingAppointment = ref(null)

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

const timeSlots = Array.from({length: 8}, (_, i) => {
  const hour = 9 + Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const time = `${hour}:${minute}`
  return {label: time, value: time}
})

const statusMap = {
  0: {text: '正在预约', color: 'orange'},
  1: {text: '预约结束', color: 'green'},
  2: {text: '预约被取消', color: 'red'}
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

const handleSave = () => {
  // 实现保存逻辑
  visible.value = false
}

// 重置时恢复原始数据
const handleReset = () => {
  searchForm.value = {}
  dataSource.value = [...originalData.value]
}

const handleStatusChange = async (record, status) => {
  if (status === 'cancel') {
    const res = await myAxios.post('/appoint/cancel', {record})
    if (res.code === 0) {
      message.success('取消成功')
      handleSearch()
    } else {
      message.error('取消失败')
    }
  } else if (status === 'confirm') {
    const res = await myAxios.post('/appoint/confirm', {record})
    if (res.code === 0) {
      handleSearch()
      message.success('确认成功')
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

      <a-modal
          v-model:visible="visible"
          title="新增预约"
          @ok="handleSave"
          width="600px"
      >
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="宠物名称">
            <a-input v-model:value="editingAppointment.petName"/>
          </a-form-item>
          <a-form-item label="主人姓名">
            <a-input v-model:value="editingAppointment.ownerName"/>
          </a-form-item>
          <a-form-item label="联系电话">
            <a-input v-model:value="editingAppointment.phone"/>
          </a-form-item>
          <a-form-item label="预约日期">
            <a-date-picker v-model:value="editingAppointment.date" style="width: 100%"/>
          </a-form-item>
          <a-form-item label="预约时间">
            <a-select v-model:value="editingAppointment.time">
              <a-select-option
                  v-for="slot in timeSlots"
                  :key="slot.value"
                  :value="slot.value"
              >
                {{ slot.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="就诊类型">
            <a-select v-model:value="editingAppointment.type">
              <a-select-option
                  v-for="type in appointmentTypes"
                  :key="type.value"
                  :value="type.value"
              >
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="主治医生">
            <a-select v-model:value="editingAppointment.doctor">
              <a-select-option
                  v-for="doctor in doctors"
                  :key="doctor.value"
                  :value="doctor.value"
              >
                {{ doctor.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
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