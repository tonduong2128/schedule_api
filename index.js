import express from 'express'
import route from './src/route/index.js';
import dotenv from "dotenv";
import cors from 'cors'
if (process.env.NODE_ENV == "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

route(app);

app.get('/', function (req, res) {
  res.sendStatus(404)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`)
})