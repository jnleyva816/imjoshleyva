import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { LOGIN_USER } from '../api/graphql/users.js'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export function Login() {
  const [, setToken] = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [loginUser, { loading }] = useGraphQLMutation(LOGIN_USER, {
    variables: { username, password },
    onCompleted: (data) => {
      setToken(data.loginUser)
      navigate('/blog')
    },
    onError: (error) => {
      console.error(error)
      alert('Failed to login. Please check your credentials and try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) {
      loginUser()
    } else {
      alert('Please fill in both fields.')
    }
  }

  const handleGoogleLogin = () => {
    // Add logic for Google login
    alert('Google login clicked')
  }

  const handleGithubLogin = () => {
    // Add logic for GitHub login
    alert('GitHub login clicked')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-stone-100'>
      <div className='flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-stone-200 shadow-lg'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-stone-300 shadow-lg rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold mb-6 text-center text-stone-700'>
            Log in to Your Account
          </h2>
          <div className='mb-4'>
            <label
              htmlFor='create-username'
              className='block text-sm font-medium text-stone-700'
            >
              Username:
            </label>
            <input
              id='create-username'
              name='create-username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 mt-1 border border-stone-400 rounded-md bg-stone-50'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='create-password'
              className='block text-sm font-medium text-stone-700'
            >
              Password:
            </label>
            <input
              id='create-password'
              name='create-password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 mt-1 border border-stone-400 rounded-md bg-stone-50'
            />
          </div>
          <input
            type='submit'
            value={loading ? 'Logging in...' : 'Log in'}
            disabled={!username || !password || loading}
            className='w-full p-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 transition-colors duration-200'
          />
          <div className='mt-4 flex justify-between'>
            <button
              type='button'
              onClick={handleGoogleLogin}
              className='flex items-center justify-center w-full p-2 bg-stone-400 text-white rounded-md hover:bg-stone-500 transition-colors duration-200'
            >
              <FaGoogle className='mr-2' /> Google Login
            </button>
            <button
              type='button'
              onClick={handleGithubLogin}
              className='flex items-center justify-center w-full p-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors duration-200 ml-2'
            >
              <FaGithub className='mr-2' /> GitHub Login
            </button>
          </div>
          <div className='mt-6 text-center'>
            <Link to='/blog' className='text-stone-500 hover:underline'>
              Back to main page
            </Link>
          </div>
        </form>
      </div>
      <div className='hidden md:flex w-full md:w-1/2 justify-center items-center p-8 bg-stone-300'>
        <img
          src='your-minimal-image-url-here'
          alt='Login Visual'
          className='w-full max-w-xs object-contain rounded-lg shadow-lg'
        />
      </div>
    </div>
  )
}
