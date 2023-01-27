import UserRoute from "./userRoute.js"
import AuthRoute from "./authRoute.js"
import ReservationRoute from "./reservationRoute.js"
import auth from "../middleware/auth.js"
import VehicleRoute from "./vehicleType.js"
import RoleRoute from "./roleRoute.js"
import TeacherHourRoute from "./teacherHour.js"

const route = (app) => {
    app.use("/auth", AuthRoute)
    app.use("/user", auth, UserRoute)
    app.use("/role", auth, RoleRoute)
    app.use("/reservation", auth, ReservationRoute)
    app.use("/vehicle-type", auth, VehicleRoute)
    app.use("/teacher-hour", auth, TeacherHourRoute)
}

export default route