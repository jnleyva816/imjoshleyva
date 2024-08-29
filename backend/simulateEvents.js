import dotenv from 'dotenv'
dotenv.config()

import { initDatabase } from './src/db/init.js'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/events.js'
import { createUser } from './src/services/users.js'
import { createPost } from './src/services/posts.js'
import { trackEvent } from './src/services/events.js'

const simulationStart = Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 days ago
const simulationEnd = Date.now()

const simulatedUsers = 5
const simulatedPosts = 10
const simulatedViews = 10000

async function simulateEvents() {
  // connect to the database
  const connection = await initDatabase()
  // simulate users
  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulatedUsers)
      .fill(null)
      .map(
        async (_, u) =>
          await createUser({
            username: `user-${u}`,
            password: `password-${u}`,
          }),
      ),
  )
  console.log(`created ${createdUsers.length} users`)

  // simulate posts
  await Post.deleteMany({})
  const createdPosts = await Promise.all(
    Array(simulatedPosts)
      .fill(null)
      .map(async (_, p) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * simulatedUsers)]
        return await createPost(randomUser._id, {
          title: `Test post-${p}`,
          content: `This is a test post-${p}`,
        })
      }),
  )
  console.log(`created ${createdPosts.length} posts`)
  // simulate events
  await Event.deleteMany({})
  const createdViews = await Promise.all(
    Array(simulatedViews)
      .fill(null)
      .map(async () => {
        const randomPost =
          createdPosts[Math.floor(Math.random() * simulatedPosts)]
        const sessionStart =
          simulationStart +
          Math.floor(Math.random() * (simulationEnd - simulationStart))
        const sessionEnd =
          sessionStart + 1000 * Math.floor(Math.random() * (60 * 5))
        const event = await trackEvent({
          postId: randomPost._id,
          action: 'startView',
          date: new Date(sessionStart),
        })
        await trackEvent({
          postId: randomPost._id,
          action: 'endView',
          date: new Date(sessionEnd),
          session: event.session,
        })
      }),
  )
  console.log(`created ${createdViews.length} views`)
  await connection.disconnect()
}
simulateEvents()
