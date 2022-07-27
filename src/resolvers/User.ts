import { Project } from '@prisma/client'
import { Context } from '../index'
interface IPrarent {
  id: string
  name: string
  email: string

  isOnline: boolean
  projects: [Project]
}

export const User = {
  projects: async (parent: IPrarent, _: any, { prisma }: Context) => {
    const projectIds = parent.projects.map((project) => project.id)
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
    })
    return projects
  },
}
