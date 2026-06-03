import server from '@/utils/request'

export interface DeviceJobQuery {
  terms?: any[]
  sorts?: any[]
  pageIndex?: number
  pageSize?: number
  [key: string]: any
}

export interface DeviceJobSaveRequest {
  id?: string
  deviceId?: string
  name?: string
  enabled?: boolean
  [key: string]: any
}

export const queryDeviceJob = (deviceId: string, data?: DeviceJobQuery) => server.post(`/deviceJob/${deviceId}/_query`, data)

export const createDeviceJob = (data: DeviceJobSaveRequest) => server.post('/deviceJob', data)

export const updateDeviceJob = (id: string, data: DeviceJobSaveRequest) => server.put(`/deviceJob/${id}`, data)

export const disableDeviceJob = (id: string) => server.put(`/deviceJob/${id}/_disable`)

export const enableDeviceJob = (id: string) => server.put(`/deviceJob/${id}/_enable`)

export const deleteDeviceJob = (id: string) => server.remove(`/deviceJob/${id}`)

export const queryDeviceJobExecuteLog = (id: string, data?: DeviceJobQuery) => server.post(`/deviceJob/${id}/execute/_query`, data)

export const query = queryDeviceJob
export const save = createDeviceJob
export const update = updateDeviceJob
export const disable = disableDeviceJob
export const enable = enableDeviceJob
export const remove = deleteDeviceJob
export const queryExecuteLog = queryDeviceJobExecuteLog
