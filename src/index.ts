import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import { PrismaClient, Prisma } from '@prisma/client'
import Query from './resolvers/Query'
import { Mutation } from './resolvers/Mutation/Mutation'
import { Comment } from './resolvers/Comment'
import { User } from './resolvers/User'
import { Project } from './resolvers/Project'
import express from 'express'

import { getUserFromToken } from './utils/getUserFromToken'

export const prisma = new PrismaClient()
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
  userInfo: number
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Comment,
    User,
    Project,
  },
  context: ({ req }) => {
    const userInfo = req.headers.authorization
      ? getUserFromToken(req.headers.authorization as string)
      : null

    return {
      prisma,
      userInfo,
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server is running at ` + url)
})
