import express from "express";
import { AuthController } from "../controller/index.js";
const AuthRouter = express.Router();

AuthRouter.post("/login", AuthController.login)

export default AuthRouter