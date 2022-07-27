import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../key'
export const getUserFromToken = (token: string) => {
  const { userId } = jwt.verify(token, JWT_SECRET) as {
    userId: number
  }

  if (!userId) throw new Error('Please login to get access')
  return userId
}
