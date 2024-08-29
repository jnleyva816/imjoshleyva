import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
import { FaEye, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { User } from '../User'
import '../../assets/plant.jpg'

export function PostList({ posts = [] }) {
  return (
    <div className='space-y-8 px-4 lg:px-16'>
      {posts.map((post, index) => (
        <Link
          key={post._id}
          to={`/posts/${post.id}/${slug(post.title)}`}
          className={`relative flex ${
            index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
          } bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 mx-auto w-full md:w-3/4`}
        >
          <div
            className={`absolute inset-0 ${
              index % 2 === 0
                ? 'bg-gradient-to-l from-transparent via-white/80 to-white'
                : 'bg-gradient-to-r from-transparent via-white/80 to-white'
            } opacity-0 hover:opacity-60 transition-opacity duration-300`}
          ></div>
          <img
            src='src/assets/plant.jpg'
            alt='Plant'
            className='object-cover w-1/3 h-64'
          />
          <div className='p-6 flex flex-col justify-center w-2/3'>
            <h3 className='text-lg font-bold mb-2 text-gray-800 truncate'>
              {post.title}
            </h3>
            {post.author && (
              <em className='text-sm font-thin text-gray-600'>
                by <User {...post.author} />
              </em>
            )}
            <div className='flex justify-between items-center mt-4 text-gray-600'>
              <div className='flex items-center'>
                <FaEye className='mr-2' />
                <span>123 Views</span>
              </div>
              <div className='flex items-center'>
                <FaStar className='mr-2' />
                <span>4.5 Reviews</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
