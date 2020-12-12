import { readInput } from "./mod.ts";
import { assertEquals, decode, encode } from "./dev_deps.ts";
import { generateKeyMap } from "./utils.ts";

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
    return Promise.resolve(p.length);
  }
}

Deno.test("readInput single line", async () => {
  const stdin = new TestReader("Tee\b\best with nönẽ\bä ẠSCÍµ \r");
  const stdout = new TestWriter();
  const input = await readInput({
    reader: stdin,
    writer: stdout,
    setRaw: false,
  });
  assertEquals(input, "Test with nönä ẠSCÍµ ");
});

Deno.test("readInput multi line", async () => {
  const stdin = new TestReader(
    "Hii\b\nMy name is \b: V!\n\b\b\nNice to meet you.\x04",
  );
  const stdout = new TestWriter();
  const input = await readInput({
    reader: stdin,
    writer: stdout,
    setRaw: false,
    keyMap: generateKeyMap(3),
  });
  assertEquals(input, "Hi\nMy name is: V\nNice to meet you.\n");
});
