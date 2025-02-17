<template>
  <div class="doctor-manage">
    <a-card title="医生管理" :bordered="true">
      <!-- 操作栏：添加医生和搜索 -->
      <div class="action-bar">
        <a-button type="primary" @click="showAddModal">
          <template #icon>
            <PlusOutlined/>
          </template>
          添加医生
        </a-button>
        <a-input
            v-model:value="searchValue"
            placeholder="请输入医生姓名"
            style="width: 200px; margin-left: 16px"
            @change="handleSearch"
        >
          <template #prefix>
            <SearchOutlined/>
          </template>
        </a-input>
      </div>

      <!-- 医生列表 -->
      <a-table
          :columns="columns"
          :data-source="doctors"
          :pagination="{ pageSize: 8 }"
          row-key="id"
      >
        <template #action="{ record }">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 添加医生的弹窗 -->
    <a-modal
        v-model:visible="addModal.visible"
        :title="addModal.title"
        @ok="handleAddSubmit"
        @cancel="handleAddCancel"
        cancel-text="取消"
        ok-text="确定"
    >
      <a-form :model="addModal.form" :rules="addModal.rules" ref="addFormRef" layout="vertical">
        <a-form-item label="医生姓名" name="name">
          <a-input v-model:value="addModal.form.name" placeholder="请输入医生姓名"/>
        </a-form-item>
        <a-form-item label="科室" name="department">
          <a-input v-model:value="addModal.form.department" placeholder="请输入科室"/>
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="addModal.form.phone" placeholder="请输入联系电话"/>
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="editModal.form.gender">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年龄" name="age">
          <a-input v-model:value="addModal.form.age" placeholder="请输入年龄"/>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑医生的弹窗 -->
    <a-modal
        v-model:visible="editModal.visible"
        :title="editModal.title"
        @ok="handleEditSubmit"
        @cancel="handleEditCancel"
        cancel-text="取消"
        ok-text="确定"
    >
      <a-form :model="editModal.form" :rules="editModal.rules" ref="editFormRef" layout="vertical">
        <a-form-item label="医生姓名" name="name">
          <a-input v-model:value="editModal.form.name" placeholder="请输入医生姓名"/>
        </a-form-item>
        <a-form-item label="科室" name="department">
          <a-input v-model:value="editModal.form.department" placeholder="请输入科室"/>
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="editModal.form.phone" placeholder="请输入联系电话"/>
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="editModal.form.gender">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年龄" name="age">
          <a-input v-model:value="editModal.form.age" placeholder="请输入年龄"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {message} from 'ant-design-vue'
import {PlusOutlined, SearchOutlined} from '@ant-design/icons-vue'
import myAxios from "../../plugins/myAxios.js";

// 医生列表数据
const doctors = ref([])

const loadData = async () => {
  const res = await myAxios.get('/doctor/list')
  if (res.code === 0) {
    doctors.value = res.data
  } else {
    message.error('查询失败')
  }
}

onMounted(async () => {
  await loadData()
})


// 搜索值
const searchValue = ref('')

// 表格列定义
const columns = [
  {
    title: '医生姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '科室',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '操作',
    key: 'action',
    slots: {customRender: 'action'}
  }
]

// 添加医生的弹窗状态
const addModal = reactive({
  visible: false,
  title: '添加医生',
  form: {
    name: '',
    department: '',
    phone: '',
    age: '',
    gender: ''
  },
  rules: {
    name: [{required: true, message: '请输入医生姓名'}],
    department: [{required: true, message: '请输入科室'}],
    phone: [{required: true, message: '请输入联系电话'}]
  }
})

// 显示添加医生的弹窗
const showAddModal = () => {
  addModal.visible = true
}

// 提交添加医生
const handleAddSubmit = async () => {
  const res = await myAxios.post('/doctor/add', addModal.form)
  if (res.code === 0) {
    await loadData();
    addModal.visible = false
    addModal.form = {name: '', department: '', phone: '', age: '', gender: ''}
    message.success('添加成功')
  } else {
    message.error('添加失败')
  }
}

// 取消添加医生
const handleAddCancel = () => {
  addModal.visible = false
  addModal.form = {name: '', department: '', phone: ''}
}

// 编辑医生的弹窗状态
const editModal = reactive({
  visible: false,
  title: '编辑医生',
  form: {
    id: null,
    name: '',
    department: '',
    phone: ''
  },
  rules: {
    name: [{required: true, message: '请输入医生姓名'}],
    department: [{required: true, message: '请输入科室'}],
    phone: [{required: true, message: '请输入联系电话'}]
  }
})

// 显示编辑医生的弹窗
const showEditModal = (record) => {
  editModal.visible = true
  editModal.form = {...record}
}

// 提交编辑医生
const handleEditSubmit = async () => {
  const res = await myAxios.post('/doctor/update', editModal.form)
  if (res.code === 0) {
    editModal.form = {...editModal.form, id: null, name: '', department: '', phone: ''}
    editModal.visible = false
    await loadData()
    message.success('更新成功')
  } else {
    message.error('更新失败')
  }
}

// 取消编辑医生
const handleEditCancel = () => {
  editModal.visible = false
}

// 删除医生
const handleDelete = async (record) => {
  const res = await myAxios.post('/doctor/delete', {id: record.id})
  if (res.code === 0) {
    message.success('删除成功')
    await loadData()
  } else {
    message.error('删除失败')
  }
}

// 处理搜索
const handleSearch = async () => {
  if (searchValue.value === '') {
    await loadData()
  } else {
    doctors.value = doctors.value.filter(item => item.name.includes(searchValue.value))
  }
}
</script>

<style scoped>
.doctor-manage {
  padding: 24px;
  width: 100%;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ant-card {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-table {
  margin-top: 16px;
}
</style>