import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Context } from '../../index'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../key'
import { User } from '@prisma/client'

interface AuthArgs {
  credentials: {
    email: string
    password: string
  }
  name: string
}
interface AuthPayload {
  userErrors: {
    message: string
  }[]
  user: User | null
  token: string | null
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name }: AuthArgs,
    { prisma }: Context
  ): Promise<AuthPayload> => {
    const { email, password } = credentials

    const isEmail = validator.isEmail(email)
    const isValidPassword = validator.isLength(password, {
      min: 6,
    })

    if (!isEmail || !isValidPassword)
      return {
        userErrors: [
          {
            message: 'Invalid email or Invalid password',
          },
        ],
        user: null,
        token: null,
      }
    if (!name)
      return {
        userErrors: [
          {
            message: 'Name can not be empty',
          },
        ],
        user: null,
        token: null,
      }
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (user)
      return {
        userErrors: [
          {
            message: 'Email has been already used',
          },
        ],
        user: null,
        token: null,
      }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        name,

        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return {
      userErrors: [],
      user: newUser,
      token,
    }
  },
  signin: async (
    _: any,
    { credentials }: { credentials: AuthArgs['credentials'] },
    { prisma }: Context
  ): Promise<AuthPayload> => {
    const { email, password } = credentials
    if (!email || !password) {
      return {
        userErrors: [
          {
            message: 'Please input valid email and password',
          },
        ],
        user: null,
        token: null,
      }
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user)
      return {
        userErrors: [
          {
            message: 'No user with this email',
          },
        ],
        user: null,
        token: null,
      }

    if (!(await bcrypt.compare(password, user.password)))
      return {
        userErrors: [
          {
            message: 'Invalid password',
          },
        ],
        user: null,
        token: null,
      }
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isOnline: true,
      },
    })
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return {
      userErrors: [],
      user,
      token,
    }
  },
  signOut: async (
    _: any,
    __: any,
    { prisma, userInfo }: Context
  ): Promise<AuthPayload> => {
    const user = await prisma.user.update({
      where: {
        id: userInfo,
      },
      data: {
        isOnline: false,
      },
    })

    return {
      userErrors: [],
      user,
      token: null,
    }
  },
}
