import express from "express";
import { UserController } from "../controller";
const UserRouter = express.Router();

UserRouter.get("/:id", UserController.getById)
UserRouter.get("/", UserController.search)
UserRouter.post("/", UserController.create)
UserRouter.patch("/", UserController.update)
UserRouter.delete("/", UserController.delete)

export default UserRouter