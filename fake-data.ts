import { config } from 'dotenv';
import {faker} from '@faker-js/faker'
import * as mongodb from 'mongodb';

const envFile = process.argv[process.argv.length - 1];
config({ path: envFile });

export const MONGODB_DATABASE = 'sample_mflix';
export const MONGODB_COLLECTION = 'embedded_movies';

const MONGODB_HOST = process.env.MONGODB_HOST!;
const MONGODB_USER = process.env.MONGODB_USERNAME;
const MONGODB_PASS = process.env.MONGODB_PASSWORD;

export const mongoClient = new mongodb.MongoClient(MONGODB_HOST, {
  auth: { username: MONGODB_USER, password: MONGODB_PASS },
});

interface Awards {
  wins: number;
  nominations: number;
  text: string;
}

interface imdb {
  rating: number;
  votes: number;
  id: number;
}

interface Viewer {
  rating: number;
  numReviews: number;
}

interface tomatoes {
  viewer: Viewer;
  production: string;
  lastupdated: Date;
}

export interface Movie {
  _id: string;
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
  type: string;
  tomatoes: tomatoes;
  plot_embedding: string[];
}

async function main() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(MONGODB_DATABASE);
    const collection = db.collection<Movie>(MONGODB_COLLECTION);

    const users = Array.from({ length: 10000 }).map((_value, index) => {
      faker.seed(index);
      return createRandomUser();
    });

    await collection.insertMany(users);
    console.log('Data inserted successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoClient.close();
  }
}

function createRandomUser(): Movie {
  return {
    _id: faker.datatype.uuid(),
    plot: faker.lorem.paragraph(),
    genres: [faker.random.word(), faker.random.word()],
    runtime: faker.datatype.number({ min: 60, max: 180 }),
    cast: [faker.name.firstName(), faker.name.firstName()],
    num_mflix_comments: faker.datatype.number({ min: 0, max: 1000 }),
    poster: faker.image.imageUrl(),
    title: faker.random.words(),
    fullplot: faker.lorem.paragraphs(3),
    languages: [faker.random.locale(), faker.random.locale()],
    released: faker.date.past(),
    directors: [faker.name.firstName(), faker.name.firstName()],
    writers: [faker.name.firstName(), faker.name.firstName()],
    awards: { wins: faker.datatype.number({ min: 0, max: 10 }), nominations: faker.datatype.number({ min: 0, max: 20 }), text: faker.lorem.sentence() },
    lastupdated: faker.date.recent().toISOString(),
    year: faker.datatype.number({ min: 1900, max: 2022 }),
    imdb: { rating: faker.datatype.number({ min: 0, max: 10 }), votes: faker.datatype.number({ min: 0, max: 10000 }), id: faker.datatype.number({ min: 1000, max: 2000 }) },
    countries: [faker.address.country(), faker.address.country()],
    type: faker.random.word(),
    tomatoes: { viewer: { rating: faker.datatype.number({ min: 0, max: 10 }), numReviews: faker.datatype.number({ min: 0, max: 1000 }) }, production: faker.company.companyName(), lastupdated: faker.date.recent() },
    plot_embedding: [faker.lorem.word(), faker.lorem.word()],
  };
}

main();
