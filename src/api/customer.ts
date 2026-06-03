import server from '@/utils/request'

export interface CustomerQuery {
  terms?: any[]
  sorts?: any[]
  pageIndex?: number
  pageSize?: number
  [key: string]: any
}

export interface SaveCustomerRequest {
  user?: Record<string, any>
  detail?: Record<string, any>
  orgIdList?: string[]
  roleIdList?: string[]
  [key: string]: any
}

export const queryCustomerNoPaging = (data?: CustomerQuery) => server.post('/customer/no-paging/_query', data)

export const queryCustomer = (data?: CustomerQuery) => server.post('/customer/_query', data)

export const validateCustomerField = (type: 'username' | 'password', value: string) =>
  server.post(`/user/${type}/_validate`, value, {}, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })

export const getCustomer = (userId: string) => server.get(`/customer/${userId}`)

export const getCustomerLocation = () => server.get('/customer/device/getLocation')

export const createCustomer = (data: SaveCustomerRequest) => server.post<string>('/customer/_create', data)

export const updateCustomer = (data: SaveCustomerRequest & { id: string }) => server.put<string>(`/customer/${data.id}/_update`, data)

export const resetCustomerPassword = (data: { id: string; password: string }) =>
  server.post(`/user/${data.id}/password/_reset`, data.password, {}, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })

export const changeCustomerStatus = (data: Record<string, any>) => server.patch('/user', data)

export const deleteCustomer = (id: string) => server.remove(`/user/${id}`)

export const getCurrentCustomer = () => server.get('/customer')

export const saveCurrentCustomer = (data: Record<string, any>) => server.put('/customer', data)

export const query = queryCustomer
export const queryNoPaging = queryCustomerNoPaging
export const detail = getCustomer
export const validateField = validateCustomerField
export const save = createCustomer
export const update = updateCustomer
export const resetPassword = resetCustomerPassword
export const changeStatus = changeCustomerStatus
export const remove = deleteCustomer
