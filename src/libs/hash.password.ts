import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12)
  return hashedPassword
}

export const comparePassword = async (rawPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(rawPassword, hashedPassword)
}
