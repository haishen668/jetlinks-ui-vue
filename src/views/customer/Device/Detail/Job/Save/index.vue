<template>
  <j-modal
    :visible="true"
    :title="form.id ? '编辑任务' : '新增任务'"
    width="720px"
    @ok="submit"
    @cancel="$emit('close')"
  >
    <j-form layout="vertical">
      <j-form-item label="任务名称" required>
        <j-input v-model:value="form.name" placeholder="请输入任务名称" />
      </j-form-item>
      <j-form-item label="启用状态">
        <j-switch v-model:checked="form.enabled" />
      </j-form-item>
      <j-form-item label="说明">
        <j-textarea v-model:value="form.description" :rows="3" placeholder="请输入说明" />
      </j-form-item>
      <Timer v-model:value="form.timer" />
      <FunctionCall v-model:value="form.functionCall" />
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { createDeviceJob, updateDeviceJob } from '@/api/deviceJob'
import { onlyMessage } from '@/utils/comm'
import Timer from '../Timer/index.vue'
import FunctionCall from '../FunctionCall/index.vue'

const props = defineProps<{ data?: Record<string, any> }>()
const emit = defineEmits(['close', 'save'])
const form = reactive<Record<string, any>>({ enabled: true })

watch(
  () => props.data,
  (value) => {
    Object.assign(form, value || { enabled: true })
  },
  { immediate: true },
)

const submit = async () => {
  if (!form.name) {
    onlyMessage('请输入任务名称', 'warning')
    return
  }
  const res = form.id ? await updateDeviceJob(form.id, form) : await createDeviceJob(form)
  if (res.success) {
    onlyMessage('保存成功')
    emit('save')
  }
}
</script>
