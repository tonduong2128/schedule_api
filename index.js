import express from 'express'
import route from './src/route/index.js';
import dotenv from "dotenv";
import cors from 'cors'
import cron from 'node-cron'
import CheckUserExpired from './src/function/CheckUserExpired.js';

if (process.env.NODE_ENV == "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const app = express()
app.use(cors({
  origin: "*",
  allowedHeaders: "*"
}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Private-Network", true);
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next()
})
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

route(app);


app.get('/', function (req, res) {
  res.sendStatus(404)
})

cron.schedule("0 0 0 * * *", async () => {
  await CheckUserExpired();
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`)
})