import UserRoute from "./userRoute.js"
import AuthRoute from "./authRoute.js"
import ReservationRoute from "./reservationRoute.js"
import auth from "../middleware/auth.js"

const route = (app) => {
    app.use("/auth", AuthRoute)
    app.use("/user", auth, UserRoute)
    app.use("/reservetion", auth, ReservationRoute)
}

export default route