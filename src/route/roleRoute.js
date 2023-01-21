import express from "express";
import { RoleController } from "../controller/index.js";
const RoleRoute = express.Router();

RoleRoute.get("/:id", RoleController.getById)
RoleRoute.get("/", RoleController.search)
RoleRoute.post("/", RoleController.create)
RoleRoute.patch("/", RoleController.update)
RoleRoute.patch("/many", RoleController.updateMany)
RoleRoute.delete("/", RoleController.delete)

export default RoleRoute