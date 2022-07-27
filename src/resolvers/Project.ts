import { User } from '@prisma/client'
import { Context } from '..'
import { userLoader } from '../loaders/userLoader'
interface IParent {
  id: string
  projectName: string
  details: string
  dueDate: string
  category: string
  users: [User]
}

export const Project = {
  // users: ({ authorID }: { authorID: string }, _: any, __: any) =>
  //   userLoader.load(+authorID),
  users: async (parent: IParent, _: any, { prisma }: Context) => {
    const userIds = parent.users.map((user) => user.id)

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    })

    return users
  },
}
