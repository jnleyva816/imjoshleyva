import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { eventRoutes } from './routes/events.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'

// This is the main entry point for the application
const app = express()
// This middleware allows requests from any origin
app.use(cors())
// This middleware parses the request body as JSON
app.use(bodyParser.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

// This starts the ApolloServer
apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return {
          auth: req.auth,
        }
      },
    }),
  ),
)

// This is where we define our routes
postsRoutes(app)
userRoutes(app)
eventRoutes(app)

// This is a simple route that returns "Hello World!"
app.get('/', (req, res) => {
  res.send(
    "Welcome to Joshua Leyva's API! access <a href='http://localhost:3000/graphql'>http://localhost:300/graphql</a> to interact with the API",
  )
})

export { app }
