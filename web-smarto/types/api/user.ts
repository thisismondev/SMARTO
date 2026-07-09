export type UpdateUserInput = {
  name: string
  username: string
  email: string
  roleId: number
}

export type UpdatePasswordInput = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}