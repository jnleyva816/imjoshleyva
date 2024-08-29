import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../../api/graphql/posts'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function CreatePost() {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title && contents) {
      createPost()
    } else {
      alert('Please fill in both fields.')
    }
  }

  if (!token)
    return (
      <div className='ml-10 text-red-500'>
        Please log in to create a new post.
      </div>
    )

  return (
    <div className='flex flex-col items-center p-8 bg-stone-100 shadow-lg rounded-lg'>
      <h2 className='text-2xl font-bold mb-6 text-stone-700'>
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit} className='w-full max-w-lg'>
        <div className='mb-4'>
          <label
            htmlFor='create_title'
            className='block text-sm font-medium text-stone-700'
          >
            Title:
          </label>
          <input
            type='text'
            id='create_title'
            name='create_title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-2 mt-1 border border-stone-400 rounded-md bg-stone-50'
            placeholder='Enter your post title'
          />
        </div>
        <div className='mb-6'>
          <label
            htmlFor='create_contents'
            className='block text-sm font-medium text-stone-700'
          >
            Contents:
          </label>
          <textarea
            id='create_contents'
            name='create_contents'
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className='w-full p-2 mt-1 border border-stone-400 rounded-md bg-stone-50'
            rows='6'
            placeholder='Write your post contents here'
          />
        </div>
        <input
          type='submit'
          value={loading ? 'Creating...' : 'Create'}
          disabled={!title || !contents || loading}
          className='w-full p-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 transition-colors duration-200'
        />
        {data?.createPost && (
          <div className='mt-4 text-stone-700'>
            Post{' '}
            <Link
              to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
              className='text-blue-500 hover:underline'
            >
              {data.createPost.title}
            </Link>{' '}
            created successfully!
          </div>
        )}
      </form>
    </div>
  )
}
