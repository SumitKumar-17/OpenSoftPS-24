import { Request, Response } from 'express';
import { mongoClient,MONGODB_COLLECTION, MONGODB_DATABASE } from '../db/db'
import { Movie } from '../utils/movie';

const USER_SEARCH_INDEX_NAME = 'user_search'
const USER_AUTOCOMPLETE_INDEX_NAME = 'user_autocomplete'



export const searchMovies = async (req: Request, res: Response) => {
    const searchQuery = req.query.query as string;
    const plot = req.query.plot as string;

    if (!searchQuery || searchQuery.length < 2) {
        res.json([]);
        return;
    }

    const db = mongoClient.db('sample_mflix');
    const collection = db.collection<Movie>(MONGODB_COLLECTION)

    const pipeline = [];


  if (plot) {
    pipeline.push({
      $search: {
        index: USER_SEARCH_INDEX_NAME,
        compound: {
          must: [
            {
              text: {
                query: searchQuery,
                path: ['title', 'plot'],
                fuzzy: {},
              },
            },
            {
              text: {
                query: plot,
                path: 'plot',
              },
            },
          ],
        },
      },
    })
  } else {
    pipeline.push({
      $search: {
        index: USER_SEARCH_INDEX_NAME,
        text: {
          query: searchQuery,
          path: ['title', 'plot'],
          fuzzy: {},
        },
      },
    })
  }

  pipeline.push({
    $project: {
      _id: 0,
      score: {$meta: 'searchScore'},
      userId: 1,
      title: 1,
      plot: 1,
      poster: 1,
    },
  })

  const result = await collection.aggregate(pipeline).sort({score: -1}).limit(10)
  const array = await result.toArray()
  res.json(array)
}

 
