<template>
  <a-layout style="min-height: 100vh">
    <a-layout-content style="padding: 24px">
      <a-card title="宠物预约看病" :bordered="false">
        <a-form :model="formState" :rules="rules" ref="formRef" layout="vertical">
          <a-form-item label="医生ID" name="doctorId">
            <a-select v-model:value="formState.doctorId">
              <a-select-option v-for="doc in doctorList" :key="doc.id" :value="doc.id">
                {{ doc.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="宠物名称" name="petName">
            <a-input v-model:value="formState.petName" placeholder="请输入宠物名称"/>
          </a-form-item>

          <a-form-item label="主人姓名" name="userName">
            <a-input v-model:value="formState.userName" placeholder="请输入主人姓名"/>
          </a-form-item>

          <a-form-item label="联系电话" name="phone">
            <a-input v-model:value="formState.phone" placeholder="请输入联系电话"/>
          </a-form-item>

          <a-form-item label="品种" name="variety">
            <a-input v-model:value="formState.variety" placeholder="请输入宠物品种"/>
          </a-form-item>

          <a-form-item label="年龄" name="age">
            <a-input v-model:value="formState.age" placeholder="请输入宠物年龄"/>
          </a-form-item>

          <a-form-item label="性别" name="gender">
            <a-select v-model:value="formState.gender">
              <a-select-option value="公">公</a-select-option>
              <a-select-option value="母">母</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="疫苗接种情况" name="vaccination">
            <a-radio-group v-model:value="formState.vaccination">
              <a-radio value="已接种">已接种</a-radio>
              <a-radio value="未接种">未接种</a-radio>
              <a-radio value="部分接种">部分接种</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="就诊类型" name="appointType">
            <a-select v-model:value="formState.appointType" placeholder="请选择就诊类型">
              <a-select-option value="0">年度体检</a-select-option>
              <a-select-option value="1">疫苗接种</a-select-option>
              <a-select-option value="2">病症诊治</a-select-option>
              <a-select-option value="3">手术</a-select-option>
              <a-select-option value="4">复查</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 预约日期 -->
          <a-form-item label="预约日期" name="appointDate">
            <a-date-picker
                v-model:value="formState.appointDate"
                style="width: 100%"
                placeholder="请选择预约日期"
                valueFormat="YYYY-MM-DD"
            />
          </a-form-item>

          <!-- 预约时间 -->
          <a-form-item label="预约时间" name="appointTime">
            <a-time-picker
                v-model:value="formState.appointTime"
                style="width: 100%"
                placeholder="请选择预约时间"
                format="HH:mm"
                :disabled-time="isToday ? disabledTime : undefined"
                valueFormat="HH:mm"
            />
          </a-form-item>

          <!-- 提交按钮 -->
          <a-form-item>
            <a-button type="primary" @click="handleSubmit">提交预约</a-button>
            <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import myAxios from "../../plugins/myAxios.js";
import dayjs from 'dayjs';

const doctorList = ref([]);

onMounted(async () => {
  const res = await myAxios.get('/doctor/list');
  if (res.code === 0) {
    doctorList.value = res.data;
  } else {
    message.error('获取医生列表失败');
  }
})

// 表单数据
const formState = reactive({
  doctorId: '',
  petName: '',
  userName: '',
  phone: '',
  vaccination: '',
  appointType: '',
  appointDate: null,
  appointTime: null,
  variety: '',
  age: '',
  gender: '',
})

// 表单验证规则
const rules = {
  doctorId: [{required: true, message: '请输入医生ID'}],
  petName: [{required: true, message: '请输入宠物名称'}],
  userName: [{required: true, message: '请输入主人姓名'}],
  phone: [
    {required: true, message: '请输入联系电话'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码'}
  ],
  vaccination: [{required: true, message: '请选择疫苗接种情况'}],
  appointType: [{required: true, message: '请选择就诊类型'}],
  appointDate: [{required: true, message: '请选择预约日期'}],
  appointTime: [{required: true, message: '请选择预约时间'}]
}

// 表单引用
const formRef = ref()

// 是否是今天
const isToday = ref(false)

// 处理日期变化
const handleDateChange = (date) => {
  const selectedDate = dayjs(date)
  const today = dayjs().startOf('day')
  isToday.value = selectedDate.isSame(today, 'day')
}

// 提交表单
const handleSubmit = async () => {
  formRef.value.validate();
  const res = await myAxios.post('/appoint/add', formState);
  if (res.code === 0) {
    handleReset()
    message.success('预约成功！')
  } else {
    message.error('预约失败')
  }
}

// 重置表单
const handleReset = () => {
  formRef.value.resetFields()
}

// 禁用当前时间之前的时间（仅当选择今天时生效）
const disabledTime = () => {
  const now = dayjs();
  return {
    disabledHours: () => {
      const hours = [];
      for (let i = 0; i < now.hour(); i++) {
        hours.push(i);
      }
      return hours;
    },
    disabledMinutes: (selectedHour) => {
      if (selectedHour === now.hour()) {
        const minutes = [];
        for (let i = 0; i < now.minute(); i++) {
          minutes.push(i);
        }
        return minutes;
      }
      return [];
    },
    disabledSeconds: (selectedHour, selectedMinute) => {
      if (selectedHour === now.hour() && selectedMinute === now.minute()) {
        const seconds = [];
        for (let i = 0; i < now.second(); i++) {
          seconds.push(i);
        }
        return seconds;
      }
      return [];
    }
  };
}
</script>

<style scoped>
.ant-card {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-form-item {
  margin-bottom: 16px;
}

.ant-btn {
  margin-right: 8px;
}
</style>