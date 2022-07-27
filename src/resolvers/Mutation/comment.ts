import { Comment } from '@prisma/client'
import { Context } from '../..'
interface ICommentArgs {
  comment: string
  projectId: string
}
interface CommentPayload {
  commentErrors: {
    message: string
  }[]
  comment: Comment | null
}
export const commentResolvers = {
  commentCreate: async (
    _: any,
    { comment, projectId }: ICommentArgs,
    { prisma, userInfo }: Context
  ): Promise<CommentPayload> => {
    try {
      if (!userInfo) {
        return {
          commentErrors: [
            {
              message: 'Please login to get access',
            },
          ],
          comment: null,
        }
      }

      if (!comment)
        return {
          commentErrors: [
            {
              message: 'Must provide comment content',
            },
          ],
          comment: null,
        }

      const newComment = await prisma.comment.create({
        data: {
          comment,
          userID: userInfo,
          projectID: Number(projectId),
        },
      })

      return {
        commentErrors: [],

        comment: newComment,
      }
    } catch (err) {
      console.log(err)
      return {
        commentErrors: [
          {
            message: 'something went wrong',
          },
        ],

        comment: null,
      }
    }
  },
}
