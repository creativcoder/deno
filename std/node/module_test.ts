/* eslint-disable @typescript-eslint/no-var-requires */

const { test } = Deno;
import { assertEquals, assert, assertStrContains } from "../testing/asserts.ts";
import { createRequire } from "./module.ts";

const require = createRequire(import.meta.url);

test(function requireSuccess() {
  // Relative to import.meta.url
  const result = require("./tests/cjs/cjs_a.js");
  assert("helloA" in result);
  assert("helloB" in result);
  assert("C" in result);
  assert("leftPad" in result);
  assertEquals(result.helloA(), "A");
  assertEquals(result.helloB(), "B");
  assertEquals(result.C, "C");
  assertEquals(result.leftPad("pad", 4), " pad");
});

test(function requireCycle() {
  const resultA = require("./tests/cjs/cjs_cycle_a");
  const resultB = require("./tests/cjs/cjs_cycle_b");
  assert(resultA);
  assert(resultB);
});

test(function requireBuiltin() {
  const fs = require("fs");
  assert("readFileSync" in fs);
  const { readFileSync, isNull, extname } = require("./tests/cjs/cjs_builtin");
  assertEquals(
    readFileSync("./node/_fs/testdata/hello.txt", { encoding: "utf8" }),
    "hello world"
  );
  assert(isNull(null));
  assertEquals(extname("index.html"), ".html");
});

test(function requireIndexJS() {
  const { isIndex } = require("./tests/cjs");
  assert(isIndex);
});

test(function requireNodeOs() {
  const os = require("os");
  assert(os.arch);
  assert(typeof os.arch() == "string");
});

test(function requireStack() {
  const { hello } = require("./tests/cjs/cjs_throw");
  try {
    hello();
  } catch (e) {
    assertStrContains(e.stack, "/tests/cjs/cjs_throw.js");
  }
});
