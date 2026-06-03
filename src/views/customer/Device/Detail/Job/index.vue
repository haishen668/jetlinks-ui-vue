<template>
  <j-card>
    <template #title>任务管理</template>
    <template #extra>
      <j-space>
        <j-button type="primary" @click="openSave()">新增任务</j-button>
        <j-button @click="refresh">刷新</j-button>
      </j-space>
    </template>

    <j-table
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'enabled'">
          <j-badge :status="record.enabled ? 'success' : 'default'" />
          {{ record.enabled ? '启用' : '禁用' }}
        </template>
        <template v-if="column.key === 'action'">
          <j-space>
            <j-button type="link" @click="openSave(record)">编辑</j-button>
            <j-button type="link" @click="toggleJob(record)">
              {{ record.enabled ? '禁用' : '启用' }}
            </j-button>
            <j-button type="link" @click="openLog(record)">日志</j-button>
            <j-popconfirm title="确认删除任务?" @confirm="removeJob(record)">
              <j-button type="link" danger>删除</j-button>
            </j-popconfirm>
          </j-space>
        </template>
      </template>
    </j-table>

    <Save v-if="saveVisible" :data="currentJob" @close="saveVisible = false" @save="onSaved" />
    <Log v-if="logVisible" :data="currentJob" @close="logVisible = false" />
  </j-card>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@/store/instance'
import { onlyMessage } from '@/utils/comm'
import {
  deleteDeviceJob,
  disableDeviceJob,
  enableDeviceJob,
  queryDeviceJob,
} from '@/api/deviceJob'
import Save from './Save/index.vue'
import Log from './Log/index.vue'

const instanceStore = useInstanceStore()
const loading = ref(false)
const saveVisible = ref(false)
const logVisible = ref(false)
const currentJob = ref<any>()
const dataSource = ref<any[]>([])

const columns = [
  { title: '任务名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'enabled', key: 'enabled', width: 120 },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '操作', key: 'action', width: 260 },
]

const refresh = async () => {
  if (!instanceStore.current?.id) {
    dataSource.value = []
    return
  }
  loading.value = true
  const res = await queryDeviceJob(instanceStore.current.id, {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
  }).finally(() => {
    loading.value = false
  })
  if (res.success) {
    dataSource.value = Array.isArray(res.result) ? res.result : res.result?.data || []
  }
}

const openSave = (record?: any) => {
  currentJob.value = record ? { ...record } : { deviceId: instanceStore.current?.id, enabled: true }
  saveVisible.value = true
}

const openLog = (record: any) => {
  currentJob.value = record
  logVisible.value = true
}

const onSaved = () => {
  saveVisible.value = false
  refresh()
}

const toggleJob = async (record: any) => {
  const res = record.enabled ? await disableDeviceJob(record.id) : await enableDeviceJob(record.id)
  if (res.success) {
    onlyMessage('操作成功')
    refresh()
  }
}

const removeJob = async (record: any) => {
  const res = await deleteDeviceJob(record.id)
  if (res.success) {
    onlyMessage('删除成功')
    refresh()
  }
}

watch(
  () => instanceStore.current?.id,
  () => refresh(),
  { immediate: true },
)
</script>
