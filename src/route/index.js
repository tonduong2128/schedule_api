import UserRouter from "./userRoute"

const route = (app) => {
    app.use("/user", UserRouter)
}
export default route