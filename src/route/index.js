import UserRoute from "./userRoute.js"
import AuthRoute from "./authRoute.js"
import ReservationRoute from "./reservationRoute.js"
import auth from "../middleware/auth.js"
import VehicleRouter from "./vehicleType.js"

const route = (app) => {
    app.use("/auth", AuthRoute)
    app.use("/user", auth, UserRoute)
    app.use("/reservation", auth, ReservationRoute)
    app.use("/vehicle-type", auth, VehicleRouter)
}

export default route