import express from 'express'
import route from './src/route';
import dotenv from "dotenv";
dotenv.config();
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

route(app);

app.get('/', function (req, res) {
  res.sendStatus(404)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`)
})