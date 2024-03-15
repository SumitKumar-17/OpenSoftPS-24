import { Request, Response } from 'express';
import { mongoClient,MONGODB_COLLECTION, MONGODB_DATABASE } from '../db/db'
import { Movie } from '../utils/movie';

const USER_SEARCH_INDEX_NAME = 'user_search'
const USER_AUTOCOMPLETE_INDEX_NAME = 'user_autocomplete'


export const autocompleteMovies = async (req: Request, res: Response) => {
    const searchQuery = req.query.query as string;
    const plot = req.query.plot as string;

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
                  autocomplete: {
                    query: searchQuery,
                    path: 'title',
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
            index: USER_AUTOCOMPLETE_INDEX_NAME,
            // https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/#options
            autocomplete: {
              query: searchQuery,
              path: 'title',
              tokenOrder: 'sequential',
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
