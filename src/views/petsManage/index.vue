<script setup>
import { ref } from 'vue'

const searchForm = ref({
  name: '',
  owner: '',
  species: ''
})

const visible = ref(false)
const editingPet = ref(null)

const columns = [
  { title: '宠物名称', dataIndex: 'name', key: 'name' },
  { title: '品种', dataIndex: 'species', key: 'species' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '主人', dataIndex: 'owner', key: 'owner' },
  { title: '疫苗接种', dataIndex: 'vaccination', key: 'vaccination' },
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
    name: '球球',
    species: '金毛',
    gender: '公',
    age: '2岁',
    owner: '张三',
    vaccination: '已完成',
  },
  {
    key: '2',
    name: '咪咪',
    species: '英短',
    gender: '母',
    age: '1岁',
    owner: '李四',
    vaccination: '部分完成',
  }
])

const handleAdd = () => {
  editingPet.value = {}
  visible.value = true
}

const handleEdit = (record) => {
  editingPet.value = { ...record }
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
</script>

<template>
  <div class="pets-management">
    <a-card title="病史管理" :bordered="false" class="full-width-card">
      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="宠物名称">
          <a-input v-model:value="searchForm.name" placeholder="请输入宠物名称" />
        </a-form-item>
        <a-form-item label="主人姓名">
          <a-input v-model:value="searchForm.owner" placeholder="请输入主人姓名" />
        </a-form-item>
        <a-form-item label="品种">
          <a-input v-model:value="searchForm.species" placeholder="请输入品种" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="() => searchForm = {}">重置</a-button>
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
        title="编辑宠物病史"
        @ok="handleSave"
      >
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="宠物名称">
            <a-input v-model:value="editingPet.name" />
          </a-form-item>
          <a-form-item label="品种">
            <a-input v-model:value="editingPet.species" />
          </a-form-item>
          <a-form-item label="性别">
            <a-select v-model:value="editingPet.gender">
              <a-select-option value="公">公</a-select-option>
              <a-select-option value="母">母</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="年龄">
            <a-input v-model:value="editingPet.age" />
          </a-form-item>
          <a-form-item label="主人">
            <a-input v-model:value="editingPet.owner" />
          </a-form-item>
          <a-form-item label="疫苗接种">
            <a-select v-model:value="editingPet.vaccination">
              <a-select-option value="已完成">已完成</a-select-option>
              <a-select-option value="部分完成">部分完成</a-select-option>
              <a-select-option value="未接种">未接种</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<style scoped>
.pets-management {
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
