import { Context } from '..'
interface IUserParent {
  userID: number
}
export const Comment = {
  user: async ({ userID }: IUserParent, _: any, { prisma }: Context) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    })
    return user
  },
}
