<template>
  <div class="setting-container">
    <a-card title="个人设置" :bordered="false">
      <!-- 头像和基本信息 -->
      <div class="profile">
        <!-- 头像 -->
        <div class="avatar-container">
          <a-avatar :size="100" :src="userInfo.avatar"/>
          <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleAvatarChange"
          >
            <a-button type="link" class="upload-btn">更换头像</a-button>
          </a-upload>
        </div>

        <!-- 基本信息 -->
        <div class="info">
          <div class="info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ userInfo.userName }}</span>
            <a-button type="link" @click="showEditModal('userName')">
              <template #icon>
                <EditOutlined/>
              </template>
            </a-button>
          </div>
          <div class="info-item">
            <span class="label">家庭住址：</span>
            <span class="value">{{ userInfo.address }}</span>
            <a-button type="link" @click="showEditModal('address')">
              <template #icon>
                <EditOutlined/>
              </template>
            </a-button>
          </div>
          <div class="info-item">
            <span class="label">联系电话：</span>
            <span class="value">{{ userInfo.phone }}</span>
            <a-button type="link" @click="showEditModal('phone')">
              <template #icon>
                <EditOutlined/>
              </template>
            </a-button>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 修改个人信息的弹窗 -->
    <a-modal
        v-model:visible="editModal.visible"
        :title="`修改${editModal.label}`"
        @ok="handleEditSubmit"
        @cancel="handleEditCancel"
    >
      <a-input v-model:value="editModal.value" :placeholder="`请输入${editModal.label}`"/>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {message} from 'ant-design-vue'
import {EditOutlined} from '@ant-design/icons-vue'

// 用户信息
const userInfo = reactive({
  avatar: 'https://via.placeholder.com/100', // 默认头像
  userName: '张三',
  address: '北京市朝阳区',
  phone: '13800138000'
})

// 修改信息的弹窗状态
const editModal = reactive({
  visible: false,
  label: '',
  field: '',
  value: ''
})

// 显示修改弹窗
const showEditModal = (field) => {
  editModal.visible = true
  editModal.field = field
  editModal.label = field === 'userName' ? '用户名' : field === 'address' ? '家庭住址' : '联系电话'
  editModal.value = userInfo[field]
}

// 提交修改
const handleEditSubmit = () => {
  userInfo[editModal.field] = editModal.value
  message.success('修改成功！')
  editModal.visible = false
}

// 取消修改
const handleEditCancel = () => {
  editModal.visible = false
}

// 头像上传前的校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
  }
  return isImage
}

// 头像上传成功后的处理
const handleAvatarChange = (info) => {
  if (info.file.status === 'done') {
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avatar = e.target.result
    }
    reader.readAsDataURL(info.file.originFileObj)
    message.success('头像上传成功！')
  }
}
</script>

<style scoped>
.setting-container{
  max-width: 600px;
}

.profile {
  display: flex;
  align-items: center;
}

.avatar-container {
  text-align: center;
  margin-right: 24px;
}

.upload-btn {
  margin-top: 8px;
}

.info {
  flex: 1;
}

.info-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.label {
  font-weight: bold;
  margin-right: 8px;
}

.value {
  margin-right: 8px;
}

.ant-card {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>