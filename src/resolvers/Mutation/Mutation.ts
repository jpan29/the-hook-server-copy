import { projectResolvers } from './project'
import { authResolvers } from './auth'
import { commentResolvers } from './comment'
export const Mutation = {
  ...projectResolvers,
  ...authResolvers,
  ...commentResolvers,
}
