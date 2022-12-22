import { gql } from 'apollo-server'
export const typeDefs = gql`
  type Query {
    projects(category: String!): [Project!]!
    comments(projectId: ID!): [Comment!]!

    users: [User!]!
    user(userId: ID!): User!
    project(projectId: ID!): Project!
    checkAuth: AuthPaylod!
  }
  type Project {
    id: ID!
    projectName: String!
    details: String!
    dueDate: String!
    category: String!
    createdBy: String!
    users: [User!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!

    isOnline: Boolean!
    projects: [Project!]!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    comment: String!
    createdAt: String
    user: User
    project: Project
  }

  type Mutation {
    projectCreate(
      projectName: String!
      details: String!
      dueDate: String!
      category: String!
      userIds: [UserId!]!
    ): ProjectPayload!

    projectDelete(projectId: ID!): ProjectPayload!

    commentCreate(comment: String!, projectId: ID!): CommentPayload!

    signup(credentials: CredentialsInput!, name: String!): AuthPaylod!
    signin(credentials: CredentialsInput!): AuthPaylod!
    signOut: AuthPaylod!
  }
  type ProjectPayload {
    projectErrors: [Error!]!
    project: Project
  }
  type CommentPayload {
    commentErrors: [Error!]!
    comment: Comment
  }
  type AuthPaylod {
    userErrors: [Error!]!
    user: User
    token: String
  }
  type Error {
    message: String!
  }
  type FilePayload {
    url: String
  }

  input UserId {
    id: Int
  }

  input ProjectInput {
    projectName: String!
    details: String!
    dueDate: String!
    category: String!
  }

  input CredentialsInput {
    email: String!
    password: String!
  }
`
