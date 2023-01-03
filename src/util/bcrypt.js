import { CONSTANT } from "../common/index.js";
import * as _bcrypt from "bcrypt";

const bcrypt = {
  hash(value) {
    const salt = _bcrypt.genSaltSync(CONSTANT.SALT_ROUNDS);
    return _bcrypt.hashSync(value, salt);
  },
  compare(text, textHash) {
    return _bcrypt.compareSync(text, textHash);
  },
};

export default bcrypt;