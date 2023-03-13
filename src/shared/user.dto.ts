export interface UserResponse {
  userId: string
  name: string
  username: string
  phone: string
  email: string
  created: string
  modified: string
  isActive: boolean
}

export interface UserRequest {
  userId: string
  name: string
  username: string
  phone: string
  email: string
}
