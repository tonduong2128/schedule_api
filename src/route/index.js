import UserRoute from "./userRoute.js"
import AuthRoute from "./authRoute.js"
import ReservationRoute from "./reservationRoute.js"
import auth from "../middleware/auth.js"
import VehicleRouter from "./vehicleType.js"
import RoleRoute from "./roleRoute.js"

const route = (app) => {
    app.use("/auth", AuthRoute)
    app.use("/user", auth, UserRoute)
    app.use("/role", auth, RoleRoute)
    app.use("/reservation", auth, ReservationRoute)
    app.use("/vehicle-type", auth, VehicleRouter)
}

export default route