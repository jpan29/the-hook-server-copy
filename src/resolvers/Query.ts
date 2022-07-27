import { Project } from '@prisma/client'
import { Context } from '../index'

const Query = {
  projects: async (
    parent: any,
    { category }: { category: string },
    { prisma, userInfo }: Context
  ) => {
    let projects: Project[]
    if (category === 'All') {
      projects = await prisma.project.findMany({
        include: {
          users: true,
        },
      })
      return projects
    }
    if (category === 'Mine') {
      projects = await prisma.project.findMany({
        where: {
          users: {
            some: {
              id: userInfo,
            },
          },
        },
        include: {
          users: true,
        },
      })

      return projects
    }
    projects = await prisma.project.findMany({
      where: {
        category,
      },
      include: {
        users: true,
      },
    })
    return projects
  },

  project: async (
    _: any,
    { projectId }: { projectId: string },
    { prisma }: Context
  ) => {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(projectId),
        },
        include: {
          users: true,
        },
      })

      return project
    } catch (err) {
      console.log(err)
    }
  },

  users: async (_: any, __: any, { prisma }: Context) => {
    const users = await prisma.user.findMany({
      include: {
        projects: true,
      },
    })

    return users
  },
  user: async (_: any, { userId }: { userId: string }, { prisma }: Context) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          projects: true,
        },
      })

      return user
    } catch (err) {
      console.log(err)
    }
  },
  comments: async (
    _: any,
    { projectId }: { projectId: string },
    { prisma }: Context
  ) => {
    const comments = await prisma.comment.findMany({
      where: {
        projectID: Number(projectId),
      },
    })
    return comments
  },
  checkAuth: async (_: any, __: any, { prisma, userInfo }: Context) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userInfo,
      },
    })

    return {
      userErrors: [],
      user,
    }
  },
}

export default Query
