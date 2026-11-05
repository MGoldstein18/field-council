import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, options);
  return `scrypt-v1:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  if (
    typeof password !== "string" ||
    password.length > 256 ||
    typeof encoded !== "string"
  )
    return false;
  const match = /^scrypt-v1:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(encoded);
  if (!match) return false;
  const key = await scrypt(password, match[1], 64, options);
  return timingSafeEqual(key, Buffer.from(match[2], "hex"));
}
