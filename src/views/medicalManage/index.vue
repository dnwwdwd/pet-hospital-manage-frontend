<script setup>
import {onMounted, ref} from 'vue'
import myAxios from "../../plugins/myAxios.js";
import {message} from "ant-design-vue";

const searchForm = ref({
  petName: '',
  userName: '',
  date: null,
  type: undefined,
  doctorName: ''
})

onMounted(async () => {
  const res = await myAxios.get('/medical/list/all')
  if (res.code === 0) {
    dataSource.value = res.data;
    originalData.value = res.data;
  } else {
    message.error('查询失败')
  }

})

const visible = ref(false)
const editingRecord = ref(null)

const columns = [
  {title: '就诊编号', dataIndex: 'number', key: 'number'},
  {title: '宠物名称', dataIndex: ['pet', 'name'], key: 'petName'},
  {title: '主人姓名', dataIndex: ['user', 'name'], key: 'ownerName'},
  {title: '就诊日期', dataIndex: 'date', key: 'date'},
  {title: '就诊类型', dataIndex: 'type', key: 'type'},
  {title: '主治医生', dataIndex: ['doctor', 'name'], key: 'doctor'},
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

const originalData = ref([])

const dataSource = ref([])

const statusMap = {
  0: {text: '等待就诊', color: 'orange'},
  1: {text: '就诊中', color: 'blue'},
  2: {text: '已完成', color: 'green'},
  3: {text: '取消就诊', color: 'red'}
}

const treatmentTypes = [
  {label: '年度体检', value: 0},
  {label: '疫苗接种', value: 1},
  {label: '病症诊治', value: 2},
  {label: '手术', value: 3},
  {label: '复查', value: 4}
]

const handleEdit = (record) => {
  editingRecord.value = {...record}
  visible.value = true
}

const handleView = (record) => {
  editingRecord.value = {...record}
  visible.value = true
}

// 搜索逻辑
const handleSearch = () => {
  let filtered = [...originalData.value]

  // 宠物名称过滤
  if (searchForm.value.petName) {
    const searchPet = searchForm.value.petName.toLowerCase().trim()
    filtered = filtered.filter(item =>
        item.pet?.name?.toLowerCase().includes(searchPet)
    )
  }

  // 主人姓名过滤
  if (searchForm.value.userName) {
    const searchUser = searchForm.value.userName.toLowerCase().trim()
    filtered = filtered.filter(item =>
        item.user?.userName?.toLowerCase().includes(searchUser)
    )
  }

  // 就诊日期过滤
  if (searchForm.value.date) {
    const searchDate = dayjs(searchForm.value.date).format('YYYY-MM-DD')
    filtered = filtered.filter(item =>
        dayjs(item.date).format('YYYY-MM-DD') === searchDate
    )
  }

  // 就诊类型过滤
  if (searchForm.value.type !== undefined) {
    filtered = filtered.filter(item =>
        item.type === Number(searchForm.value.type)
    )
  }

  // 医生姓名过滤
  if (searchForm.value.doctorName) {
    const searchDoctor = searchForm.value.doctorName.toLowerCase().trim()
    filtered = filtered.filter(item =>
        item.doctor?.name?.toLowerCase().includes(searchDoctor)
    )
  }

  dataSource.value = filtered
}

const handleStatusChange = async (record, status) => {
  if (status === 'cancel') {
    const res = await myAxios.post('/appointment/cancel', {record})
    if (res.code === 0) {
      message.success('取消成功')
      handleSearch()
    } else {
      message.error('取消失败')
    }
  } else if (status === 'confirm') {
    const res = await myAxios.post('/appointment/confirm', {record})
    if (res.code === 0) {
      message.success('确认成功')
      handleSearch()
    } else {
      message.error('确认失败')
    }
  }
}

// 重置逻辑
const handleReset = () => {
  searchForm.value = {}
  dataSource.value = [...originalData.value]
}

</script>

<template>
  <div class="medical-records">
    <a-card title="就诊管理" :bordered="false" class="full-width-card">
      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="宠物名称">
          <a-input v-model:value="searchForm.petName" placeholder="请输入宠物名称"/>
        </a-form-item>
        <a-form-item label="主人姓名">
          <a-input v-model:value="searchForm.userName" placeholder="请输入主人姓名"/>
        </a-form-item>
        <a-form-item label="就诊日期">
          <a-date-picker v-model:value="searchForm.date"/>
        </a-form-item>
        <a-form-item label="就诊类型">
          <a-select v-model:value="searchForm.type" placeholder="请选择类型" style="width: 120px">
            <a-select-option v-for="type in treatmentTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="主治医生" style="margin-top: 5px">
          <a-input v-model:value="searchForm.doctorName" placeholder="请输入医生名称"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch" style="margin-top: 5px">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: 1300 }"
      >
        <template #status="{ text }">
          <a-tag :color="statusMap[text].color">
            {{ statusMap[text].text }}
          </a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a @click="handleView(record)">查看</a>
            <a-divider type="vertical"/>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-dropdown v-if="record.status === 'waiting' || record.status === 'in_progress'">
              <a>
                更多
                <down-outlined/>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                      v-if="record.status === 'in_progress'"
                      @click="handleStatusChange(record, 'confirm')"
                  >
                    完成就诊
                  </a-menu-item>
                  <a-menu-item @click="handleStatusChange(record, 'cancel')">
                    取消就诊
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.medical-records {
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

:deep(.ant-modal-content) {
  width: 100%;
}
</style>
