import * as _crypto from "crypto";

const crypto = {
    randomString() {
        return _crypto.randomBytes(20).toString('hex');
    }
}

export default crypto