import express from "express";
import { AuthController } from "../controller/index.js";
import auth from "../middleware/auth.js";
const AuthRoute = express.Router();

AuthRoute.post("/login", AuthController.login)
AuthRoute.post("/reset", AuthController.reset)
AuthRoute.post("/change-password", auth, AuthController.changePassword)
AuthRoute.post("/reset-force", auth, AuthController.resetForce)

export default AuthRoute