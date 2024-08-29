import mongoose from 'mongoose'

// Initialize the database connection
export function initDatabase() {
  // Get the database URL from the environment
  const DATABASE_URL = process.env.DATABASE_URL
  // When the connection is opened, log a success message
  mongoose.connection.on('open', () => {
    console.log('Successfully connected to database: ', DATABASE_URL)
  })

  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
