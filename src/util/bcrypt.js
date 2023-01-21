import { SALT_ROUNDS } from "../constant/index.js";
import * as _bcrypt from "bcrypt";

const bcrypt = {
  hash(value) {
    const salt = _bcrypt.genSaltSync(SALT_ROUNDS);
    return _bcrypt.hashSync(value, salt);
  },
  compare(text, textHash) {
    return _bcrypt.compareSync(text, textHash);
  },
};

export default bcrypt;