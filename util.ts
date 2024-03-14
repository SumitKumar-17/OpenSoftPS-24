import * as mongodb from 'mongodb'

export const MONGODB_DATABASE = 'sample_mflix'
export const MONGODB_COLLECTION = 'embedded_movies'

const MONGODB_HOST = process.env.MONGODB_HOST!
const MONGODB_USER = process.env.MONGODB_USERNAME
const MONGODB_PASS = process.env.MONGODB_PASSWORD

export const mongoClient = new mongodb.MongoClient(MONGODB_HOST, {
  auth: {username: MONGODB_USER, password: MONGODB_PASS},
})

// export interface User {
//   userId: string
//   fullName: string
//   email: string
//   avatar: string
//   registeredAt: Date
//   country: string
// }
interface Awards {
  wins: number;
  nominations: number;
  text: string;
}

interface imdb{
  rating: number;
  votes: number;
  id: number;

}
interface Viewer{
  rating: number;
  numReviews: number;
}


interface tomatoes{
  viewer: Viewer;
  production: string;
  lastupdated: Date;
}
export interface Movie {
  _id: string ;
  plot: string;
  genres: string[];
  runtime: number;
  cast: string[];
  num_mflix_comments: number;
  poster: string;
  title: string;
  fullplot: string;
  languages: string[];
  released: Date;
  directors: string[];
  writers: string[];
  awards: Awards;
  lastupdated: string;
  year: number;
  imdb: imdb;
  countries: string[];
  type: string; // Assuming type is a string
  tomatoes: tomatoes;
  plot_embedding: string[]; // Assuming plot_embedding is an array of strings
}
