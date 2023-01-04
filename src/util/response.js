import { PER_PAGE } from "../constant/index.js";

const response = (res, code, records = [], total_count = 1, page = 1, page_count = 1) => {
    const token = res.locals;
    return {
        _metadata:
        {
            page,
            per_page: PER_PAGE,
            page_count,
            total_count,
        },
        records,
        code,
        token,
    }
}
export default response;