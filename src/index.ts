import { ApolloServer } from 'apollo-server-express'
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
const startServer = async () => {
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
  await server.start()
  const app = express()
  app.use(express.static('public'))
  app.use(express.json())
  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, ({ url }) => {
    console.log(
      `🚀  Server is ready at ${url}
      📭  Query at https://studio.apollographql.com/dev`
    )
  })
}

startServer()
