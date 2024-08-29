import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

export const querySchema = `#graphql
input PostOptions {
  sortBy: String
  sortOrder: String
}
type Query {
    test: String
    posts(options:PostOptions): [Post!]!
    postsByAuthor(username: String!, options: PostOptions): [Post!]!
    postsByTag(tag: String!, options: PostOptions): [Post!]!
    postById(id: ID!, options: PostOptions): Post
    }
    `
export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
    posts: async (parent, { options }) => {
      return await listAllPosts(options)
    },
    postsByAuthor: async (parent, { username, options }) => {
      return await listPostsByAuthor(username, options)
    },
    postsByTag: async (parent, { tag, options }) => {
      return await listPostsByTag(tag, options)
    },
    postById: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}
