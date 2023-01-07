import express from "express";
import { VehicleTypeController } from "../controller/index.js";
const VehicleRouter = express.Router();

VehicleRouter.get("/:id", VehicleTypeController.getById)
VehicleRouter.get("/", VehicleTypeController.search)
VehicleRouter.post("/", VehicleTypeController.create)
VehicleRouter.patch("/", VehicleTypeController.update)
VehicleRouter.patch("/many", VehicleTypeController.updateMany)
VehicleRouter.delete("/", VehicleTypeController.delete)

export default VehicleRouter