import express from "express";
import { ReservationController } from "../controller/index.js";
const ReservationRouter = express.Router();

ReservationRouter.get("/:id", ReservationController.getById)
ReservationRouter.get("/", ReservationController.search)
ReservationRouter.post("/", ReservationController.create)
ReservationRouter.patch("/", ReservationController.update)
ReservationRouter.delete("/", ReservationController.delete)

export default ReservationRouter