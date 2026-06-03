import { LocalStore } from '@/utils/comm'
import server from '@/utils/request'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable'

export interface CustomerDeviceQuery {
  terms?: any[]
  sorts?: any[]
  pageIndex?: number
  pageSize?: number
  [key: string]: any
}

export const queryCustomerDevice = (data?: CustomerDeviceQuery) => server.post('/customer/device/_query', data)

export const queryCustomerDevicePosition = () => server.post('/customer/device/queryPosition')

export const getCustomerDeviceLocation = () => server.get('/customer/device/getLocation')

export const syncCustomerDeviceState = (params?: CustomerDeviceQuery) => server.get('/customer/device/syncState', params)

export const deployAllCustomerDevice = (params?: CustomerDeviceQuery) => server.get('/customer/device/deployAll', params)

export const updateCustomerDevice = (data: Record<string, any>) => server.post('/customer/device/_update', data)

export const addCustomerDevice = (data: Record<string, any>) => server.patch('/customer/device/_add', data)

export const batchUpdateCustomerDevice = (data: Record<string, any>) => server.patch('/customer/device/batchUpdate', data)

export const countCustomerDevice = (data?: CustomerDeviceQuery) => server.post<number>('/customer/device/_count', data)

export const customerDeviceImport = (
  productId: string,
  fileUrl?: string,
  autoDeploy: boolean = true,
  speed: number = 32,
  fileId?: string
) => {
  const params = new URLSearchParams()
  params.set('autoDeploy', String(autoDeploy))
  params.set('speed', String(speed))

  if (fileUrl) {
    params.set('fileUrl', fileUrl)
  }

  if (fileId) {
    params.set('fileId', fileId)
  }

  params.set(`:${TOKEN_KEY}`, LocalStore.get(TOKEN_KEY) || '')

  return `${BASE_API_PATH}/customer/device/${productId}/import?${params.toString()}`
}

export const customerDeviceTemplateDownload = (productId: string, format: string) =>
  server.get(`/customer/device/${productId}/template.${format}`, {}, { responseType: 'blob' })

export const customerDeviceTemplateUrl = (productId: string, format: string) =>
  `${BASE_API_PATH}/customer/device/${productId}/template.${format}`

export const customerDeviceExport = (format: string, params?: any) =>
  server.get(`/customer/device/export.${format}`, params, { responseType: 'blob' })

export const executeFunctions = (deviceId: string, functionId: string, data?: Record<string, any>) =>
  server.post(`/device/instance/${deviceId}/function/${functionId}`, data)

export const query = queryCustomerDevice
export const queryPosition = queryCustomerDevicePosition
export const getLocation = getCustomerDeviceLocation
export const syncState = syncCustomerDeviceState
export const deployAll = deployAllCustomerDevice
export const update = updateCustomerDevice
export const add = addCustomerDevice
export const batchUpdate = batchUpdateCustomerDevice
export const count = countCustomerDevice
export const importDevice = customerDeviceImport
export const templateDownload = customerDeviceTemplateDownload
export const templateUrl = customerDeviceTemplateUrl
export const exportDevice = customerDeviceExport
export const execute = executeFunctions
