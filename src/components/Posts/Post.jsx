import PropTypes from 'prop-types'
import { User } from '../User'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({ title, contents, author, id, fullPost = false }) {
  return (
    <article className='mx-auto h-full w-full justify-center text-center'>
      {fullPost && (
        <>
          <h3 className='text-black text-2xl mt-24 md:text-4xl'>{title}</h3>
          <div className='h-full'>{contents}</div>
          {author && (
            <em className='text-sm font-thin'>
              <br />
              by <User {...author} />
            </em>
          )}
        </>
      )}
      {!fullPost && (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3 className='text-2xl font-mono'>{title}</h3>
        </Link>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
