<template>
  <j-modal
    :visible="true"
    title="执行日志"
    width="900px"
    :footer="null"
    @cancel="$emit('close')"
  >
    <j-table
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
    />
  </j-modal>
</template>

<script setup lang="ts">
import moment from 'moment'
import { queryDeviceJobExecuteLog } from '@/api/deviceJob'

const props = defineProps<{ data?: Record<string, any> }>()
defineEmits(['close'])
const loading = ref(false)
const dataSource = ref<any[]>([])
const columns = [
  { title: '执行时间', dataIndex: 'createTime', key: 'createTime', customRender: ({ text }: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' },
  { title: '状态', dataIndex: 'state', key: 'state' },
  { title: '结果', dataIndex: 'result', key: 'result' },
]

const refresh = async () => {
  if (!props.data?.id) {
    return
  }
  loading.value = true
  const res = await queryDeviceJobExecuteLog(props.data.id, { paging: false }).finally(() => {
    loading.value = false
  })
  if (res.success) {
    dataSource.value = Array.isArray(res.result) ? res.result : res.result?.data || []
  }
}

onMounted(refresh)
</script>
