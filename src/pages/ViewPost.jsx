import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Post } from '../components/Posts/Post'
import { getPostById } from '../api/posts'
import { Helmet } from 'react-helmet-async'
import { getUserInfo } from '../api/users'
import { useEffect, useState } from 'react'
import { postTrackEvent } from '../api/events'
import { PostStats } from '../components/Posts/PostStats'
import Navbar from '../components/Navbar/Navbar'

function truncate(str, max = 160) {
  if (!str) return str
  if (str.length > max) {
    return str.slice(0, max - 3) + '...'
  } else {
    return str
  }
}

export function ViewPost({ postId }) {
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, session, action }),
    onSuccess: (data) => setSession(data?.session),
  })
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      } else trackEventMutation.mutate('endView')
    }
  }, [])
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const userInforQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInforQuery.data ?? {}
  return (
    <div style={{ padding: 8 }} className='bg-stone-200 min-h-screen'>
      {post && (
        <Helmet>
          <title>{post.title} | Full Stack React Blog</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Navbar />
      <Header />
      <br />
      <br />
      <Link to='/blog'>Back to all posts</Link>
      <br />
      <hr />
      {post ? (
        <div>
          <Post {...post} id={postId} author={userInfo} fullPost />
          <hr />
          <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id ${postId} not found`
      )}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
