import express from "express";
import { UserController } from "../controller/index.js";
const UserRoute = express.Router();

UserRoute.get("/:id", UserController.getById)
UserRoute.get("/", UserController.search)
UserRoute.post("/", UserController.create)
UserRoute.patch("/", UserController.update)
UserRoute.patch("/many", UserController.updateMany)
UserRoute.delete("/", UserController.delete)

export default UserRoute