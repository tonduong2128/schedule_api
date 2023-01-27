import express from "express";
import { ReservationController } from "../controller/index.js";
const ReservationRoute = express.Router();

ReservationRoute.get("/:id", ReservationController.getById)
ReservationRoute.get("/", ReservationController.search)
ReservationRoute.post("/", ReservationController.create)
ReservationRoute.patch("/", ReservationController.update)
ReservationRoute.patch("/many", ReservationController.updateMany)
ReservationRoute.delete("/", ReservationController.delete)

export default ReservationRoute