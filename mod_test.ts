import { assertStringIncludes } from "https://deno.land/std@0.81.0/testing/asserts.ts";
import { assertEquals, color, decode, encode } from "./dev_deps.ts";
import { readInput } from "./mod.ts";
import { basicCompletion, basicHighlighter, generateKeyMap } from "./utils.ts";

class TestReader implements Deno.Reader {
  rid: number;
  input: string;
  index = 0;

  constructor(input: string) {
    this.rid = 0;
    this.input = input;
  }
  read(p: Uint8Array): Promise<number | null> {
    if (this.index < this.input.length) {
      const enc = encode(this.input[this.index++]);
      p.set(enc);
      return Promise.resolve(enc.length);
    }
    return Promise.resolve(null);
  }
}

class TestWriter implements Deno.Writer {
  input = "";
  write(p: Uint8Array): Promise<number> {
    this.input += decode(p);
    return Deno.stdout.write(p);
  }
}

Deno.test("readInput single line", async () => {
  const stdin = new TestReader("Tee\b\best with nönẽ\bä ẠSCÍµ \r");
  const stdout = new TestWriter();
  console.log("\n---");
  const input = await readInput({
    reader: stdin,
    writer: stdout,
    setRaw: false,
  });
  console.log("\n---");
  assertEquals(input, "Test with nönä ẠSCÍµ ");
});

Deno.test("readInput multi line", async () => {
  const stdin = new TestReader(
    "Hii\b\nMy name is \b: V!\n\b\b\nNice to meet you.\x04",
  );
  const stdout = new TestWriter();
  console.log("\n---");
  const input = await readInput({
    reader: stdin,
    writer: stdout,
    setRaw: false,
    keyMap: generateKeyMap(3),
  });
  console.log("\n---");
  assertEquals(input, "Hi\nMy name is: V\nNice to meet you.\n");
});

Deno.test("basicComplete", async () => {
  const stdin = new TestReader("ab\t\r");
  const stdout = new TestWriter();
  console.log("\n---");
  const input = await readInput({
    reader: stdin,
    writer: stdout,
    setRaw: false,
    keyMap: generateKeyMap(1, {
      completion: basicCompletion(["abc"]),
    }),
  });
  console.log("\n---");
  assertEquals(input, "abc");
});

Deno.test("basicHighlight", async () => {
  const stdin = new TestReader("([x])\r");
  const stdout = new TestWriter();
  console.log("\n---");
  assertEquals(
    await readInput({
      reader: stdin,
      writer: stdout,
      setRaw: false,
      highlighter: basicHighlighter(
        new Map<
          string | RegExp | (string | RegExp)[],
          ((input: string) => string) | ((input: string) => string)[]
        >([[["(", ")"], color.red], ["x", color.italic]]),
      ),
    }),
    "([x])",
  );
  console.log("\n---");
  assertStringIncludes(
    stdout.input,
    color.red("(") + "[" + color.italic("x") + "]" + color.red(")"),
  );
});
