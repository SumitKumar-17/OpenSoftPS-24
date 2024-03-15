import * as mongodb from 'mongodb'

export const MONGODB_DATABASE = 'sample_mflix'
export const MONGODB_COLLECTION = 'embedded_movies'

const MONGODB_HOST = process.env.MONGODB_HOST!
const MONGODB_USER = process.env.MONGODB_USERNAME
const MONGODB_PASS = process.env.MONGODB_PASSWORD

export const mongoClient = new mongodb.MongoClient(MONGODB_HOST, {
  auth: {username: MONGODB_USER, password: MONGODB_PASS},
})