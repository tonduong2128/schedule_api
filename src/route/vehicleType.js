import express from "express";
import { VehicleTypeController } from "../controller/index.js";
const VehicleRoute = express.Router();

VehicleRoute.get("/:id", VehicleTypeController.getById)
VehicleRoute.get("/", VehicleTypeController.search)
VehicleRoute.post("/", VehicleTypeController.create)
VehicleRoute.patch("/", VehicleTypeController.update)
VehicleRoute.patch("/many", VehicleTypeController.updateMany)
VehicleRoute.delete("/", VehicleTypeController.delete)

export default VehicleRoute