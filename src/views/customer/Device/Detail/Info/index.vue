<template>
  <j-spin :spinning="loading" :tip="loadingTip">
    <j-descriptions bordered>
      <template #title>
        基本信息
        <div class="action-list">
          <template v-for="(action, index) in functionActions" :key="action.id">
            <j-dropdown v-if="action.id === 'switch_card'">
              <PermissionButton
                type="link"
                style="background-color: #315efb; color: #fff; margin-right: 16px"
                hasPermission="customer/Device:action"
              >
                <AIcon type="SwitcherOutlined" />
                切换卡片
              </PermissionButton>
              <template #overlay>
                <j-menu>
                  <j-menu-item
                    v-for="menu in action.menus"
                    :key="menu.value"
                    @click="executeFunction(action, { [action.inputs?.[0]?.id || 'operator']: menu.value })"
                  >
                    {{ menu.text }}
                  </j-menu-item>
                </j-menu>
              </template>
            </j-dropdown>
            <PermissionButton
              v-else
              type="link"
              style="background-color: #315efb; color: #fff; margin-right: 16px"
              hasPermission="customer/Device:action"
              :popConfirm="{
                title: `确定${action.name}吗?`,
                onConfirm: () => executeFunction(action),
              }"
            >
              <AIcon :type="buttonIcons[index] || 'PlayCircleOutlined'" />
              {{ action.name }}
            </PermissionButton>
          </template>
        </div>
      </template>
      <j-descriptions-item label="绑定用户">{{ current?.realName }}</j-descriptions-item>
      <j-descriptions-item label="点位名称">{{ current?.name }}</j-descriptions-item>
      <j-descriptions-item label="产品名称">{{ current?.productName }}</j-descriptions-item>
      <j-descriptions-item label="品牌">{{ current?.brand }}</j-descriptions-item>
      <j-descriptions-item label="型号">{{ current?.model }}</j-descriptions-item>
      <j-descriptions-item label="设备类型">{{ current?.deviceType?.text }}</j-descriptions-item>
      <j-descriptions-item label="MAC地址">{{ current?.mac }}</j-descriptions-item>
      <j-descriptions-item label="IMEI">{{ current?.imei }}</j-descriptions-item>
      <j-descriptions-item label="固件版本">{{ current?.firmwareVersion }}</j-descriptions-item>
      <j-descriptions-item label="连接协议">{{ current?.transport }}</j-descriptions-item>
      <j-descriptions-item label="注册时间">{{ formatTime(current?.createTime) }}</j-descriptions-item>
      <j-descriptions-item label="已运行">{{ runningTime }}</j-descriptions-item>
      <j-descriptions-item label="装机地址" :span="3">{{ current?.location }}</j-descriptions-item>
      <j-descriptions-item label="说明" :span="3">{{ current?.description }}</j-descriptions-item>
    </j-descriptions>

    <j-descriptions bordered style="margin-top: 16px">
      <template #title>联网信息</template>
      <j-descriptions-item label="运营商">{{ current?.operator }}</j-descriptions-item>
      <j-descriptions-item label="卡号">{{ activeCard?.iccid }}</j-descriptions-item>
      <j-descriptions-item label="公网IP">{{ publicIp }}</j-descriptions-item>
      <j-descriptions-item label="网络类型">{{ current?.network }}</j-descriptions-item>
      <j-descriptions-item label="RSRP(dBm)">{{ current?.rsrp }}</j-descriptions-item>
      <j-descriptions-item label="RSRQ(dBm)">{{ current?.rsrq }}</j-descriptions-item>
      <j-descriptions-item label="SINR(dB)">{{ current?.sinr }}</j-descriptions-item>
      <j-descriptions-item label="2.4G终端数">{{ current?.t24gNum }}</j-descriptions-item>
      <j-descriptions-item label="5G终端数">{{ current?.t5gNum }}</j-descriptions-item>
      <j-descriptions-item label="最近上线时间">{{ formatTime(current?.onlineTime) }}</j-descriptions-item>
      <j-descriptions-item label="最近离线时间">{{ formatTime(current?.offlineTime) }}</j-descriptions-item>
    </j-descriptions>

    <j-descriptions bordered style="margin-top: 16px" v-if="current?.id">
      <template #title>
        自动切卡
        <PermissionButton
          style="background-color: #315efb; color: #fff; margin-left: 16px"
          hasPermission="customer/Device:action"
          :popConfirm="{ title: '确定下发配置吗?', onConfirm: sendPingConfig }"
        >
          <AIcon type="SyncOutlined" />
          下发配置
        </PermissionButton>
      </template>
      <j-descriptions-item label="功能状态">{{ current?.switchState === '1' ? '启用' : '禁用' }}</j-descriptions-item>
      <j-descriptions-item label="同步状态">
        <j-badge :status="current?.syncFlag === '1' ? 'success' : 'error'" />
        {{ current?.syncFlag === '1' ? '已同步' : '未同步' }}
      </j-descriptions-item>
      <j-descriptions-item label="重试次数">{{ current?.pingRetry }}</j-descriptions-item>
      <j-descriptions-item label="服务器地址1">{{ pingAddrs[0] }}</j-descriptions-item>
      <j-descriptions-item label="服务器地址2">{{ pingAddrs[1] }}</j-descriptions-item>
      <j-descriptions-item label="服务器地址3">{{ pingAddrs[2] }}</j-descriptions-item>
    </j-descriptions>
  </j-spin>
