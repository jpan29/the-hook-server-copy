import { Project, User } from '@prisma/client'
import { Context } from '../..'

export interface IProject {
  projectName: string
  details: string
  dueDate: string
  category: string
  userIds: {}[]
  createdBy?: string
}

interface ProjectPayload {
  projectErrors: {
    message: string
  }[]
  project: Project | null
}
export const projectResolvers = {
  projectCreate: async (
    _: any,
    { projectName, details, dueDate, category, userIds }: IProject,
    { prisma, userInfo }: Context
  ): Promise<ProjectPayload> => {
    if (!userInfo) {
      return {
        projectErrors: [
          {
            message: 'Please login to get access',
          },
        ],
        project: null,
      }
    }

    if (!projectName || !details || !dueDate || !category || !userIds)
      return {
        projectErrors: [
          {
            message:
              'Must provide projectName,details,dueDate,category and users',
          },
        ],
        project: null,
      }
    const user = (await prisma.user.findUnique({
      where: {
        id: userInfo,
      },
    })) as User

    const newProject = await prisma.project.create({
      data: {
        projectName,
        details,
        dueDate,
        createdBy: user.name,
        category,
        users: {
          connect: userIds,
        },
      },
      include: { users: true },
    })

    return {
      projectErrors: [],
      project: newProject,
    }
  },

  // projectUpdate: async (
  //   _: any,
  //   { projectId, project }: { projectId: string; project: IProject },
  //   { prisma, userInfo }: Context
  // ): Promise<ProjectPayload> => {
  //   if (!userInfo)
  //     return {
  //       userErrors: [
  //         {
  //           message: 'Please login again',
  //         },
  //       ],
  //       project: null,
  //     }
  //   const { projectName, details, dueDate, category } = project
  //   if (!projectName && !details && !dueDate && !category) {
  //     return {
  //       userErrors: [
  //         {
  //           message: 'Need to have at least one filed',
  //         },
  //       ],
  //       project: null,
  //     }
  //   }
  //   const existingPost = await prisma.project.findUnique({
  //     where: { id: Number(projectId) },
  //   })

  //   if (!existingPost) {
  //     {
  //       return {
  //         userErrors: [
  //           {
  //             message: 'No post found',
  //           },
  //         ],
  //         project: null,
  //       }
  //     }
  //   }
  //   let filedsToUpdate = {
  //     projectName,
  //     details,
  //     dueDate,
  //     category,
  //   }
  //   // if (!projectName) delete filedsToUpdate.projectName
  //   // if (!details) delete filedsToUpdate.details
  //   // if (!dueDate) delete filedsToUpdate.projectName
  //   // if (!category ) delete filedsToUpdate.category
  //   const updateProject = await prisma.project.update({
  //     data: {
  //       ...filedsToUpdate,
  //     },
  //     where: {
  //       id: Number(projectId),
  //     },
  //   })
  //   return {
  //     userErrors: [],
  //     project: updateProject,
  //   }
  // },
  projectDelete: async (
    _: any,
    { projectId }: { projectId: string },
    { prisma, userInfo }: Context
  ): Promise<ProjectPayload> => {
    try {
      if (!userInfo)
        return {
          projectErrors: [
            {
              message: 'Please login again',
            },
          ],
          project: null,
        }
      await prisma.project.update({
        where: {
          id: Number(projectId),
        },
        data: {
          users: {
            set: [],
          },
        },
      })
      const project = await prisma.project.delete({
        where: {
          id: Number(projectId),
        },
      })

      return {
        projectErrors: [
          {
            message: '',
          },
        ],
        project: null,
      }
    } catch (err) {
      return {
        projectErrors: [
          {
            message: `${err}`,
          },
        ],
        project: null,
      }
    }
  },
}
