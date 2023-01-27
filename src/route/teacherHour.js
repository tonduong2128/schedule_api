import express from "express";
import { TeacherHourController } from "../controller/index.js";
const TeacherHourRouter = express.Router();

TeacherHourRouter.get("/:id", TeacherHourController.getById)
TeacherHourRouter.get("/", TeacherHourController.search)
TeacherHourRouter.post("/", TeacherHourController.create)
TeacherHourRouter.patch("/", TeacherHourController.update)
TeacherHourRouter.patch("/many", TeacherHourController.updateMany)
TeacherHourRouter.delete("/", TeacherHourController.delete)

export default TeacherHourRouter