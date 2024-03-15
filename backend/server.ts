require('dotenv').config();
const express=require('express');
const cors=require("cors");
const mongoose=require("mongoose");
const ApiRoutes=require('./routes/apiRoutes');
const { upsertSearchIndex, upsertAutocompleteIndex } = require('./middleware/middleware')
import { mongoClient } from './db/db'


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',ApiRoutes)

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await mongoClient.connect()
    console.log("Connection Success")
    await upsertSearchIndex()
    await upsertAutocompleteIndex()

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