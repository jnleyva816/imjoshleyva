import { useState } from 'react'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { Helmet } from 'react-helmet-async'
import { GET_POSTS, GET_POSTS_BY_AUTHOR } from '../api/graphql/posts.js'
import { PostList } from '../components/Posts/PostList.jsx'
import { CreatePost } from '../components/Posts/CreatePost.jsx'
import { PostFilter } from '../components/Posts/PostFilter.jsx'
import { PostSorting } from '../components/Posts/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useGraphQLQuery(author ? GET_POSTS_BY_AUTHOR : GET_POSTS, {
    variables: {
      author,
      options: {
        sortBy,
        sortOrder,
      },
    },
  })

  const posts = postsQuery.data?.postsByAuthor ?? postsQuery.data?.posts ?? []

  return (
    <div className='bg-stone-200 min-h-screen'>
      <Helmet>
        <title>Full Stack React Blog</title>
        <meta
          name='description'
          content='A blog about full stack React development'
        />
      </Helmet>
      <Navbar />
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col space-y-6'>
          <CreatePost />
          <div className='flex justify-between items-center'>
            <PostFilter
              field='author'
              value={author}
              onChange={(value) => setAuthor(value)}
            />
            <PostSorting
              field={['createdAt', 'updatedAt']}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              orderValue={sortOrder}
              onOrderChange={(orderValue) => setSortOrder(orderValue)}
            />
          </div>
          {postsQuery.loading && <p>Loading...</p>}
          {postsQuery.error && <p>Error: {postsQuery.error.message}</p>}
          <div className='mt-10'>
            <PostList posts={posts} />
          </div>
        </div>
      </div>
    </div>
  )
}
