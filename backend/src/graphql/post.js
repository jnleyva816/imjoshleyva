import { getUserInfoById } from '../services/users.js'

export const postSchema = `#graphql
type Post {
    id: ID!
    title: String!
    contents: String
    author: User
    tags: [String!]
    createdAt: Float
    updatedAt: Float
    }
    `
export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
  },
}
