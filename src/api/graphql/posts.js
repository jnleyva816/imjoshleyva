import { gql } from '@apollo/client/core/index.js'

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    contents
    tags
    updatedAt
    createdAt
    author {
      username
    }
  }
`

export const GET_POSTS = gql`
  ${POST_FIELDS}
  query getPosts($options: PostOptions) {
    posts(options: $options) {
      ...PostFields
      author {
        username
      }
      id
      title
      contents
      tags
      updatedAt
      createdAt
    }
  }
`

export const GET_POSTS_BY_AUTHOR = gql`
  ${POST_FIELDS}
  query getPostsByAuthor($author: String!, $options: PostOptions) {
    postsByAuthor(username: $author, options: $options) {
      ...PostFields
    }
  }
`
export const CREATE_POST = gql`
  mutation createPost($title: String!, $contents: String!, $tags: [String!]) {
    createPost(title: $title, contents: $contents, tags: $tags) {
      id
      title
    }
  }
`
