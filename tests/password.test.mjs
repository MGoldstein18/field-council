import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/password.mjs";
test("password hashes are salted; only the matching password verifies", async () => {
  const a = await hashPassword("test-only-password");
  const b = await hashPassword("test-only-password");
  assert.notEqual(a, b);
  assert.equal(await verifyPassword("test-only-password", a), true);
  assert.equal(await verifyPassword("incorrect", a), false);
});
test("malformed hashes and oversized passwords fail closed", async () => {
  for (const hash of ["", "plaintext", "scrypt-v1:no:hash"])
    assert.equal(await verifyPassword("password", hash), false);
  assert.equal(
    await verifyPassword("x".repeat(257), await hashPassword("password")),
    false,
  );
});
