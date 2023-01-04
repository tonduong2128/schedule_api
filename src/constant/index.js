const RESPONSE_CODE = {
    ERROR: 0,
    SUCCESS: 1,
    ERROR_EXTERNAL: 2,
}
const SALT_ROUNDS = 10;

const PER_PAGE = 10;

const ROLE = {
    admin: 1,
    teacher: 2,
    student: 3,

    teacher_vip: 4,
}


export { RESPONSE_CODE, SALT_ROUNDS, PER_PAGE, ROLE }