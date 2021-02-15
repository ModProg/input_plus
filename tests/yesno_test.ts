import { assertEquals } from "../dev_deps.ts";
import { ynInput } from "../extensions/yesno.ts";
import { InputConf } from "../helpers.ts";
import { TestReader, TestWriter } from "./mod_test.ts";

Deno.test("ynInput yes", async () => {
  const stdin = new TestReader("y");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  const input = await ynInput("Deno is neat?", "", { inputConf: testConf });
  console.log("\n---");
  assertEquals(input, true);
});

Deno.test("ynInput no", async () => {
  const stdin = new TestReader("n");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  const input = await ynInput("Deno is neat?", "y", { inputConf: testConf });
  console.log("\n---");
  assertEquals(input, false);
});

Deno.test("ynInput default yes", async () => {
  const stdin = new TestReader("\n");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  const input = await ynInput("Deno is neat?", "y", { inputConf: testConf });
  console.log("\n---");
  assertEquals(input, true);
});

Deno.test("ynInput default no", async () => {
  const stdin = new TestReader("\n");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  const input = await ynInput("Deno is neat?", "n", { inputConf: testConf });
  console.log("\n---");
  assertEquals(input, false);
});

Deno.test("ynInput without default yes", async () => {
  const stdin = new TestReader("\ny");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  const input = await ynInput("Deno is neat?", "", { inputConf: testConf });
  console.log("\n---");
  assertEquals(input, true);
});
