import { assert, assertStringIncludes } from "../dev_deps.ts";
import { cliInput } from "../extensions.ts";
import { ASCII, InputConf } from "../helpers.ts";
import { TestReader, TestWriter } from "./mod_test.ts";

Deno.test("cli exit eot", async () => {
  const stdin = new TestReader(ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  await cliInput([], { inputConf: testConf });
  console.log("---");
  assert(true);
});

Deno.test("cli exit command string", async () => {
  const stdin = new TestReader("exit\n");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  await cliInput([{ keywords: "exit", exec: -1 }], { inputConf: testConf });
  console.log("---");
  assert(true);
});

Deno.test("cli exit command function", async () => {
  const stdin = new TestReader("exit\n");
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  await cliInput([{ keywords: "exit", exec: () => -1 }], {
    inputConf: testConf,
  });
  console.log("---");
  assert(true);
});

Deno.test("cli command string", async () => {
  const stdin = new TestReader("test\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };
  console.log("\n---");
  await cliInput([{ keywords: "test", exec: "hello" }], {
    inputConf: testConf,
  });
  console.log("---");
  assertStringIncludes(stdout.input, "hello");
});

Deno.test("cli command function", async () => {
  const stdin = new TestReader("test\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };

  var test = false;

  console.log("\n---");
  await cliInput(
    [
      {
        keywords: "test",
        exec: () => {
          test = true;
          return "hello";
        },
      },
    ],
    {
      inputConf: testConf,
    },
  );
  console.log("---");
  assert(test);
  assertStringIncludes(stdout.input, "hello");
});

Deno.test("cli command function arguments", async () => {
  const stdin = new TestReader("test hi\ntest ups\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };

  var testHi = false,
    testUps = false;

  console.log("\n---");
  await cliInput(
    [
      {
        keywords: "test",
        exec: (args) => {
          if (args.includes("hi")) testHi = true;
          if (args.includes("ups")) testUps = true;
          return args.includes("hi") ? "no" : "way";
        },
      },
    ],
    {
      inputConf: testConf,
    },
  );
  console.log("---");
  assert(testHi && testUps);
  assertStringIncludes(stdout.input, "no");
  assertStringIncludes(stdout.input, "way");
});

Deno.test("cli prefix", async () => {
  const stdin = new TestReader("test\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };

  console.log("\n---");
  await cliInput(
    [
      {
        keywords: "test",
        exec: "nice",
      },
    ],
    {
      inputConf: testConf,
      inputPre: "> ",
      outputPre: "< ",
    },
  );
  console.log("---");
  assertStringIncludes(stdout.input, "> test");
  assertStringIncludes(stdout.input, "< nice");
});

Deno.test("cli completion sub function", async () => {
  const stdin = new TestReader("te\t  he\t\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };

  console.log("\n---");
  await cliInput(
    [
      {
        keywords: "test",
        exec: "nice",
        subEntries: [{ keywords: "help", exec: "not so nice" }],
      },
    ],
    {
      inputConf: testConf,
    },
  );
  console.log("---");
  assertStringIncludes(stdout.input, "not so nice");
});

Deno.test("cli completion arguments", async () => {
  const stdin = new TestReader("add\t  p\t 1\n" + ASCII.EOT);
  const stdout = new TestWriter();
  const testConf: InputConf = {
    reader: stdin,
    writer: stdout,
    setRaw: false,
  };

  console.log("\n---");
  await cliInput(
    [
      {
        keywords: "add",
        exec: (args) => {
          return args
            .reduce(
              (sum, v) => sum + (v == "pi" ? Math.PI : Number.parseInt(v)),
              0,
            )
            .toString();
        },
        subEntries: [{ keywords: "pi" }],
      },
    ],
    {
      inputConf: testConf,
    },
  );
  console.log("---");
  assertStringIncludes(stdout.input, (Math.PI + 1).toString());
});
