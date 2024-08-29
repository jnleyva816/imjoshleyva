import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' // Correct import
import { useAuth } from '../contexts/AuthContext'
import { User } from './User'
import { useQuery } from '@tanstack/react-query'
import { getUserInfo } from '../api/users.js'

export function Header() {
  const [token, setToken] = useAuth()
  const { sub } = token ? jwtDecode(token) : {}
  const userInforQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })
  const userInfo = userInforQuery.data

  return (
    <nav className='bg-stone-200  p-4 flex justify-between items-center mt-14'>
      <div className='flex items-center'>
        <Link
          to='/'
          className='text-xl font-bold text-stone-700 hover:text-stone-900 transition-colors duration-200'
        ></Link>
      </div>
      <div className='flex items-center space-x-4'>
        {token && userInfo ? (
          <>
            <span className='text-stone-700'>
              Logged in as <User {...userInfo} />
            </span>
            <button
              onClick={() => setToken(null)}
              className='px-4 py-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 transition-colors duration-200'
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='px-4 py-2 text-stone-700 hover:text-stone-900 transition-colors duration-200'
            >
              Log In
            </Link>
            <Link
              to='/signup'
              className='px-4 py-2 text-stone-700 hover:text-stone-900 transition-colors duration-200'
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
