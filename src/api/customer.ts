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

export const createCustomer = (data: SaveCustomerRequest) => server.post<string>('/customer/_create', data)

export const updateCustomer = (userId: string, data: SaveCustomerRequest) => server.put<string>(`/customer/${userId}/_update`, data)

export const getCustomer = (userId: string) => server.get(`/customer/${userId}`)

export const queryCustomer = (data?: CustomerQuery) => server.post('/customer/_query', data)

export const queryCustomerNoPaging = (data?: CustomerQuery) => server.post('/customer/no-paging/_query', data)

export const getCurrentCustomer = () => server.get('/customer')

export const saveCurrentCustomer = (data: Record<string, any>) => server.put('/customer', data)

export const query = queryCustomer
export const queryNoPaging = queryCustomerNoPaging
export const detail = getCustomer
export const save = createCustomer
export const update = updateCustomer
