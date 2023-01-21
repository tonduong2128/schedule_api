import { PER_PAGE } from "../constant/index.js";

const response = (res, code, records = [], total_count = 1, limit = PER_PAGE, page = 1, page_count = 1) => {
    const { token } = res.locals;
    if (records?.length <= 0) { records = [] };
    return {
        _metadata:
        {
            total_count,
            limit,
            page_count,
            page,
        },
        records,
        code,
        token,
    }
}
export default response;