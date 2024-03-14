import express from 'express'
import {Filter} from 'mongodb'
import cors from 'cors'
import {mongoClient, MONGODB_COLLECTION} from './util'
import {Movie} from './util'

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:4000'}))

app.get('/search', async (req, res) => {
  const searchQuery = req.query.query as string
  const plot = req.query.plot as string

  if (!searchQuery || searchQuery.length < 2) {
    res.json([])
    return
  }

  const db = mongoClient.db('sample_mflix')
  const collection = db.collection<Movie>(MONGODB_COLLECTION)

  const filter: Filter<Movie> = {
    $text: {$search: searchQuery, $caseSensitive: false, $diacriticSensitive: false},
  }
  if (plot) filter.plot = plot

  const result = await collection
    .find(filter)
    .project({score: {$meta: 'textScore'}, _id: 0})
    .sort({score: {$meta: 'textScore'}})
    .limit(10)

  const array = await result.toArray()

  res.json(array)
})

async function main() {
  try {
    await mongoClient.connect()

    const db = mongoClient.db('sample_mflix')
    const collection = db.collection<Movie>(MONGODB_COLLECTION)

    // Text index for searching fullName and email
    await collection.createIndexes([{name: 'title_plot_text', key: {title: 'text', plot: 'text'}}])

    app.listen(3000, () => console.log('http://localhost:3000/search?query=dark'))
  } catch (err) {
    console.log(err)
  }

  process.on('SIGTERM', async () => {
    await mongoClient.close()
    process.exit(0)
  })
}

main()
