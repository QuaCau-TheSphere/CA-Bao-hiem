import { assertEquals } from "@std/assert";
import { add } from "./nháp.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
