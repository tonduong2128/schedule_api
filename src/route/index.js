import UserRoute from "./userRoute.js"
import AuthRoute from "./authRoute.js"
import ReservationRoute from "./reservationRoute.js"

const route = (app) => {
    app.use("/auth", AuthRoute)
    app.use("/user", UserRoute)
    app.use("/reservetion", ReservationRoute)
}

export default route