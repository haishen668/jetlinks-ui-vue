<template>
  <page-container>
    <div class="user-container">
      <pro-search
        :columns="columns"
        target="customer"
        type="simple"
        @search="handleSearch"
      />
      <FullPage>
        <JProTable
          ref="tableRef"
          :columns="columns"
          :request="queryCustomer"
          model="TABLE"
          :params="params"
          :defaultParams="{
            pageSize: 10,
            sorts: [{ name: 'createTime', order: 'desc' }]
          }"
          :pagination="{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }"
        >
          <template #headerTitle>
            <PermissionButton
              :hasPermission="`${permission}:add`"
              type="primary"
              @click="actions.openDialog('add')"
            >
              <AIcon type="PlusOutlined" />
              新增
            </PermissionButton>
          </template>

          <template #status="slotProps">
            <BadgeStatus
              :status="slotProps.status"
              :text="slotProps.status ? '正常' : '禁用'"
              :statusNames="{ 1: 'success', 0: 'error' }"
            />
          </template>

          <template #action="slotProps">
            <j-space :size="16">
              <PermissionButton
                :hasPermission="`${permission}:update`"
                type="link"
                :tooltip="{ title: '编辑' }"
                @click="actions.openDialog('edit', slotProps)"
              >
                <AIcon type="EditOutlined" />
              </PermissionButton>
              <PermissionButton
                :hasPermission="`${permission}:action`"
                type="link"
                :tooltip="{ title: slotProps.status ? '禁用' : '启用' }"
                :popConfirm="{
                  title: `确定${slotProps.status ? '禁用' : '启用'}吗？`,
                  onConfirm: () => actions.changeStatus(slotProps)
                }"
              >
                <AIcon :type="slotProps.status ? 'StopOutlined' : 'PlayCircleOutlined'" />
              </PermissionButton>
              <PermissionButton
                :hasPermission="`${permission}:update`"
                type="link"
                :tooltip="{ title: '重置密码' }"
                @click="actions.openDialog('reset', slotProps)"
              >
                <AIcon type="icon-zhongzhimima" />
              </PermissionButton>
              <PermissionButton
                :hasPermission="`${permission}:delete`"
                type="link"
                :tooltip="{ title: slotProps.status ? '请先禁用，再删除' : '删除' }"
                :popConfirm="{
                  title: '确认删除',
                  onConfirm: () => actions.clickDel(slotProps.id)
                }"
                :disabled="slotProps.status"
              >
                <AIcon type="DeleteOutlined" />
              </PermissionButton>
            </j-space>
          </template>
        </JProTable>
      </FullPage>

      <EditDialog
        v-if="dialog.visible"
        v-model:visible="dialog.visible"
        :type="dialog.type"
        :data="dialog.selectItem"
        @confirm="actions.refresh"
      />
    </div>
  </page-container>
</template>

<script setup lang="ts" name="CustomerMange">
import { onlyMessage } from '@/utils/comm'
import PermissionButton from '@/components/PermissionButton/index.vue'
import BadgeStatus from '@/components/BadgeStatus/index.vue'
import EditDialog from './components/EditDialog.vue'
import { changeCustomerStatus, deleteCustomer, queryCustomer } from '@/api/customer'

type DialogType = 'add' | 'edit' | 'reset' | ''

const permission = 'customer'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: { type: 'string', defaultTermType: 'like' }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    ellipsis: true,
    search: { type: 'string', defaultTermType: 'eq' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    ellipsis: true,
    search: {
      rename: 'status',
      type: 'select',
      defaultTermType: 'eq',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    scopedSlots: true
  },
  {
    title: '手机号',
    dataIndex: 'userDetail.telephone',
    key: 'telephone',
    ellipsis: true,
    search: { defaultTermType: 'eq', type: 'string' }
  },
  {
    title: '邮箱',
    dataIndex: 'userDetail.email',
    key: 'email',
    ellipsis: true,
    search: { defaultTermType: 'eq', type: 'string' }
  },
  {
    title: '创建人',
    dataIndex: 'creator.username',
    key: 'creator',
    ellipsis: true,
    search: { defaultTermType: 'eq', type: 'string' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 150,
    scopedSlots: true
  }
]

const params = ref<Record<string, any>>({})
const tableRef = ref()

const dialog = reactive({
  selectItem: {} as Record<string, any>,
  visible: false,
  type: '' as DialogType
})

const actions = {
  openDialog: (type: DialogType, data?: Record<string, any>) => {
    dialog.selectItem = { ...(data || {}) }
    dialog.type = type
    dialog.visible = true
  },
  changeStatus: ({ id, status }: { id: string; status: number }) => {
    changeCustomerStatus({ id, status: status === 0 ? 1 : 0 }).then(() => {
      onlyMessage('操作成功')
      actions.refresh()
    })
  },
  clickDel: (id: string) => {
    deleteCustomer(id).then(() => {
      onlyMessage('操作成功')
      actions.refresh()
    })
  },
  refresh: () => {
    tableRef.value?.reload()
  }
}

const handleSearch = (searchParams?: Record<string, any>) => {
  const terms = searchParams?.terms?.map((item: any) => {
    const extraTerms: any[] = []
    item.terms = item.terms.map((term: any) => term)
    if (extraTerms.length) {
      item.terms = [...item.terms, ...extraTerms]
    }
    return item
  })

  params.value = { terms: terms || [] }
}
</script>

<style scoped lang="less">
.user-container {
  height: 100%;
}
</style>
