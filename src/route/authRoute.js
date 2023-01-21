import express from "express";
import { AuthController } from "../controller/index.js";
import auth from "../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/login", AuthController.login)
AuthRouter.post("/reset", AuthController.reset)
AuthRouter.post("/change-password", auth, AuthController.changePassword)
AuthRouter.post("/reset-force", auth, AuthController.resetForce)

export default AuthRouter