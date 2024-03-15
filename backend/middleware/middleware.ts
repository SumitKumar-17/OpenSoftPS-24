import { MONGODB_COLLECTION, MONGODB_DATABASE } from '../db/db'
import {request} from 'urllib'


const ATLAS_API_BASE_URL = 'https://cloud.mongodb.com/api/atlas/v1.0'
const ATLAS_PROJECT_ID = process.env.MONGODB_ATLAS_PROJECT_ID
const ATLAS_CLUSTER_NAME = process.env.MONGODB_ATLAS_CLUSTER
const ATLAS_CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${ATLAS_PROJECT_ID}/clusters/${ATLAS_CLUSTER_NAME}`
const ATLAS_SEARCH_INDEX_API_URL = `${ATLAS_CLUSTER_API_URL}/fts/indexes`

const ATLAS_API_PUBLIC_KEY = process.env.MONGODB_ATLAS_PUBLIC_KEY
const ATLAS_API_PRIVATE_KEY = process.env.MONGODB_ATLAS_PRIVATE_KEY
const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`

const USER_SEARCH_INDEX_NAME = 'user_search'
const USER_AUTOCOMPLETE_INDEX_NAME = 'user_autocomplete'


async function findIndexByName(indexName: string) {
    const allIndexesResponse = await request(
      `${ATLAS_SEARCH_INDEX_API_URL}/${MONGODB_DATABASE}/${MONGODB_COLLECTION}`,
      {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        digestAuth: DIGEST_AUTH,
      }
    )
  
    return (allIndexesResponse.data as any[]).find((i) => i.name === indexName)
  }
  
  async function upsertSearchIndex() {
    const userSearchIndex = await findIndexByName(USER_SEARCH_INDEX_NAME)
    if (!userSearchIndex) {
      await request(ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          name: USER_SEARCH_INDEX_NAME,
          database: MONGODB_DATABASE,
          collectionName: MONGODB_COLLECTION,
          // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#syntax
          mappings: {
            dynamic: true,
          },
        },
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        digestAuth: DIGEST_AUTH,
      })
    }
  }
  
  async function upsertAutocompleteIndex() {
    const userAutocompleteIndex = await findIndexByName(USER_AUTOCOMPLETE_INDEX_NAME)
    if (!userAutocompleteIndex) {
      await request(ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          name: USER_AUTOCOMPLETE_INDEX_NAME,
          database: MONGODB_DATABASE,
          collectionName: MONGODB_COLLECTION,
          // https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/#index-definition
          mappings: {
            dynamic: false,
            fields: {
              title: [
                {
                  foldDiacritics: false,
                  maxGrams: 7,
                  minGrams: 3,
                  tokenization: 'edgeGram',
                  type: 'autocomplete',
                },
              ],
            },
          },
        },
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        digestAuth: DIGEST_AUTH,
      })
    }
  }

    export { upsertSearchIndex, upsertAutocompleteIndex }