<script setup>
import {onMounted, ref} from 'vue'
import myAxios from "../../plugins/myAxios.js";
import {message} from "ant-design-vue";

const searchForm = ref({
  name: '',
  owner: '',
  species: ''
})

const visible = ref(false)
const editingSickness = ref(null)
const originalData = ref([]) // 新增原始数据存储

const columns = [
  {title: '宠物名称', dataIndex: ['pet' , 'name'], key: 'name'},
  {title: '品种', dataIndex: ['pet', 'variety'], key: 'variety'},
  {title: '性别', dataIndex: ['pet', 'gender'], key: 'gender'},
  {title: '年龄', dataIndex: ['pet', 'age'], key: 'age'},
  {title: '主人', dataIndex: ['user', 'userName'], key: 'userName'},
  {title: '历史病情', dataIndex: 'description', key: 'description'},
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

const dataSource = ref([])

const loadData = async () => {
  const res = await myAxios.get('/sickness/list/my')
  if (res.code === 0) {
    originalData.value = res.data // 保存原始数据
    dataSource.value = res.data
  }
}

onMounted(async () => {
  await loadData();
})

const handleEdit = (record) => {
  editingSickness.value = {...record}
  visible.value = true
}

const handleDelete = async (record) => {
  const res = await myAxios.post('/sickness/delete', {id: record.id})
  if (res.code === 0) {
    message.success('删除成功')
    await loadData();
  } else {
    message.error('删除失败')
  }
}

const handleSearch = () => {
  let filteredData = [...originalData.value]

  // 宠物名称模糊搜索
  if (searchForm.value.name) {
    const searchName = searchForm.value.name.toLowerCase().trim()
    filteredData = filteredData.filter(item =>
        item.pet?.name?.toLowerCase().includes(searchName)
    )
  }

  // 主人姓名模糊搜索
  if (searchForm.value.owner) {
    const searchOwner = searchForm.value.owner.toLowerCase().trim()
    filteredData = filteredData.filter(item =>
        item.user?.userName?.toLowerCase().includes(searchOwner)
    )
  }

  // 品种模糊搜索
  if (searchForm.value.species) {
    const searchSpecies = searchForm.value.species.toLowerCase().trim()
    filteredData = filteredData.filter(item =>
        item.pet?.variety?.toLowerCase().includes(searchSpecies)
    )
  }

  dataSource.value = filteredData
}

const handleReset = () => {
  searchForm.value = {
    name: '',
    owner: '',
    species: ''
  }
  dataSource.value = [...originalData.value]
}

const handleSave = async () => {
  const res = await myAxios.post('/sickness/update', editingSickness.value)
  if (res.code === 0) {
    visible.value = false
    await loadData();
    message.success('修改成功')
  } else {
    message.error('修改失败')
  }
}
</script>

<template>
  <div class="sicknesss-management">
    <a-card title="病史管理" :bordered="false" class="full-width-card">
      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="宠物名称">
          <a-input v-model:value="searchForm.name" placeholder="请输入宠物名称"/>
        </a-form-item>
        <a-form-item label="主人姓名">
          <a-input v-model:value="searchForm.owner" placeholder="请输入主人姓名"/>
        </a-form-item>
        <a-form-item label="品种">
          <a-input v-model:value="searchForm.species" placeholder="请输入品种"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: 1300 }"
      >
        <template #action="{ record }">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
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
          title="编辑宠物病史"
          @ok="handleSave"
      >
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="宠物名称">
            <a-input v-model:value="editingSickness.petName"/>
          </a-form-item>
          <a-form-item label="品种">
            <a-input v-model:value="editingSickness.variety"/>
          </a-form-item>
          <a-form-item label="性别">
            <a-select v-model:value="editingSickness.gender">
              <a-select-option value="公">公</a-select-option>
              <a-select-option value="母">母</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="年龄">
            <a-input v-model:value="editingSickness.age"/>
          </a-form-item>
          <a-form-item label="主人">
            <a-input v-model:value="editingSickness.userName"/>
          </a-form-item>
          <a-form-item label="历史病情">
            <a-input v-model:value="editingSickness.description"/>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<style scoped>
.sicknesss-management {
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
</style>