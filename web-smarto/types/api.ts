export type RouteParams = Promise<{ id: string }>

export type KodeNodeRouteParams = Promise<{ kodeNode: string }>

export type ApiResponse<T> = {
  status: boolean
  message?: string
  data: T
}
