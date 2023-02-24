export interface UserResponse {
  id: string
  name: string
  username: string
  phone: string
  email: string
  created: string
  modified: string
  isActive: boolean
}

export interface UserRequest {
  id: string
  name: string
  username: string
  phone: string
  email: string
}
