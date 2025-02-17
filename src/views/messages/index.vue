<script setup>
import { ref } from 'vue'

const activeTab = ref('1')
const visible = ref(false)
const editingMessage = ref(null)

const columns = {
  notifications: [
    { title: '消息标题', dataIndex: 'title', key: 'title' },
    { title: '消息类型', dataIndex: 'type', key: 'type' },
    { title: '发送时间', dataIndex: 'sendTime', key: 'sendTime' },
    { title: '接收人', dataIndex: 'receiver', key: 'receiver' },
    { title: '状态', dataIndex: 'status', key: 'status', slots: { customRender: 'status' } },
    { title: '操作', key: 'action', slots: { customRender: 'action' } }
  ],
  templates: [
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    { title: '模板类型', dataIndex: 'type', key: 'type' },
    { title: '模板内容', dataIndex: 'content', key: 'content' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '操作', key: 'action', slots: { customRender: 'action' } }
  ]
}

const notificationData = ref([
  {
    key: '1',
    title: '预约提醒',
    type: '预约通知',
    sendTime: '2025-02-15 14:30',
    receiver: '张三',
    status: 'sent',
    content: '尊敬的张三先生，提醒您球球的体检预约时间为2025-02-16 15:00，请准时到院。'
  },
  {
    key: '2',
    title: '疫苗接种提醒',
    type: '疫苗提醒',
    sendTime: '2025-02-15 10:00',
    receiver: '李四',
    status: 'pending',
    content: '尊敬的李四先生，您的爱宠咪咪需要在下周进行疫苗加强针注射，请及时预约。'
  }
])

const templateData = ref([
  {
    key: '1',
    name: '预约提醒模板',
    type: '预约通知',
    content: '尊敬的{客户姓名}，提醒您{宠物名称}的{预约项目}预约时间为{预约时间}，请准时到院。',
    createTime: '2025-01-01'
  },
  {
    key: '2',
    name: '疫苗提醒模板',
    type: '疫苗提醒',
    content: '尊敬的{客户姓名}，您的爱宠{宠物名称}需要在{时间}进行疫苗加强针注射，请及时预约。',
    createTime: '2025-01-01'
  }
])

const statusMap = {
  sent: { text: '已发送', color: 'green' },
  pending: { text: '待发送', color: 'orange' },
  failed: { text: '发送失败', color: 'red' }
}

const handleAdd = () => {
  editingMessage.value = {}
  visible.value = true
}

const handleEdit = (record) => {
  editingMessage.value = { ...record }
  visible.value = true
}

const handleDelete = (record) => {
  if (activeTab.value === '1') {
    notificationData.value = notificationData.value.filter(item => item.key !== record.key)
  } else {
    templateData.value = templateData.value.filter(item => item.key !== record.key)
  }
}

const handleSend = (record) => {
  record.status = 'sent'
  record.sendTime = new Date().toLocaleString()
}

const handleSave = () => {
  visible.value = false
}
</script>

<template>
  <div class="messages">
    <a-card :bordered="false" class="full-width-card">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="1" tab="消息通知">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">新增通知</a-button>
          </div>

          <a-table
            :columns="columns.notifications" 
            :data-source="notificationData"
          >
            <template #status="{ text }">
              <a-tag :color="statusMap[text].color">
                {{ statusMap[text].text }}
              </a-tag>
            </template>

            <template #action="{ record }">
              <a-space>
                <a @click="handleEdit(record)">查看</a>
                <a-divider type="vertical" />
                <a @click="handleSend(record)"
                   v-if="record.status === 'pending'">发送</a>
                <a-divider type="vertical" v-if="record.status === 'pending'" />
                <a-popconfirm
                  title="确定要删除这条消息吗？"
                  @confirm="handleDelete(record)"
                >
                  <a style="color: #ff4d4f">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="2" tab="消息模板">
          <div style="margin-bottom: 16px">
            <a-button type="primary" @click="handleAdd">新增模板</a-button>
          </div>

          <a-table
            :columns="columns.templates" 
            :data-source="templateData"
          >
            <template #action="{ record }">
              <a-space>
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定要删除这个模板吗？"
                  @confirm="handleDelete(record)"
                >
                  <a style="color: #ff4d4f">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>

      <a-modal
        v-model:visible="visible"
        :title="activeTab === '1' ? 
          (editingMessage?.key ? '查看通知' : '新增通知') : 
          (editingMessage?.key ? '编辑模板' : '新增模板')"
        @ok="handleSave"
        width="600px"
      >
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <template v-if="activeTab === '1'">
            <a-form-item label="标题">
              <a-input v-model:value="editingMessage.title" />
            </a-form-item>
            <a-form-item label="类型">
              <a-select v-model:value="editingMessage.type">
                <a-select-option value="预约通知">预约通知</a-select-option>
                <a-select-option value="疫苗提醒">疫苗提醒</a-select-option>
                <a-select-option value="复诊提醒">复诊提醒</a-select-option>
                <a-select-option value="系统通知">系统通知</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="接收人">
              <a-input v-model:value="editingMessage.receiver" />
            </a-form-item>
            <a-form-item label="内容">
              <a-textarea v-model:value="editingMessage.content" :rows="4" />
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item label="模板名称">
              <a-input v-model:value="editingMessage.name" />
            </a-form-item>
            <a-form-item label="模板类型">
              <a-select v-model:value="editingMessage.type">
                <a-select-option value="预约通知">预约通知</a-select-option>
                <a-select-option value="疫苗提醒">疫苗提醒</a-select-option>
                <a-select-option value="复诊提醒">复诊提醒</a-select-option>
                <a-select-option value="系统通知">系统通知</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="模板内容">
              <a-textarea v-model:value="editingMessage.content" :rows="4" />
              <div style="margin-top: 8px; color: rgba(0,0,0,0.45)">
                可用变量：{客户姓名}、{宠物名称}、{预约时间}、{预约项目}、{时间}
              </div>
            </a-form-item>
          </template>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<style scoped>
.messages {
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

:deep(.ant-tabs-content) {
  width: 100%;
}

:deep(.ant-form) {
  width: 100%;
}

:deep(.ant-modal-content) {
  width: 100%;
}
</style>