</template>

<script setup lang="ts">
import moment from 'moment'
import { onlyMessage } from '@/utils/comm'
import { useInstanceStore } from '@/store/instance'
import { executeFunctions } from '@/api/customerDevice'

const instanceStore = useInstanceStore()
const loading = ref(false)
const loadingTip = ref('连接中...')
const buttonIcons = ['PlayCircleOutlined', 'SwitcherOutlined', 'EyeOutlined', 'SyncOutlined']

const current = computed<any>(() => instanceStore.current || {})
const metadata = computed(() => {
  try {
    return JSON.parse(current.value?.metadata || '{}')
  } catch (e) {
    return {}
  }
})

const subDomain = computed(() => current.value?.subDomain)
const activeCard = computed(() => current.value?.cards?.find((card: any) => card.useState === 1))
const pingAddrs = computed(() => (current.value?.pingAddr || '').split(','))
const publicIp = computed(() => {
  const address = current.value?.address || ''
  if (!address.includes(':')) {
    return ''
  }
  return address.substring(1, address.indexOf(':'))
})

const runningTime = computed(() => {
  if (!current.value?.onlineTime || current.value?.state?.value !== 'online') {
    return '-'
  }
  const duration = moment.duration(moment().diff(moment(current.value.onlineTime)))
  const parts = []
  if (duration.days() > 0) {
    parts.push(`${duration.days()}天`)
  }
  if (duration.hours() > 0) {
    parts.push(`${duration.hours()}时`)
  }
  if (duration.minutes() > 0) {
    parts.push(`${duration.minutes()}分`)
  }
  return parts.join('') || '-'
})

const functionActions = computed(() => {
  const actions: any[] = []
  metadata.value?.functions?.forEach((item: any) => {
    if (item.id === 'ping_config') {
      return
    }
    if (item.id === 'switch_card') {
      actions.push({
        ...item,
        menus: [
          { text: '使用联通', value: 0 },
          { text: '使用移动', value: 1 },
          { text: '使用电信', value: 2 },
        ],
      })
      return
    }
    if (item.id === 'restart' && item.inputs?.[0]) {
      item.inputs[0].value = 3
    }
    if (item.id === 'reweb' && item.inputs?.[0]) {
      item.inputs[0].value = subDomain.value
    }
    if (item.id === 'get_loc' && item.inputs?.[0]) {
      item.inputs[0].value = 1
    }
    actions.push(item)
  })
  return actions
})

const pingConfigFunction = computed(() =>
  metadata.value?.functions?.find((item: any) => item.id === 'ping_config'),
)

const formatTime = (value?: number) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '')

const buildPayload = (action: any, values: Record<string, any> = {}) => {
  const payload: Record<string, any> = {}
  ;(action.inputs || []).forEach((input: any) => {
    payload[input.id] = values[input.id] ?? input.value
  })
  return payload
}

const openReweb = (seconds: number) => {
  let left = seconds
  const tick = () => {
    loadingTip.value = `页面跳转倒计${left}秒`
    if (left <= 0) {
      loading.value = false
      loadingTip.value = '连接中...'
      window.open(`http://${subDomain.value}.reweb.wugee.net.cn`, '_blank')
      return
    }
    left -= 1
    window.setTimeout(tick, 1000)
  }
  tick()
}

const executeFunction = async (action: any, values: Record<string, any> = {}) => {
  if (!current.value?.id) {
    return
  }
  loading.value = true
  const res = await executeFunctions(current.value.id, action.id, buildPayload(action, values)).finally(() => {
    loading.value = false
  })
  if (res.success) {
    onlyMessage(action.id === 'reweb' ? '设备连接成功' : '操作成功')
    if (action.id === 'reweb') {
      loading.value = true
      openReweb(5)
    }
  }
}

const sendPingConfig = () => {
  const action = pingConfigFunction.value
  if (!action) {
    onlyMessage('未找到自动切卡物模型功能', 'warning')
    return
  }
  action.inputs[0].value = current.value?.switchState
  action.inputs[1].value = current.value?.switchState === '1' ? current.value?.pingAddr : ''
  action.inputs[2].value = current.value?.switchState === '1' ? current.value?.pingRetry : ''
  executeFunction(action)
}
</script>

<style scoped>
.action-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 16px;
}
</style>
