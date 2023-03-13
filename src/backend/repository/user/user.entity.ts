export interface UserEntity {
  id: number
  userId: string
  name: string
  username: string
  password: string
  phone: string
  email: string
  created: Date
  modified: Date | null
  isActive: number
}
