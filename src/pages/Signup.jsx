import { useState } from 'react'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useNavigate, Link } from 'react-router-dom'
import { SIGNUP_USER } from '../api/graphql/users'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [signupUser, { loading }] = useGraphQLMutation(SIGNUP_USER, {
    variables: { username, password },
    onCompleted: () => navigate('/login'),
    onError: () => alert('Failed to sign up'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) {
      signupUser()
    } else {
      alert('Please fill in both fields.')
    }
  }

  const handleGoogleSignup = () => {
    // Add logic for Google signup
    alert('Google signup clicked')
  }

  const handleGithubSignup = () => {
    // Add logic for GitHub signup
    alert('GitHub signup clicked')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-stone-100'>
      <div className='flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-stone-200 shadow-lg'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-stone-300 shadow-lg rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold mb-6 text-center text-stone-700'>
            Create Your Account
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
            value={loading ? 'Signing up...' : 'Sign up'}
            disabled={!username || !password || loading}
            className='w-full p-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 transition-colors duration-200'
          />
          <div className='mt-4 flex justify-between'>
            <button
              type='button'
              onClick={handleGoogleSignup}
              className='flex items-center justify-center w-full p-2 bg-stone-400 text-white rounded-md hover:bg-stone-500 transition-colors duration-200'
            >
              <FaGoogle className='mr-2' /> Google Signup
            </button>
            <button
              type='button'
              onClick={handleGithubSignup}
              className='flex items-center justify-center w-full p-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors duration-200 ml-2'
            >
              <FaGithub className='mr-2' /> GitHub Signup
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
          alt='Signup Visual'
          className='w-full max-w-xs object-contain rounded-lg shadow-lg'
        />
      </div>
    </div>
  )
}
