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
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});
app.use(cors({
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

route(app);


app.get('/', function (req, res) {
  res.sendStatus(404)
})

cron.schedule("0 0 1 * * *", async () => {
  await CheckUserExpired();
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`)
})