export type listUsers = {
  id: number
  name: string
  username: string
  email: string
  password?: string
  role_id: number
  role: string
  status: number
}



export type user = {
  id: number
  name: string
  username: string
  email: string
  roleId: number
  role: string
  status: number
}
