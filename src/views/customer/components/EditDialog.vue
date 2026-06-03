<template>
  <j-modal
    :visible="visible"
    :title="dialogTitle"
    :maskClosable="false"
    width="675px"
    class="edit-dialog-container"
    :confirmLoading="loading"
    cancelText="取消"
    okText="确定"
    @ok="confirm"
    @cancel="emits('update:visible', false)"
  >
    <j-form ref="formRef" :model="form.data" layout="vertical">
      <j-row v-if="form.IsShow('add', 'edit')" :gutter="24">
        <j-col :span="12">
          <j-form-item
            name="name"
            label="姓名"
            :rules="[
              { required: true, message: '请输入姓名' },
              { max: 64, message: '最多可输入64个字符' }
            ]"
          >
            <j-input v-model:value="form.data.name" placeholder="请输入姓名" />
          </j-form-item>
        </j-col>
        <j-col :span="12">
          <j-form-item
            name="username"
            label="用户名"
            :rules="[
              { required: true, message: '' },
              { validator: form.rules.checkUserName, trigger: 'blur' }
            ]"
          >
            <j-input
              v-model:value="form.data.username"
              placeholder="请输入用户名"
              :disabled="props.type === 'edit'"
            />
          </j-form-item>
        </j-col>
      </j-row>

      <j-row v-if="form.IsShow('add', 'reset')">
        <j-col :span="24">
          <j-form-item
            name="password"
            label="密码"
            :rules="[
              { required: true, message: '' },
              { validator: form.rules.checkPassword, trigger: 'change' }
            ]"
          >
            <j-input-password v-model:value="form.data.password" placeholder="请输入密码" />
          </j-form-item>
        </j-col>
      </j-row>

      <j-row v-if="form.IsShow('add', 'reset')">
        <j-col :span="24">
          <j-form-item
            name="confirmPassword"
            label="确认密码"
            :rules="[
              { required: true, message: '' },
              { validator: form.rules.checkAgainPassword, trigger: 'blur' }
            ]"
          >
            <j-input-password
              v-model:value="form.data.confirmPassword"
              placeholder="请再次输入密码"
              :maxlength="64"
            />
          </j-form-item>
        </j-col>
      </j-row>

      <j-row v-if="form.IsShow('add', 'edit')" :gutter="24">
        <j-col :span="12">
          <j-form-item
            name="telephone"
            label="手机号"
            :rules="[
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          >
            <j-input
              v-model:value="form.data.telephone"
              placeholder="请输入手机号"
              :maxlength="64"
            />
          </j-form-item>
        </j-col>
        <j-col :span="12">
          <j-form-item
            name="email"
            label="邮箱"
            :rules="[
              {
                pattern: /^\w+([-.+]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                message: '请输入正确的邮箱'
              }
            ]"
          >
            <j-input
              v-model:value="form.data.email"
              placeholder="请输入邮箱"
              :maxlength="64"
            />
          </j-form-item>
        </j-col>
      </j-row>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue'
import { onlyMessage } from '@/utils/comm'
import { passwordRegEx } from '@/utils/validate'
import {
  createCustomer,
  getCustomer,
  resetCustomerPassword,
  updateCustomer,
  validateCustomerField
} from '@/api/customer'

type DialogType = 'add' | 'edit' | 'reset'

interface Props {
  type: DialogType
  data: Record<string, any>
  visible: boolean
}

const emits = defineEmits(['confirm', 'update:visible'])
const props = defineProps<Props>()

const loading = ref(false)
const formRef = ref<FormInstance>()

const dialogTitle = computed(() => {
  if (props.type === 'add') return '新增'
  if (props.type === 'edit') return '编辑'
  if (props.type === 'reset') return '重置密码'
  return ''
})

const confirm = () => {
  loading.value = true
  formRef.value
    ?.validate()
    .then(() => form.submit())
    .then((resp: any) => {
      if (resp.status === 200) {
        onlyMessage('操作成功')
        emits('confirm')
        emits('update:visible', false)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const form = reactive({
  data: {} as Record<string, any>,
  rules: {
    checkUserName: (_rule: any, value: string) =>
      new Promise((resolve, reject) => {
        if (props.type === 'edit') return resolve('')
        if (value) {
          if (value.length > 64) return reject('最多可输入64个字符')
        } else {
          return reject('请输入用户名')
        }

        validateCustomerField('username', value).then((resp: any) => {
          resp.result.passed ? resolve('') : reject(resp.result.reason)
        })
      }),
    checkPassword: (_rule: any, value: string) =>
      new Promise((resolve, reject) => {
        if (value) {
          if (value.length > 64) return reject('最多可输入64个字符')
          if (value.length < 8) return reject('密码不能少于8位')
          if (!passwordRegEx(value)) return reject('密码必须包含大小写英文和数字')
        } else {
          return reject('请输入密码')
        }

        validateCustomerField('password', value).then((resp: any) => {
          resp.result.passed ? resolve('') : reject(resp.result.reason)
        })
      }),
    checkAgainPassword: (_rule: any, value: string) => {
      if (!value) return Promise.reject('请输入8~64位的密码')
      return value === form.data.password
        ? Promise.resolve()
        : Promise.reject('两次密码输入不一致')
    }
  },
  init: () => {
    form.getUserInfo()
  },
  getUserInfo: () => {
    const id = props.data.id || ''

    if (props.type === 'add') {
      form.data = {}
    } else if (props.type === 'reset') {
      form.data = { id }
    } else if (props.type === 'edit') {
      getCustomer(id).then((resp: any) => {
        form.data = {
          ...resp.result,
          orgIdList: resp.result.orgList?.map((item: any) => item.id) || [],
          roleIdList: resp.result.roleList?.map((item: any) => item.id) || []
        }

        nextTick(() => {
          formRef.value?.clearValidate()
        })
      })
    }
  },
  submit: () => {
    if (props.type === 'add') {
      return createCustomer({
        user: form.data,
        orgIdList: form.data.orgIdList,
        roleIdList: form.data.roleIdList
      })
    }

    if (props.type === 'edit') {
      return updateCustomer({
        id: form.data.id,
        user: form.data,
        roleIdList: form.data.roleIdList
      })
    }

    if (props.type === 'reset') {
      return resetCustomerPassword({
        id: form.data.id,
        password: form.data.password
      })
    }

    return Promise.reject()
  },
  IsShow: (...types: DialogType[]) => types.includes(props.type)
})

form.init()
</script>

<style scoped lang="less">
.edit-dialog-container {
  :deep(.ant-form-item) {
    margin-bottom: 18px;
  }
}
</style>
