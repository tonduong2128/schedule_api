const RESPONSE_CODE = {
    ERROR: 0,
    SUCCESS: 1,
    ERROR_EXTERNAL: 2,
    RESERVATION_EXISTS: 3,
    RESERVATION_TIME_NOT_VALID: 4,
}
const SALT_ROUNDS = 10;

const PER_PAGE = 10;

const ROLE = {
    admin: 1,
    teacher: 2,
    student: 3,

    teacher_vip: 4,
}

const STATUS_USER = {
    using: 1,
    exprid: 2,
}

const STATUS_RESERVATION = {
    new: 1,
    approval: 2,
    reject: 3,
}


export { RESPONSE_CODE, SALT_ROUNDS, PER_PAGE, ROLE, STATUS_USER, STATUS_RESERVATION }