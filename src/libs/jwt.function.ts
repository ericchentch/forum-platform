const jwt = require('jsonwebtoken')

export const generateToken = (content: { userId: string }) => {
  const date = new Date()
  const exp = date.setDate(date.getDate() + 7)
  const contentJwt = {
    ...content,
    iat: Math.floor(Date.now() / 1000),
    exp: exp / 1000,
  }

  const token = jwt.sign(contentJwt, process.env.NEXT_PUBLIC_SECRET_JWT_KEY || '', {
    algorithm: 'HS512',
  })

  return `Bearer ${token}`
}

export const validateToken = (token: string) => {
  return jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_JWT_KEY || '', {
    algorithm: 'HS512',
  })
}
